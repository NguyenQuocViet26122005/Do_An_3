using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.HopDong;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class HopDongBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public HopDongBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<HopDongDTO>>> GetAll(int? maSinhVien = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.HopDongs.Query()
                    .Include(h => h.MaSinhVienNavigation).ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(h => h.MaPhongNavigation).ThenInclude(p => p!.MaToaNhaNavigation)
                    .Include(h => h.MaGiuongNavigation)
                    .Include(h => h.MaCanBoTaoNavigation).ThenInclude(c => c!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (maSinhVien.HasValue)
                {
                    query = query.Where(h => h.MaSinhVien == maSinhVien.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(h => h.TrangThai == trangThai);
                }

                var hopDongs = await query.OrderByDescending(h => h.NgayTao).ToListAsync();

                var result = hopDongs.Select(ToDto).ToList();

                return ApiResponse<List<HopDongDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HopDongDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        private static int TinhSoThang(DateOnly ngayBatDau, DateOnly ngayKetThuc)
        {
            return (ngayKetThuc.ToDateTime(TimeOnly.MinValue).Year - ngayBatDau.ToDateTime(TimeOnly.MinValue).Year) * 12 + ngayKetThuc.ToDateTime(TimeOnly.MinValue).Month - ngayBatDau.ToDateTime(TimeOnly.MinValue).Month;
        }

        private static HopDongDTO ToDto(HopDong hopDong)
        {
            return new HopDongDTO
            {
                MaHopDong = hopDong.MaHopDong,
                SoHopDong = hopDong.SoHopDong,
                MaSinhVien = hopDong.MaSinhVien,
                TenSinhVien = hopDong.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                MaSV = hopDong.MaSinhVienNavigation?.MaSv,
                MaPhong = hopDong.MaPhong,
                TenPhong = hopDong.MaPhongNavigation?.SoPhong,
                TenToaNha = hopDong.MaPhongNavigation?.MaToaNhaNavigation?.TenToaNha,
                MaGiuong = hopDong.MaGiuong,
                SoGiuong = hopDong.MaGiuongNavigation?.SoGiuong,
                HocKy = hopDong.HocKy,
                NgayBatDau = hopDong.NgayBatDau,
                NgayKetThuc = hopDong.NgayKetThuc,
                GiaThue = hopDong.GiaThue,
                TrangThai = hopDong.TrangThai,
                MaCanBoTao = hopDong.MaCanBoTao,
                TenCanBoTao = hopDong.MaCanBoTaoNavigation?.MaNguoiDungNavigation?.HoTen,
                NgayTao = hopDong.NgayTao,
                SoThang = TinhSoThang(hopDong.NgayBatDau, hopDong.NgayKetThuc)
            };
        }

        public async Task<ApiResponse<HopDongDTO>> Create(int maCanBo, CreateHopDongDTO dto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Kiểm tra số hợp đồng đã tồn tại
                if (await _unitOfWork.HopDongs.AnyAsync(h => h.SoHopDong == dto.SoHopDong))
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Số hợp đồng đã tồn tại");
                }

                // Kiểm tra sinh viên
                var sinhVien = await _unitOfWork.SinhViens.GetByIdAsync(dto.MaSinhVien);
                if (sinhVien == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                // Kiểm tra sinh viên đã có hợp đồng hiệu lực chưa
                if (await _unitOfWork.HopDongs.AnyAsync(h => h.MaSinhVien == dto.MaSinhVien && h.TrangThai == "HieuLuc"))
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Sinh viên đã có hợp đồng đang hiệu lực");
                }

                // Kiểm tra giường
                var giuong = await _unitOfWork.Giuongs.Query()
                    .Include(g => g.MaPhongNavigation)
                    .FirstOrDefaultAsync(g => g.MaGiuong == dto.MaGiuong);

                if (giuong == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Không tìm thấy giường");
                }

                if (giuong.MaPhong != dto.MaPhong)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Giường không thuộc phòng này");
                }

                if (giuong.TrangThai != "ConTrong" || giuong.MaSinhVien != null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<HopDongDTO>.ErrorResponse("Giường không khả dụng");
                }

                var hopDong = new HopDong
                {
                    SoHopDong = dto.SoHopDong,
                    MaSinhVien = dto.MaSinhVien,
                    MaPhong = dto.MaPhong,
                    MaGiuong = dto.MaGiuong,
                    HocKy = dto.HocKy,
                    NgayBatDau = DateOnly.FromDateTime(dto.NgayBatDau),
                    NgayKetThuc = DateOnly.FromDateTime(dto.NgayBatDau.AddMonths(dto.SoThang)),
                    GiaThue = dto.GiaThue,
                    TrangThai = "HieuLuc",
                    MaCanBoTao = maCanBo,
                    NgayTao = DateTime.Now
                };

                await _unitOfWork.HopDongs.AddAsync(hopDong);

                // Cập nhật giường và phòng
                giuong.TrangThai = "DangSuDung";
                giuong.MaSinhVien = dto.MaSinhVien;
                _unitOfWork.Giuongs.Update(giuong);

                if (giuong.MaPhongNavigation != null)
                {
                    giuong.MaPhongNavigation.SoNguoiHienTai = (giuong.MaPhongNavigation.SoNguoiHienTai ?? 0) + 1;
                    if (giuong.MaPhongNavigation.SoNguoiHienTai >= giuong.MaPhongNavigation.SucChua)
                    {
                        giuong.MaPhongNavigation.TrangThai = "DayPhong";
                    }
                    _unitOfWork.Phongs.Update(giuong.MaPhongNavigation);
                }

                await _unitOfWork.CommitAsync();

                return ApiResponse<HopDongDTO>.SuccessResponse(ToDto(hopDong), "Tạo hợp đồng thành công");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<HopDongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HopDongDTO>> GiaHan(int maHopDong, GiaHanHopDongDTO dto, int? maSinhVien = null)
        {
            try
            {
                var hopDong = await _unitOfWork.HopDongs.Query()
                    .Include(h => h.MaSinhVienNavigation).ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(h => h.MaPhongNavigation).ThenInclude(p => p!.MaToaNhaNavigation)
                    .Include(h => h.MaGiuongNavigation)
                    .Include(h => h.MaCanBoTaoNavigation).ThenInclude(c => c!.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(h => h.MaHopDong == maHopDong);

                if (hopDong == null)
                {
                    return ApiResponse<HopDongDTO>.ErrorResponse("Không tìm thấy hợp đồng");
                }

                if (maSinhVien.HasValue && hopDong.MaSinhVien != maSinhVien.Value)
                {
                    return ApiResponse<HopDongDTO>.ErrorResponse("Không có quyền gia hạn hợp đồng này");
                }

                hopDong.NgayKetThuc = DateOnly.FromDateTime(hopDong.NgayKetThuc.ToDateTime(TimeOnly.MinValue).AddMonths(dto.SoThangGiaHan));
                hopDong.TrangThai = "HieuLuc";
                _unitOfWork.HopDongs.Update(hopDong);
                await _unitOfWork.SaveChangesAsync();

                return ApiResponse<HopDongDTO>.SuccessResponse(ToDto(hopDong), "Gia hạn hợp đồng thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<HopDongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
