using Api_Gateway.DAL;
using Api_Gateway.DTO.BaoTri;
using Api_Gateway.DTO.Common;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class YeuCauBaoTriBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public YeuCauBaoTriBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<YeuCauBaoTriDTO>>> GetAll(int? maSinhVien = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.YeuCauBaoTris.Query()
                    .Include(y => y.MaSinhVienNavigation)
                        .ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(y => y.MaPhongNavigation)
                    .Include(y => y.MaCanBoXuLyNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (maSinhVien.HasValue)
                {
                    query = query.Where(y => y.MaSinhVien == maSinhVien.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(y => y.TrangThai == trangThai);
                }

                var yeuCaus = await query.OrderByDescending(y => y.NgayTao).ToListAsync();

                var result = yeuCaus.Select(y => new YeuCauBaoTriDTO
                {
                    MaYeuCau = y.MaYeuCau,
                    MaSinhVien = y.MaSinhVien,
                    TenSinhVien = y.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = y.MaSinhVienNavigation?.MaSv,
                    MaPhong = y.MaPhong,
                    TenPhong = y.MaPhongNavigation?.SoPhong,
                    TieuDe = y.TieuDe,
                    MoTa = y.MoTa,
                    LoaiYeuCau = y.LoaiYeuCau,
                    TrangThai = y.TrangThai,
                    MaCanBoXuLy = y.MaCanBoXuLy,
                    TenCanBoXuLy = y.MaCanBoXuLyNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayXuLy = y.NgayXuLy,
                    ChiPhi = y.ChiPhi,
                    NgayTao = y.NgayTao ?? DateTime.MinValue
                }).ToList();

                return ApiResponse<List<YeuCauBaoTriDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<YeuCauBaoTriDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<YeuCauBaoTriDTO>> GetById(int id)
        {
            try
            {
                var yeuCau = await _unitOfWork.YeuCauBaoTris.Query()
                    .Include(y => y.MaSinhVienNavigation)
                        .ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(y => y.MaPhongNavigation)
                    .Include(y => y.MaCanBoXuLyNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(y => y.MaYeuCau == id);

                if (yeuCau == null)
                {
                    return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse("Không tìm thấy yêu cầu bảo trì");
                }

                var result = new YeuCauBaoTriDTO
                {
                    MaYeuCau = yeuCau.MaYeuCau,
                    MaSinhVien = yeuCau.MaSinhVien,
                    TenSinhVien = yeuCau.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = yeuCau.MaSinhVienNavigation?.MaSv,
                    MaPhong = yeuCau.MaPhong,
                    TenPhong = yeuCau.MaPhongNavigation?.SoPhong,
                    TieuDe = yeuCau.TieuDe,
                    MoTa = yeuCau.MoTa,
                    LoaiYeuCau = yeuCau.LoaiYeuCau,
                    TrangThai = yeuCau.TrangThai,
                    MaCanBoXuLy = yeuCau.MaCanBoXuLy,
                    TenCanBoXuLy = yeuCau.MaCanBoXuLyNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayXuLy = yeuCau.NgayXuLy,
                    ChiPhi = yeuCau.ChiPhi,
                    NgayTao = yeuCau.NgayTao ?? DateTime.MinValue
                };

                return ApiResponse<YeuCauBaoTriDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<YeuCauBaoTriDTO>> Create(int maSinhVien, CreateYeuCauBaoTriDTO dto)
        {
            try
            {
                var sinhVien = await _unitOfWork.SinhViens.GetByIdAsync(maSinhVien);
                if (sinhVien == null)
                {
                    return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                var phong = await _unitOfWork.Phongs.GetByIdAsync(dto.MaPhong);
                if (phong == null)
                {
                    return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse("Không tìm thấy phòng");
                }

                var yeuCau = new YeuCauBaoTri
                {
                    MaSinhVien = maSinhVien,
                    MaPhong = dto.MaPhong,
                    TieuDe = dto.TieuDe,
                    MoTa = dto.MoTa ?? "",
                    LoaiYeuCau = dto.LoaiYeuCau ?? "BaoTri",
                    TrangThai = "ChoXuLy",
                    NgayTao = DateTime.Now
                };

                await _unitOfWork.YeuCauBaoTris.AddAsync(yeuCau);
                await _unitOfWork.SaveChangesAsync();

                var result = new YeuCauBaoTriDTO
                {
                    MaYeuCau = yeuCau.MaYeuCau,
                    TieuDe = yeuCau.TieuDe,
                    TrangThai = yeuCau.TrangThai
                };

                return ApiResponse<YeuCauBaoTriDTO>.SuccessResponse(result, "Tạo yêu cầu bảo trì thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<YeuCauBaoTriDTO>> XuLy(int maYeuCau, int maCanBo, XuLyBaoTriDTO dto)
        {
            try
            {
                var yeuCau = await _unitOfWork.YeuCauBaoTris.GetByIdAsync(maYeuCau);
                if (yeuCau == null)
                {
                    return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse("Không tìm thấy yêu cầu bảo trì");
                }

                yeuCau.TrangThai = dto.TrangThai;
                yeuCau.MaCanBoXuLy = maCanBo;
                yeuCau.NgayXuLy = DateTime.Now;
                yeuCau.ChiPhi = dto.ChiPhi;

                _unitOfWork.YeuCauBaoTris.Update(yeuCau);
                await _unitOfWork.SaveChangesAsync();

                var result = new YeuCauBaoTriDTO
                {
                    MaYeuCau = yeuCau.MaYeuCau,
                    TrangThai = yeuCau.TrangThai,
                    NgayXuLy = yeuCau.NgayXuLy
                };

                return ApiResponse<YeuCauBaoTriDTO>.SuccessResponse(result, "Xử lý yêu cầu bảo trì thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<YeuCauBaoTriDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
