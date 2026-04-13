using Api_Gateway.DAL;
using Api_Gateway.DTO.Auth;
using Api_Gateway.DTO.Common;
using Api_Gateway.Models;
using Api_Gateway.Services;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class AuthBLL
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtService _jwtService;
        private readonly PasswordService _passwordService;

        public AuthBLL(IUnitOfWork unitOfWork, JwtService jwtService, PasswordService passwordService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _passwordService = passwordService;
        }

        public async Task<ApiResponse<LoginResponseDTO>> Login(LoginRequestDTO request)
        {
            try
            {
                // Tìm tài khoản
                var taiKhoan = await _unitOfWork.TaiKhoans.Query()
                    .Include(t => t.NguoiDung)
                    .FirstOrDefaultAsync(t => t.TenDangNhap == request.TenDangNhap);

                if (taiKhoan == null)
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Tên đăng nhập không tồn tại");
                }

                // Kiểm tra mật khẩu
                if (!_passwordService.VerifyPassword(request.MatKhau, taiKhoan.MatKhau))
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Mật khẩu không đúng");
                }

                // Kiểm tra trạng thái
                if (taiKhoan.TrangThai == false)
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Tài khoản đã bị khóa");
                }

                // Lấy thông tin actor
                int? maActor = null;
                string? maActorCode = null;

                if (taiKhoan.VaiTro == "Admin")
                {
                    var admin = await _unitOfWork.Admins.FirstOrDefaultAsync(a => a.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = admin?.MaAdmin;
                    maActorCode = admin?.MaNv;
                }
                else if (taiKhoan.VaiTro == "CanBo")
                {
                    var canBo = await _unitOfWork.CanBoKtxes.FirstOrDefaultAsync(c => c.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = canBo?.MaCanBo;
                    maActorCode = canBo?.MaNv;
                }
                else if (taiKhoan.VaiTro == "SinhVien")
                {
                    var sinhVien = await _unitOfWork.SinhViens.FirstOrDefaultAsync(s => s.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = sinhVien?.MaSinhVien;
                    maActorCode = sinhVien?.MaSv;
                }

                // Tạo token
                var token = _jwtService.GenerateToken(
                    taiKhoan.MaTaiKhoan,
                    taiKhoan.TenDangNhap,
                    taiKhoan.VaiTro,
                    taiKhoan.NguoiDung!.MaNguoiDung,
                    maActor
                );

                var response = new LoginResponseDTO
                {
                    Token = token,
                    VaiTro = taiKhoan.VaiTro,
                    MaTaiKhoan = taiKhoan.MaTaiKhoan,
                    MaNguoiDung = taiKhoan.NguoiDung.MaNguoiDung,
                    HoTen = taiKhoan.NguoiDung.HoTen,
                    Email = taiKhoan.NguoiDung.Email,
                    MaActor = maActor,
                    MaActorCode = maActorCode
                };

                return ApiResponse<LoginResponseDTO>.SuccessResponse(response, "Đăng nhập thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<LoginResponseDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Register(RegisterRequestDTO request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Kiểm tra tên đăng nhập đã tồn tại
                if (await _unitOfWork.TaiKhoans.AnyAsync(t => t.TenDangNhap == request.TenDangNhap))
                {
                    return ApiResponse<string>.ErrorResponse("Tên đăng nhập đã tồn tại");
                }

                // Kiểm tra email đã tồn tại
                if (await _unitOfWork.NguoiDungs.AnyAsync(n => n.Email == request.Email))
                {
                    return ApiResponse<string>.ErrorResponse("Email đã được sử dụng");
                }

                // Kiểm tra CCCD đã tồn tại
                if (await _unitOfWork.NguoiDungs.AnyAsync(n => n.Cccd == request.CCCD))
                {
                    return ApiResponse<string>.ErrorResponse("CCCD đã được sử dụng");
                }

                // Tạo tài khoản
                var taiKhoan = new TaiKhoan
                {
                    TenDangNhap = request.TenDangNhap,
                    MatKhau = _passwordService.HashPassword(request.MatKhau),
                    VaiTro = request.VaiTro,
                    TrangThai = true,
                    NgayTao = DateTime.Now
                };
                await _unitOfWork.TaiKhoans.AddAsync(taiKhoan);
                await _unitOfWork.SaveChangesAsync();

                // Tạo người dùng
                var nguoiDung = new NguoiDung
                {
                    MaTaiKhoan = taiKhoan.MaTaiKhoan,
                    HoTen = request.HoTen,
                    GioiTinh = request.GioiTinh,
                    NgaySinh = DateOnly.FromDateTime(request.NgaySinh),
                    SoDienThoai = request.SoDienThoai,
                    Email = request.Email,
                    Cccd = request.CCCD,
                    DiaChi = request.DiaChi,
                    NgayTao = DateTime.Now
                };
                await _unitOfWork.NguoiDungs.AddAsync(nguoiDung);
                await _unitOfWork.SaveChangesAsync();

                // Tạo bảng riêng theo vai trò
                if (request.VaiTro == "Admin")
                {
                    if (string.IsNullOrEmpty(request.MaNV))
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<string>.ErrorResponse("Mã nhân viên không được để trống cho Admin");
                    }

                    var admin = new Admin
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaNv = request.MaNV,
                        ChucVu = request.ChucVu,
                        PhongBan = request.PhongBan,
                        NgayVaoLam = request.NgayVaoLam.HasValue ? DateOnly.FromDateTime(request.NgayVaoLam.Value) : null,
                        NgayTao = DateTime.Now
                    };
                    await _unitOfWork.Admins.AddAsync(admin);
                }
                else if (request.VaiTro == "CanBo")
                {
                    if (string.IsNullOrEmpty(request.MaNV))
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<string>.ErrorResponse("Mã nhân viên không được để trống cho Cán bộ");
                    }

                    var canBo = new CanBoKtx
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaNv = request.MaNV,
                        ChucVu = request.ChucVu,
                        PhongBan = request.PhongBan,
                        NgayVaoLam = request.NgayVaoLam.HasValue ? DateOnly.FromDateTime(request.NgayVaoLam.Value) : null,
                        NgayTao = DateTime.Now
                    };
                    await _unitOfWork.CanBoKtxes.AddAsync(canBo);
                }
                else if (request.VaiTro == "SinhVien")
                {
                    if (string.IsNullOrEmpty(request.MaSV))
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<string>.ErrorResponse("Mã sinh viên không được để trống");
                    }

                    var sinhVien = new SinhVien
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaSv = request.MaSV,
                        Khoa = request.Khoa,
                        Nganh = request.Nganh,
                        Lop = request.Lop,
                        NamHoc = request.NamHoc,
                        DiemTb = request.DiemTB,
                        NgayTao = DateTime.Now
                    };
                    await _unitOfWork.SinhViens.AddAsync(sinhVien);
                }

                await _unitOfWork.CommitAsync();

                return ApiResponse<string>.SuccessResponse("Đăng ký thành công", "Đăng ký thành công");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
