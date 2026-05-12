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

        public async Task<ApiResponse<List<UserDTO>>> GetUsers(string? vaiTro, bool? trangThai)
        {
            try
            {
                var query = _unitOfWork.TaiKhoans.Query()
                    .Include(t => t.NguoiDung)
                        .ThenInclude(n => n!.Admin)
                    .Include(t => t.NguoiDung)
                        .ThenInclude(n => n!.CanBoKtx)
                    .Include(t => t.NguoiDung)
                        .ThenInclude(n => n!.SinhVien)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(vaiTro))
                {
                    query = query.Where(t => t.VaiTro == vaiTro);
                }

                if (trangThai.HasValue)
                {
                    query = query.Where(t => t.TrangThai == trangThai.Value);
                }

                var taiKhoans = await query
                    .OrderBy(t => t.MaTaiKhoan)
                    .ToListAsync();

                var users = taiKhoans.Select(t =>
                {
                    var nguoiDung = t.NguoiDung;
                    var dto = new UserDTO
                    {
                        MaTaiKhoan = t.MaTaiKhoan,
                        TenDangNhap = t.TenDangNhap,
                        VaiTro = t.VaiTro,
                        TrangThai = t.TrangThai ?? false,
                        NgayTao = t.NgayTao,
                        MaNguoiDung = nguoiDung?.MaNguoiDung ?? 0,
                        HoTen = nguoiDung?.HoTen ?? string.Empty,
                        GioiTinh = nguoiDung?.GioiTinh ?? string.Empty,
                        NgaySinh = nguoiDung?.NgaySinh ?? default,
                        SoDienThoai = nguoiDung?.SoDienThoai ?? string.Empty,
                        Email = nguoiDung?.Email ?? string.Empty,
                        CCCD = nguoiDung?.Cccd ?? string.Empty,
                        DiaChi = nguoiDung?.DiaChi
                    };

                    if (t.VaiTro == "Admin" && nguoiDung?.Admin != null)
                    {
                        dto.MaActor = nguoiDung.Admin.MaAdmin;
                        dto.MaActorCode = nguoiDung.Admin.MaNv;
                        dto.ChucVu = nguoiDung.Admin.ChucVu;
                        dto.PhongBan = nguoiDung.Admin.PhongBan;
                        dto.NgayVaoLam = nguoiDung.Admin.NgayVaoLam;
                    }
                    else if (t.VaiTro == "CanBo" && nguoiDung?.CanBoKtx != null)
                    {
                        dto.MaActor = nguoiDung.CanBoKtx.MaCanBo;
                        dto.MaActorCode = nguoiDung.CanBoKtx.MaNv;
                        dto.ChucVu = nguoiDung.CanBoKtx.ChucVu;
                        dto.PhongBan = nguoiDung.CanBoKtx.PhongBan;
                        dto.NgayVaoLam = nguoiDung.CanBoKtx.NgayVaoLam;
                    }
                    else if (t.VaiTro == "SinhVien" && nguoiDung?.SinhVien != null)
                    {
                        dto.MaActor = nguoiDung.SinhVien.MaSinhVien;
                        dto.MaActorCode = nguoiDung.SinhVien.MaSv;
                        dto.Khoa = nguoiDung.SinhVien.Khoa;
                        dto.Nganh = nguoiDung.SinhVien.Nganh;
                        dto.Lop = nguoiDung.SinhVien.Lop;
                        dto.NamHoc = nguoiDung.SinhVien.NamHoc;
                        dto.DiemTB = nguoiDung.SinhVien.DiemTb;
                    }

                    return dto;
                }).ToList();

                return ApiResponse<List<UserDTO>>.SuccessResponse(users, "Lấy danh sách tài khoản thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> SetUserStatus(int maTaiKhoan, bool trangThai)
        {
            try
            {
                var taiKhoan = await _unitOfWork.TaiKhoans.Query()
                    .FirstOrDefaultAsync(t => t.MaTaiKhoan == maTaiKhoan);

                if (taiKhoan == null)
                {
                    return ApiResponse<bool>.ErrorResponse("Tài khoản không tồn tại");
                }

                taiKhoan.TrangThai = trangThai;
                await _unitOfWork.SaveChangesAsync();

                var message = trangThai ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản";
                return ApiResponse<bool>.SuccessResponse(true, message);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Register(RegisterRequestDTO request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (request.VaiTro != "SinhVien")
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<string>.ErrorResponse("Chỉ sinh viên mới được đăng ký tài khoản");
                }

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
