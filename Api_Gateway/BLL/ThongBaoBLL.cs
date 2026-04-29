using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.ThongBao;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class ThongBaoBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public ThongBaoBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<ThongBaoDTO>>> GetAll(string? loaiNguoiNhan = null)
        {
            try
            {
                var query = _unitOfWork.ThongBaos.Query()
                    .Include(t => t.MaCanBoGuiNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(loaiNguoiNhan))
                {
                    query = query.Where(t => t.LoaiNguoiNhan == loaiNguoiNhan);
                }

                var thongBaos = await query.OrderByDescending(t => t.NgayGui).ToListAsync();

                var result = thongBaos.Select(t => new ThongBaoDTO
                {
                    MaThongBao = t.MaThongBao,
                    TieuDe = t.TieuDe,
                    NoiDung = t.NoiDung,
                    LoaiThongBao = t.LoaiThongBao,
                    MaCanBoGui = t.MaCanBoGui,
                    TenCanBoGui = t.MaCanBoGuiNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayGui = t.NgayGui ?? DateTime.MinValue,
                    DaDoc = t.DaDoc ?? false
                }).ToList();

                return ApiResponse<List<ThongBaoDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ThongBaoDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ThongBaoDTO>> GetById(int id)
        {
            try
            {
                var thongBao = await _unitOfWork.ThongBaos.Query()
                    .Include(t => t.MaCanBoGuiNavigation)
                        .ThenInclude(c => c!.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(t => t.MaThongBao == id);

                if (thongBao == null)
                {
                    return ApiResponse<ThongBaoDTO>.ErrorResponse("Không tìm thấy thông báo");
                }

                var result = new ThongBaoDTO
                {
                    MaThongBao = thongBao.MaThongBao,
                    TieuDe = thongBao.TieuDe,
                    NoiDung = thongBao.NoiDung,
                    LoaiThongBao = thongBao.LoaiThongBao,
                    MaCanBoGui = thongBao.MaCanBoGui,
                    TenCanBoGui = thongBao.MaCanBoGuiNavigation?.MaNguoiDungNavigation?.HoTen,
                    NgayGui = thongBao.NgayGui ?? DateTime.MinValue,
                    DaDoc = thongBao.DaDoc ?? false
                };

                return ApiResponse<ThongBaoDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<ThongBaoDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ThongBaoDTO>> Create(int maCanBo, CreateThongBaoDTO dto)
        {
            try
            {
                var loaiNguoiNhan = "TatCa";
                if (dto.MaSinhVienNhan.HasValue)
                {
                    loaiNguoiNhan = "SinhVien";
                }
                else if (dto.MaCanBoNhan.HasValue)
                {
                    loaiNguoiNhan = "CanBo";
                }

                var thongBao = new ThongBao
                {
                    TieuDe = dto.TieuDe,
                    NoiDung = dto.NoiDung,
                    LoaiThongBao = dto.LoaiThongBao ?? "ThongThuong",
                    LoaiNguoiNhan = loaiNguoiNhan,
                    MaSinhVienNhan = dto.MaSinhVienNhan,
                    MaCanBoNhan = dto.MaCanBoNhan,
                    DaDoc = false,
                    MaCanBoGui = maCanBo,
                    NgayGui = DateTime.Now
                };

                await _unitOfWork.ThongBaos.AddAsync(thongBao);
                await _unitOfWork.SaveChangesAsync();

                var result = new ThongBaoDTO
                {
                    MaThongBao = thongBao.MaThongBao,
                    TieuDe = thongBao.TieuDe,
                    NoiDung = thongBao.NoiDung,
                    NgayGui = thongBao.NgayGui ?? DateTime.MinValue
                };

                return ApiResponse<ThongBaoDTO>.SuccessResponse(result, "Gửi thông báo thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<ThongBaoDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ThongBaoDTO>> DanhDauDaDoc(int maThongBao)
        {
            try
            {
                var thongBao = await _unitOfWork.ThongBaos.GetByIdAsync(maThongBao);
                if (thongBao == null)
                {
                    return ApiResponse<ThongBaoDTO>.ErrorResponse("Không tìm thấy thông báo");
                }

                if (thongBao.DaDoc != true)
                {
                    thongBao.DaDoc = true;
                    thongBao.NgayDoc = DateTime.Now;
                    _unitOfWork.ThongBaos.Update(thongBao);
                    await _unitOfWork.SaveChangesAsync();
                }

                var result = new ThongBaoDTO
                {
                    MaThongBao = thongBao.MaThongBao,
                    DaDoc = thongBao.DaDoc ?? false
                };

                return ApiResponse<ThongBaoDTO>.SuccessResponse(result, "Đã đánh dấu đọc");
            }
            catch (Exception ex)
            {
                return ApiResponse<ThongBaoDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Delete(int id)
        {
            try
            {
                var thongBao = await _unitOfWork.ThongBaos.GetByIdAsync(id);
                if (thongBao == null)
                {
                    return ApiResponse<string>.ErrorResponse("Không tìm thấy thông báo");
                }

                _unitOfWork.ThongBaos.Remove(thongBao);
                await _unitOfWork.SaveChangesAsync();

                return ApiResponse<string>.SuccessResponse("Đã xóa thông báo", "Xóa thông báo thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
