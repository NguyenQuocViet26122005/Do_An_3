using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.ToaNha;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class ToaNhaBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public ToaNhaBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<ToaNhaDTO>>> GetAll()
        {
            try
            {
                var toaNhas = await _unitOfWork.ToaNhas.Query()
                    .Include(t => t.MaCanBoQuanLyNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .Include(t => t.Phongs)
                    .ToListAsync();

                var result = toaNhas.Select(t => new ToaNhaDTO
                {
                    MaToaNha = t.MaToaNha,
                    MaToa = t.MaToa,
                    TenToaNha = t.TenToaNha,
                    LoaiToaNha = t.LoaiToaNha,
                    SoTang = t.SoTang,
                    TrangThai = t.TrangThai,
                    MaCanBoQuanLy = t.MaCanBoQuanLy,
                    TenCanBoQuanLy = t.MaCanBoQuanLyNavigation?.MaNguoiDungNavigation?.HoTen,
                    TongSoPhong = t.Phongs.Count,
                    SoPhongTrong = t.Phongs.Count(p => p.TrangThai == "ConTrong")
                }).ToList();

                return ApiResponse<List<ToaNhaDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ToaNhaDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ToaNhaDTO>> GetById(int id)
        {
            try
            {
                var toaNha = await _unitOfWork.ToaNhas.Query()
                    .Include(t => t.MaCanBoQuanLyNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .Include(t => t.Phongs)
                    .FirstOrDefaultAsync(t => t.MaToaNha == id);

                if (toaNha == null)
                {
                    return ApiResponse<ToaNhaDTO>.ErrorResponse("Không tìm thấy tòa nhà");
                }

                var result = new ToaNhaDTO
                {
                    MaToaNha = toaNha.MaToaNha,
                    MaToa = toaNha.MaToa,
                    TenToaNha = toaNha.TenToaNha,
                    LoaiToaNha = toaNha.LoaiToaNha,
                    SoTang = toaNha.SoTang,
                    TrangThai = toaNha.TrangThai,
                    MaCanBoQuanLy = toaNha.MaCanBoQuanLy,
                    TenCanBoQuanLy = toaNha.MaCanBoQuanLyNavigation?.MaNguoiDungNavigation?.HoTen,
                    TongSoPhong = toaNha.Phongs.Count,
                    SoPhongTrong = toaNha.Phongs.Count(p => p.TrangThai == "ConTrong")
                };

                return ApiResponse<ToaNhaDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<ToaNhaDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ToaNhaDTO>> Create(CreateToaNhaDTO dto)
        {
            try
            {
                // Kiểm tra mã tòa đã tồn tại
                if (await _unitOfWork.ToaNhas.AnyAsync(t => t.MaToa == dto.MaToa))
                {
                    return ApiResponse<ToaNhaDTO>.ErrorResponse("Mã tòa đã tồn tại");
                }

                // Kiểm tra cán bộ quản lý nếu có
                if (dto.MaCanBoQuanLy.HasValue)
                {
                    var canBo = await _unitOfWork.CanBoKtxes.GetByIdAsync(dto.MaCanBoQuanLy.Value);
                    if (canBo == null)
                    {
                        return ApiResponse<ToaNhaDTO>.ErrorResponse("Không tìm thấy cán bộ quản lý");
                    }
                }

                var toaNha = new ToaNha
                {
                    MaToa = dto.MaToa,
                    TenToaNha = dto.TenToaNha,
                    LoaiToaNha = dto.LoaiToaNha ?? "",
                    SoTang = dto.SoTang ?? 0,
                    TrangThai = "HoatDong",
                    MaCanBoQuanLy = dto.MaCanBoQuanLy,
                    NgayTao = DateTime.Now
                };

                await _unitOfWork.ToaNhas.AddAsync(toaNha);
                await _unitOfWork.SaveChangesAsync();

                var result = new ToaNhaDTO
                {
                    MaToaNha = toaNha.MaToaNha,
                    MaToa = toaNha.MaToa,
                    TenToaNha = toaNha.TenToaNha,
                    LoaiToaNha = toaNha.LoaiToaNha,
                    SoTang = toaNha.SoTang,
                    TrangThai = toaNha.TrangThai,
                    MaCanBoQuanLy = toaNha.MaCanBoQuanLy,
                    TongSoPhong = 0,
                    SoPhongTrong = 0
                };

                return ApiResponse<ToaNhaDTO>.SuccessResponse(result, "Tạo tòa nhà thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<ToaNhaDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ToaNhaDTO>> Update(int id, UpdateToaNhaDTO dto)
        {
            try
            {
                var toaNha = await _unitOfWork.ToaNhas.GetByIdAsync(id);
                if (toaNha == null)
                {
                    return ApiResponse<ToaNhaDTO>.ErrorResponse("Không tìm thấy tòa nhà");
                }

                // Kiểm tra mã tòa nếu thay đổi
                if (!string.IsNullOrEmpty(dto.MaToa) && dto.MaToa != toaNha.MaToa)
                {
                    if (await _unitOfWork.ToaNhas.AnyAsync(t => t.MaToa == dto.MaToa))
                    {
                        return ApiResponse<ToaNhaDTO>.ErrorResponse("Mã tòa đã tồn tại");
                    }
                    toaNha.MaToa = dto.MaToa;
                }

                // Kiểm tra cán bộ quản lý nếu có
                if (dto.MaCanBoQuanLy.HasValue)
                {
                    var canBo = await _unitOfWork.CanBoKtxes.GetByIdAsync(dto.MaCanBoQuanLy.Value);
                    if (canBo == null)
                    {
                        return ApiResponse<ToaNhaDTO>.ErrorResponse("Không tìm thấy cán bộ quản lý");
                    }
                    toaNha.MaCanBoQuanLy = dto.MaCanBoQuanLy;
                }

                if (!string.IsNullOrEmpty(dto.TenToaNha)) toaNha.TenToaNha = dto.TenToaNha;
                if (!string.IsNullOrEmpty(dto.LoaiToaNha)) toaNha.LoaiToaNha = dto.LoaiToaNha;
                if (dto.SoTang.HasValue) toaNha.SoTang = dto.SoTang.Value;
                if (!string.IsNullOrEmpty(dto.TrangThai)) toaNha.TrangThai = dto.TrangThai;

                _unitOfWork.ToaNhas.Update(toaNha);
                await _unitOfWork.SaveChangesAsync();

                var result = new ToaNhaDTO
                {
                    MaToaNha = toaNha.MaToaNha,
                    MaToa = toaNha.MaToa,
                    TenToaNha = toaNha.TenToaNha,
                    LoaiToaNha = toaNha.LoaiToaNha,
                    SoTang = toaNha.SoTang,
                    TrangThai = toaNha.TrangThai,
                    MaCanBoQuanLy = toaNha.MaCanBoQuanLy
                };

                return ApiResponse<ToaNhaDTO>.SuccessResponse(result, "Cập nhật tòa nhà thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<ToaNhaDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Delete(int id)
        {
            try
            {
                var toaNha = await _unitOfWork.ToaNhas.Query()
                    .Include(t => t.Phongs)
                    .FirstOrDefaultAsync(t => t.MaToaNha == id);

                if (toaNha == null)
                {
                    return ApiResponse<string>.ErrorResponse("Không tìm thấy tòa nhà");
                }

                // Kiểm tra có phòng không
                if (toaNha.Phongs.Any())
                {
                    return ApiResponse<string>.ErrorResponse("Không thể xóa tòa nhà đã có phòng");
                }

                _unitOfWork.ToaNhas.Remove(toaNha);
                await _unitOfWork.SaveChangesAsync();

                return ApiResponse<string>.SuccessResponse("Xóa tòa nhà thành công", "Xóa tòa nhà thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
