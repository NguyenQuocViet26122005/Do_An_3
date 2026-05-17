using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.DangKy;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class DangKyPhongBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public DangKyPhongBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<DangKyPhongDTO>>> GetAll(int? maSinhVien = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.DangKyPhongs.Query()
                    .Include(d => d.MaSinhVienNavigation).ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(d => d.MaPhongNavigation).ThenInclude(p => p!.MaToaNhaNavigation)
                    .Include(d => d.MaGiuongNavigation)
                    .Include(d => d.MaCanBoDuyetNavigation).ThenInclude(c => c!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (maSinhVien.HasValue)
                {
                    query = query.Where(d => d.MaSinhVien == maSinhVien.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(d => d.TrangThai == trangThai);
                }

                var dangKys = await query.OrderByDescending(d => d.NgayDangKy).ToListAsync();

                var result = dangKys.Select(d => new DangKyPhongDTO
                {
                    MaDangKy = d.MaDangKy,
                    MaSinhVien = d.MaSinhVien,
                    TenSinhVien = d.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = d.MaSinhVienNavigation?.MaSv,
                    MaPhong = d.MaPhong,
                    TenPhong = d.MaPhongNavigation?.SoPhong,
                    TenToaNha = d.MaPhongNavigation?.MaToaNhaNavigation?.TenToaNha,
                    MaGiuong = d.MaGiuong,
                    SoGiuong = d.MaGiuongNavigation?.SoGiuong,
                    HocKy = d.HocKy,
                    SoThang = d.SoThang,
                    NgayDangKy = d.NgayDangKy,
                    TrangThai = d.TrangThai,
                    MaCanBoDuyet = d.MaCanBoDuyet,
                    TenCanBoDuyet = d.MaCanBoDuyetNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayDuyet = d.NgayDuyet,
                    LyDoTuChoi = d.LyDoTuChoi
                }).ToList();

                return ApiResponse<List<DangKyPhongDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<DangKyPhongDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<DangKyPhongDTO>> Create(int maSinhVien, CreateDangKyDTO dto)
        {
            try
            {
                // Kiểm tra sinh viên tồn tại
                var sinhVien = await _unitOfWork.SinhViens.GetByIdAsync(maSinhVien);
                if (sinhVien == null)
                {
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                // Kiểm tra sinh viên đã có đăng ký chờ duyệt chưa
                if (await _unitOfWork.DangKyPhongs.AnyAsync(d => d.MaSinhVien == maSinhVien && d.TrangThai == "ChoDuyet"))
                {
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Bạn đã có đăng ký đang chờ duyệt");
                }

                // Kiểm tra sinh viên đã có hợp đồng hiệu lực chưa
                if (await _unitOfWork.HopDongs.AnyAsync(h => h.MaSinhVien == maSinhVien && h.TrangThai == "HieuLuc"))
                {
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Bạn đã có hợp đồng đang hiệu lực");
                }

                // Kiểm tra phòng tồn tại
                var phong = await _unitOfWork.Phongs.Query()
                    .Include(p => p.Giuongs)
                    .FirstOrDefaultAsync(p => p.MaPhong == dto.MaPhong);

                if (phong == null)
                {
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Không tìm thấy phòng");
                }

                // Kiểm tra phòng còn chỗ trống
                var giuongTrong = phong.Giuongs.Where(g => g.TrangThai == "ConTrong").ToList();
                if (!giuongTrong.Any())
                {
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Phòng đã hết chỗ");
                }

                // Chọn giường
                int maGiuong;
                if (dto.MaGiuong.HasValue)
                {
                    var giuong = giuongTrong.FirstOrDefault(g => g.MaGiuong == dto.MaGiuong.Value);
                    if (giuong == null)
                    {
                        return ApiResponse<DangKyPhongDTO>.ErrorResponse("Giường không khả dụng");
                    }
                    maGiuong = dto.MaGiuong.Value;
                }
                else
                {
                    maGiuong = giuongTrong.First().MaGiuong;
                }

                var dangKy = new DangKyPhong
                {
                    MaSinhVien = maSinhVien,
                    MaPhong = dto.MaPhong,
                    MaGiuong = maGiuong,
                    HocKy = dto.HocKy,
                    SoThang = dto.SoThang,
                    NgayDangKy = DateTime.Now,
                    TrangThai = "ChoDuyet"
                };

                await _unitOfWork.DangKyPhongs.AddAsync(dangKy);
                await _unitOfWork.SaveChangesAsync();

                var result = new DangKyPhongDTO
                {
                    MaDangKy = dangKy.MaDangKy,
                    MaSinhVien = dangKy.MaSinhVien,
                    MaPhong = dangKy.MaPhong,
                    MaGiuong = dangKy.MaGiuong,
                    HocKy = dangKy.HocKy,
                    SoThang = dangKy.SoThang,
                    NgayDangKy = dangKy.NgayDangKy,
                    TrangThai = dangKy.TrangThai
                };

                return ApiResponse<DangKyPhongDTO>.SuccessResponse(result, "Đăng ký phòng thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<DangKyPhongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<DangKyPhongDTO>> Duyet(int maDangKy, int maCanBo, DuyetDangKyDTO dto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var dangKy = await _unitOfWork.DangKyPhongs.Query()
                    .Include(d => d.MaGiuongNavigation).ThenInclude(g => g!.MaPhongNavigation)
                    .FirstOrDefaultAsync(d => d.MaDangKy == maDangKy);

                if (dangKy == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Không tìm thấy đăng ký");
                }

                if (dangKy.TrangThai != "ChoDuyet")
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<DangKyPhongDTO>.ErrorResponse("Đăng ký đã được xử lý");
                }

                dangKy.TrangThai = dto.TrangThai;
                dangKy.MaCanBoDuyet = maCanBo;
                dangKy.NgayDuyet = DateTime.Now;
                dangKy.LyDoTuChoi = dto.LyDoTuChoi;

                // Nếu duyệt thì cập nhật trạng thái giường/phòng và tạo hợp đồng
                if (dto.TrangThai == "DaDuyet")
                {
                    if (dangKy.MaGiuongNavigation == null || dangKy.MaGiuongNavigation.MaPhongNavigation == null)
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<DangKyPhongDTO>.ErrorResponse("Không tìm thấy giường hoặc phòng");
                    }

                    if (await _unitOfWork.HopDongs.AnyAsync(h => h.MaSinhVien == dangKy.MaSinhVien && h.TrangThai == "HieuLuc"))
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<DangKyPhongDTO>.ErrorResponse("Sinh viên đã có hợp đồng đang hiệu lực");
                    }

                    var giuong = dangKy.MaGiuongNavigation;
                    if (giuong.TrangThai != "ConTrong" || giuong.MaSinhVien != null)
                    {
                        await _unitOfWork.RollbackAsync();
                        return ApiResponse<DangKyPhongDTO>.ErrorResponse("Giường không còn trống");
                    }

                    var phong = giuong.MaPhongNavigation;
                    giuong.TrangThai = "DangSuDung";
                    giuong.MaSinhVien = dangKy.MaSinhVien;
                    _unitOfWork.Giuongs.Update(giuong);

                    phong.SoNguoiHienTai = (phong.SoNguoiHienTai ?? 0) + 1;
                    if (phong.SoNguoiHienTai >= phong.SucChua)
                    {
                        phong.TrangThai = "DayPhong";
                    }
                    _unitOfWork.Phongs.Update(phong);

                    var ngayBatDau = DateTime.Today;
                    var hopDong = new HopDong
                    {
                        SoHopDong = $"HD-DK-{dangKy.MaDangKy:D6}",
                        MaSinhVien = dangKy.MaSinhVien,
                        MaPhong = dangKy.MaPhong,
                        MaGiuong = dangKy.MaGiuong!.Value,
                        HocKy = dangKy.HocKy,
                        NgayBatDau = DateOnly.FromDateTime(ngayBatDau),
                        NgayKetThuc = DateOnly.FromDateTime(ngayBatDau.AddMonths(dangKy.SoThang)),
                        GiaThue = phong.GiaPhong,
                        TrangThai = "HieuLuc",
                        MaCanBoTao = maCanBo,
                        NgayTao = DateTime.Now
                    };
                    await _unitOfWork.HopDongs.AddAsync(hopDong);
                }

                _unitOfWork.DangKyPhongs.Update(dangKy);
                await _unitOfWork.CommitAsync();

                var result = new DangKyPhongDTO
                {
                    MaDangKy = dangKy.MaDangKy,
                    TrangThai = dangKy.TrangThai,
                    NgayDuyet = dangKy.NgayDuyet,
                    LyDoTuChoi = dangKy.LyDoTuChoi
                };

                return ApiResponse<DangKyPhongDTO>.SuccessResponse(result, "Xử lý đăng ký thành công");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<DangKyPhongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Delete(int maDangKy, int maSinhVien)
        {
            try
            {
                var dangKy = await _unitOfWork.DangKyPhongs.FirstOrDefaultAsync(d => d.MaDangKy == maDangKy && d.MaSinhVien == maSinhVien);

                if (dangKy == null)
                {
                    return ApiResponse<string>.ErrorResponse("Không tìm thấy đăng ký");
                }

                if (dangKy.TrangThai != "ChoDuyet")
                {
                    return ApiResponse<string>.ErrorResponse("Chỉ có thể hủy đăng ký đang chờ duyệt");
                }

                _unitOfWork.DangKyPhongs.Remove(dangKy);
                await _unitOfWork.SaveChangesAsync();

                return ApiResponse<string>.SuccessResponse("Hủy đăng ký thành công", "Hủy đăng ký thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
