using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.ViPham;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class ViPhamBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public ViPhamBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<ViPhamDTO>>> GetAll(int? maSinhVien = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.ViPhams.Query()
                    .Include(v => v.MaSinhVienNavigation)
                        .ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(v => v.MaCanBoGhiNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (maSinhVien.HasValue)
                {
                    query = query.Where(v => v.MaSinhVien == maSinhVien.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(v => v.TrangThai == trangThai);
                }

                var viPhams = await query.OrderByDescending(v => v.NgayViPham).ToListAsync();

                var result = viPhams.Select(v => new ViPhamDTO
                {
                    MaViPham = v.MaViPham,
                    MaSinhVien = v.MaSinhVien,
                    TenSinhVien = v.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = v.MaSinhVienNavigation?.MaSv,
                    TenViPham = v.TenViPham,
                    MucDo = v.MucDo,
                    MoTa = v.MoTa,
                    MucPhat = v.MucPhat ?? 0,
                    NgayViPham = v.NgayViPham.HasValue ? DateOnly.FromDateTime(v.NgayViPham.Value) : DateOnly.MinValue,
                    TrangThai = v.TrangThai,
                    MaCanBoGhi = v.MaCanBoGhi,
                    TenCanBoGhi = v.MaCanBoGhiNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayGhi = v.NgayGhi ?? DateTime.MinValue
                }).ToList();

                return ApiResponse<List<ViPhamDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ViPhamDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ViPhamDTO>> GetById(int id)
        {
            try
            {
                var viPham = await _unitOfWork.ViPhams.Query()
                    .Include(v => v.MaSinhVienNavigation)
                        .ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(v => v.MaCanBoGhiNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(v => v.MaViPham == id);

                if (viPham == null)
                {
                    return ApiResponse<ViPhamDTO>.ErrorResponse("Không tìm thấy vi phạm");
                }

                var result = new ViPhamDTO
                {
                    MaViPham = viPham.MaViPham,
                    MaSinhVien = viPham.MaSinhVien,
                    TenSinhVien = viPham.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = viPham.MaSinhVienNavigation?.MaSv,
                    TenViPham = viPham.TenViPham,
                    MucDo = viPham.MucDo,
                    MoTa = viPham.MoTa,
                    MucPhat = viPham.MucPhat ?? 0,
                    NgayViPham = viPham.NgayViPham.HasValue ? DateOnly.FromDateTime(viPham.NgayViPham.Value) : DateOnly.MinValue,
                    TrangThai = viPham.TrangThai,
                    MaCanBoGhi = viPham.MaCanBoGhi,
                    TenCanBoGhi = viPham.MaCanBoGhiNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayGhi = viPham.NgayGhi ?? DateTime.MinValue
                };

                return ApiResponse<ViPhamDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<ViPhamDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ViPhamDTO>> Create(int maCanBo, CreateViPhamDTO dto)
        {
            try
            {
                var sinhVien = await _unitOfWork.SinhViens.GetByIdAsync(dto.MaSinhVien);
                if (sinhVien == null)
                {
                    return ApiResponse<ViPhamDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                var viPham = new ViPham
                {
                    MaSinhVien = dto.MaSinhVien,
                    TenViPham = dto.TenViPham,
                    MucDo = dto.MucDo ?? "Trung bình",
                    MoTa = dto.MoTa,
                    MucPhat = dto.MucPhat,
                    NgayViPham = dto.NgayViPham,
                    TrangThai = "ChuaXuLy",
                    MaCanBoGhi = maCanBo,
                    NgayGhi = DateTime.Now
                };

                await _unitOfWork.ViPhams.AddAsync(viPham);
                await _unitOfWork.SaveChangesAsync();

                var result = new ViPhamDTO
                {
                    MaViPham = viPham.MaViPham,
                    MaSinhVien = viPham.MaSinhVien,
                    TenViPham = viPham.TenViPham,
                    MucPhat = viPham.MucPhat ?? 0,
                    TrangThai = viPham.TrangThai
                };

                return ApiResponse<ViPhamDTO>.SuccessResponse(result, "Ghi nhận vi phạm thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<ViPhamDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ViPhamDTO>> XuLy(int maViPham, string trangThai, string? ghiChu = null)
        {
            try
            {
                var viPham = await _unitOfWork.ViPhams.GetByIdAsync(maViPham);
                if (viPham == null)
                {
                    return ApiResponse<ViPhamDTO>.ErrorResponse("Không tìm thấy vi phạm");
                }

                viPham.TrangThai = trangThai;
                if (!string.IsNullOrEmpty(ghiChu))
                {
                    viPham.MoTa = viPham.MoTa + "\n[Ghi chú xử lý]: " + ghiChu;
                }
                _unitOfWork.ViPhams.Update(viPham);
                await _unitOfWork.SaveChangesAsync();

                var result = new ViPhamDTO
                {
                    MaViPham = viPham.MaViPham,
                    TrangThai = viPham.TrangThai
                };

                return ApiResponse<ViPhamDTO>.SuccessResponse(result, "Xử lý vi phạm thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<ViPhamDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
