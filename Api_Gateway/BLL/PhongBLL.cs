using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.Phong;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class PhongBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public PhongBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<PhongDTO>>> GetAll(int? maToaNha = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.Phongs.Query()
                    .Include(p => p.MaToaNhaNavigation)
                    .Include(p => p.Giuongs)
                    .AsQueryable();

                if (maToaNha.HasValue)
                {
                    query = query.Where(p => p.MaToaNha == maToaNha.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(p => p.TrangThai == trangThai);
                }

                var phongs = await query.ToListAsync();

                var result = phongs.Select(p => new PhongDTO
                {
                    MaPhong = p.MaPhong,
                    SoPhong = p.SoPhong,
                    Tang = p.Tang,
                    LoaiPhong = p.LoaiPhong,
                    SucChua = p.SucChua,
                    GiaPhong = p.GiaPhong,
                    TrangThai = p.TrangThai,
                    SoNguoiHienTai = p.SoNguoiHienTai,
                    MaToaNha = p.MaToaNha,
                    TenToaNha = p.MaToaNhaNavigation?.TenToaNha,
                    SoGiuongTrong = p.Giuongs.Count(g => g.TrangThai == "ConTrong")
                }).ToList();

                return ApiResponse<List<PhongDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PhongDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PhongDTO>> GetById(int id)
        {
            try
            {
                var phong = await _unitOfWork.Phongs.Query()
                    .Include(p => p.MaToaNhaNavigation)
                    .Include(p => p.Giuongs)
                    .FirstOrDefaultAsync(p => p.MaPhong == id);

                if (phong == null)
                {
                    return ApiResponse<PhongDTO>.ErrorResponse("Không tìm thấy phòng");
                }

                var result = new PhongDTO
                {
                    MaPhong = phong.MaPhong,
                    SoPhong = phong.SoPhong,
                    Tang = phong.Tang,
                    LoaiPhong = phong.LoaiPhong,
                    SucChua = phong.SucChua,
                    GiaPhong = phong.GiaPhong,
                    TrangThai = phong.TrangThai,
                    SoNguoiHienTai = phong.SoNguoiHienTai,
                    MaToaNha = phong.MaToaNha,
                    TenToaNha = phong.MaToaNhaNavigation?.TenToaNha,
                    SoGiuongTrong = phong.Giuongs.Count(g => g.TrangThai == "ConTrong")
                };

                return ApiResponse<PhongDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<PhongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<GiuongDTO>>> GetGiuongByPhong(int maPhong)
        {
            try
            {
                var giuongs = await _unitOfWork.Giuongs.Query()
                    .Include(g => g.MaSinhVienNavigation)
                        .ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Where(g => g.MaPhong == maPhong)
                    .OrderBy(g => g.SoGiuong)
                    .ToListAsync();

                var result = giuongs.Select(g => new GiuongDTO
                {
                    MaGiuong = g.MaGiuong,
                    MaPhong = g.MaPhong,
                    SoGiuong = g.SoGiuong,
                    TrangThai = g.TrangThai,
                    MaSinhVien = g.MaSinhVien,
                    TenSinhVien = g.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = g.MaSinhVienNavigation?.MaSv
                }).ToList();

                return ApiResponse<List<GiuongDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<GiuongDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PhongDTO>> Create(CreatePhongDTO dto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Kiểm tra tòa nhà tồn tại
                var toaNha = await _unitOfWork.ToaNhas.GetByIdAsync(dto.MaToaNha);
                if (toaNha == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<PhongDTO>.ErrorResponse("Không tìm thấy tòa nhà");
                }

                // Kiểm tra số phòng đã tồn tại trong tòa nhà
                if (await _unitOfWork.Phongs.AnyAsync(p => p.SoPhong == dto.SoPhong && p.MaToaNha == dto.MaToaNha))
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<PhongDTO>.ErrorResponse("Số phòng đã tồn tại trong tòa nhà này");
                }

                var phong = new Phong
                {
                    SoPhong = dto.SoPhong,
                    Tang = dto.Tang ?? 0,
                    LoaiPhong = dto.LoaiPhong ?? "",
                    SucChua = dto.SucChua,
                    GiaPhong = dto.GiaPhong,
                    TrangThai = "ConTrong",
                    SoNguoiHienTai = 0,
                    MaToaNha = dto.MaToaNha,
                    NgayTao = DateTime.Now
                };

                await _unitOfWork.Phongs.AddAsync(phong);
                await _unitOfWork.SaveChangesAsync();

                // Tự động tạo giường theo sức chứa
                for (int i = 1; i <= dto.SucChua; i++)
                {
                    var giuong = new Giuong
                    {
                        MaPhong = phong.MaPhong,
                        SoGiuong = i,
                        TrangThai = "ConTrong",
                        NgayTao = DateTime.Now
                    };
                    await _unitOfWork.Giuongs.AddAsync(giuong);
                }

                await _unitOfWork.CommitAsync();

                var result = new PhongDTO
                {
                    MaPhong = phong.MaPhong,
                    SoPhong = phong.SoPhong,
                    Tang = phong.Tang,
                    LoaiPhong = phong.LoaiPhong,
                    SucChua = phong.SucChua,
                    GiaPhong = phong.GiaPhong,
                    TrangThai = phong.TrangThai,
                    SoNguoiHienTai = phong.SoNguoiHienTai,
                    MaToaNha = phong.MaToaNha,
                    TenToaNha = toaNha.TenToaNha,
                    SoGiuongTrong = dto.SucChua
                };

                return ApiResponse<PhongDTO>.SuccessResponse(result, "Tạo phòng thành công");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<PhongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PhongDTO>> Update(int id, UpdatePhongDTO dto)
        {
            try
            {
                var phong = await _unitOfWork.Phongs.GetByIdAsync(id);
                if (phong == null)
                {
                    return ApiResponse<PhongDTO>.ErrorResponse("Không tìm thấy phòng");
                }

                // Kiểm tra số phòng nếu thay đổi
                if (!string.IsNullOrEmpty(dto.SoPhong) && dto.SoPhong != phong.SoPhong)
                {
                    if (await _unitOfWork.Phongs.AnyAsync(p => p.SoPhong == dto.SoPhong && p.MaToaNha == phong.MaToaNha && p.MaPhong != id))
                    {
                        return ApiResponse<PhongDTO>.ErrorResponse("Số phòng đã tồn tại trong tòa nhà này");
                    }
                    phong.SoPhong = dto.SoPhong;
                }

                // Kiểm tra tòa nhà nếu thay đổi
                if (dto.MaToaNha.HasValue && dto.MaToaNha.Value != phong.MaToaNha)
                {
                    var toaNha = await _unitOfWork.ToaNhas.GetByIdAsync(dto.MaToaNha.Value);
                    if (toaNha == null)
                    {
                        return ApiResponse<PhongDTO>.ErrorResponse("Không tìm thấy tòa nhà");
                    }
                    phong.MaToaNha = dto.MaToaNha.Value;
                }

                if (dto.Tang.HasValue) phong.Tang = dto.Tang.Value;
                if (!string.IsNullOrEmpty(dto.LoaiPhong)) phong.LoaiPhong = dto.LoaiPhong;
                if (dto.SucChua.HasValue) phong.SucChua = dto.SucChua.Value;
                if (dto.GiaPhong.HasValue) phong.GiaPhong = dto.GiaPhong.Value;
                if (!string.IsNullOrEmpty(dto.TrangThai)) phong.TrangThai = dto.TrangThai;

                _unitOfWork.Phongs.Update(phong);
                await _unitOfWork.SaveChangesAsync();

                var result = new PhongDTO
                {
                    MaPhong = phong.MaPhong,
                    SoPhong = phong.SoPhong,
                    Tang = phong.Tang,
                    LoaiPhong = phong.LoaiPhong,
                    SucChua = phong.SucChua,
                    GiaPhong = phong.GiaPhong,
                    TrangThai = phong.TrangThai,
                    SoNguoiHienTai = phong.SoNguoiHienTai,
                    MaToaNha = phong.MaToaNha
                };

                return ApiResponse<PhongDTO>.SuccessResponse(result, "Cập nhật phòng thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<PhongDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Delete(int id)
        {
            try
            {
                var phong = await _unitOfWork.Phongs.Query()
                    .Include(p => p.Giuongs)
                    .Include(p => p.HopDongs)
                    .FirstOrDefaultAsync(p => p.MaPhong == id);

                if (phong == null)
                {
                    return ApiResponse<string>.ErrorResponse("Không tìm thấy phòng");
                }

                // Kiểm tra có sinh viên đang ở không
                if (phong.SoNguoiHienTai > 0)
                {
                    return ApiResponse<string>.ErrorResponse("Không thể xóa phòng đang có sinh viên");
                }

                // Kiểm tra có hợp đồng không
                if (phong.HopDongs.Any())
                {
                    return ApiResponse<string>.ErrorResponse("Không thể xóa phòng đã có hợp đồng");
                }

                // Xóa giường trước
                _unitOfWork.Giuongs.RemoveRange(phong.Giuongs);
                _unitOfWork.Phongs.Remove(phong);
                await _unitOfWork.SaveChangesAsync();

                return ApiResponse<string>.SuccessResponse("Xóa phòng thành công", "Xóa phòng thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
