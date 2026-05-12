using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.HoaDon;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class HoaDonBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public HoaDonBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<HoaDonDTO>>> GetAll(int? maSinhVien = null, string? trangThai = null)
        {
            try
            {
                var query = _unitOfWork.HoaDons.Query()
                    .Include(h => h.MaHopDongNavigation)
                        .ThenInclude(hd => hd!.MaSinhVienNavigation)
                            .ThenInclude(sv => sv!.MaNguoiDungNavigation)
                    .Include(h => h.MaHopDongNavigation)
                        .ThenInclude(hd => hd!.MaPhongNavigation)
                    .Include(h => h.MaCanBoTaoNavigation)
                        .ThenInclude(cb => cb!.MaNguoiDungNavigation)
                    .AsQueryable();

                if (maSinhVien.HasValue)
                {
                    query = query.Where(h => h.MaSinhVien == maSinhVien.Value);
                }

                if (!string.IsNullOrEmpty(trangThai))
                {
                    query = query.Where(h => h.TrangThai == trangThai);
                }

                var hoaDons = await query.OrderByDescending(h => h.NgayTao).ToListAsync();

                var result = hoaDons.Select(h => new HoaDonDTO
                {
                    MaHoaDon = h.MaHoaDon,
                    SoHoaDon = h.SoHoaDon,
                    MaHopDong = h.MaHopDong,
                    SoHopDong = h.MaHopDongNavigation?.SoHopDong,
                    MaSinhVien = h.MaSinhVien,
                    TenSinhVien = h.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = h.MaSinhVienNavigation?.MaSv,
                    TenPhong = h.MaHopDongNavigation?.MaPhongNavigation?.SoPhong,
                    Thang = h.Thang,
                    Nam = h.Nam,
                    TienPhong = h.TienPhong ?? 0,
                    TienDien = h.TienDien ?? 0,
                    TienNuoc = h.TienNuoc ?? 0,
                    PhiDichVu = h.PhiDichVu ?? 0,
                    PhiPhat = h.PhiPhat ?? 0,
                    TongTien = h.TongTien,
                    TrangThai = h.TrangThai,
                    NgayPhatHanh = h.NgayPhatHanh?.ToDateTime(TimeOnly.MinValue) ?? DateTime.MinValue,
                    NgayThanhToan = h.NgayThanhToan,
                    MaCanBoTao = h.MaCanBoTao,
                    TenCanBoTao = h.MaCanBoTaoNavigation?.MaNguoiDungNavigation?.HoTen
                }).ToList();

                return ApiResponse<List<HoaDonDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HoaDonDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HoaDonDTO>> GetById(int id)
        {
            try
            {
                var hoaDon = await _unitOfWork.HoaDons.Query()
                    .Include(h => h.MaHopDongNavigation)
                        .ThenInclude(hd => hd!.MaSinhVienNavigation)
                            .ThenInclude(sv => sv!.MaNguoiDungNavigation)
                    .Include(h => h.MaHopDongNavigation)
                        .ThenInclude(hd => hd!.MaPhongNavigation)
                    .Include(h => h.MaCanBoTaoNavigation)
                        .ThenInclude(cb => cb!.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(h => h.MaHoaDon == id);

                if (hoaDon == null)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Không tìm thấy hóa đơn");
                }

                var result = new HoaDonDTO
                {
                    MaHoaDon = hoaDon.MaHoaDon,
                    SoHoaDon = hoaDon.SoHoaDon,
                    MaHopDong = hoaDon.MaHopDong,
                    SoHopDong = hoaDon.MaHopDongNavigation?.SoHopDong,
                    MaSinhVien = hoaDon.MaSinhVien,
                    TenSinhVien = hoaDon.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                    MaSV = hoaDon.MaSinhVienNavigation?.MaSv,
                    TenPhong = hoaDon.MaHopDongNavigation?.MaPhongNavigation?.SoPhong,
                    Thang = hoaDon.Thang,
                    Nam = hoaDon.Nam,
                    TienPhong = hoaDon.TienPhong ?? 0,
                    TienDien = hoaDon.TienDien ?? 0,
                    TienNuoc = hoaDon.TienNuoc ?? 0,
                    PhiDichVu = hoaDon.PhiDichVu ?? 0,
                    PhiPhat = hoaDon.PhiPhat ?? 0,
                    TongTien = hoaDon.TongTien,
                    TrangThai = hoaDon.TrangThai,
                    NgayPhatHanh = hoaDon.NgayPhatHanh?.ToDateTime(TimeOnly.MinValue) ?? DateTime.MinValue,
                    NgayThanhToan = hoaDon.NgayThanhToan,
                    MaCanBoTao = hoaDon.MaCanBoTao,
                    TenCanBoTao = hoaDon.MaCanBoTaoNavigation?.MaNguoiDungNavigation?.HoTen
                };

                return ApiResponse<HoaDonDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<HoaDonDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HoaDonDTO>> Create(int maCanBo, CreateHoaDonDTO dto)
        {
            try
            {
                if (await _unitOfWork.HoaDons.AnyAsync(h => h.SoHoaDon == dto.SoHoaDon))
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Số hóa đơn đã tồn tại");
                }

                var hopDong = await _unitOfWork.HopDongs.GetByIdAsync(dto.MaHopDong);
                if (hopDong == null)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Không tìm thấy hợp đồng");
                }

                if (hopDong.MaSinhVien != dto.MaSinhVien)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Hợp đồng không thuộc sinh viên này");
                }

                if (await _unitOfWork.HoaDons.AnyAsync(h => h.MaHopDong == dto.MaHopDong && h.Thang == dto.Thang && h.Nam == dto.Nam))
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Hóa đơn tháng này đã tồn tại");
                }

                var tongTien = dto.TienPhong + dto.TienDien + dto.TienNuoc + dto.PhiDichVu + dto.PhiPhat;

                var hoaDon = new HoaDon
                {
                    SoHoaDon = dto.SoHoaDon,
                    MaHopDong = dto.MaHopDong,
                    MaSinhVien = dto.MaSinhVien,
                    Thang = dto.Thang,
                    Nam = dto.Nam,
                    NgayPhatHanh = DateOnly.FromDateTime(DateTime.Now),
                    HanThanhToan = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
                    TienPhong = dto.TienPhong,
                    TienDien = dto.TienDien,
                    TienNuoc = dto.TienNuoc,
                    PhiDichVu = dto.PhiDichVu,
                    PhiPhat = dto.PhiPhat,
                    TongTien = tongTien,
                    TrangThai = "ChuaThanhToan",
                    MaCanBoTao = maCanBo,
                    NgayTao = DateTime.Now
                };

                await _unitOfWork.HoaDons.AddAsync(hoaDon);
                await _unitOfWork.SaveChangesAsync();

                var result = new HoaDonDTO
                {
                    MaHoaDon = hoaDon.MaHoaDon,
                    SoHoaDon = hoaDon.SoHoaDon,
                    MaHopDong = hoaDon.MaHopDong,
                    MaSinhVien = hoaDon.MaSinhVien,
                    Thang = hoaDon.Thang,
                    Nam = hoaDon.Nam,
                    TongTien = hoaDon.TongTien,
                    TrangThai = hoaDon.TrangThai
                };

                return ApiResponse<HoaDonDTO>.SuccessResponse(result, "Tạo hóa đơn thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<HoaDonDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HoaDonDTO>> ThanhToan(int maHoaDon, string phuongThucThanhToan, string? maGiaoDich = null)
        {
            try
            {
                var hoaDon = await _unitOfWork.HoaDons.GetByIdAsync(maHoaDon);
                if (hoaDon == null)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Không tìm thấy hóa đơn");
                }

                if (hoaDon.TrangThai == "DaThanhToan")
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Hóa đơn đã được thanh toán");
                }

                hoaDon.TrangThai = "DaThanhToan";
                hoaDon.NgayThanhToan = DateTime.Now;
                hoaDon.PhuongThucThanhToan = phuongThucThanhToan;
                hoaDon.MaGiaoDich = maGiaoDich;

                _unitOfWork.HoaDons.Update(hoaDon);
                await _unitOfWork.SaveChangesAsync();

                var result = new HoaDonDTO
                {
                    MaHoaDon = hoaDon.MaHoaDon,
                    TrangThai = hoaDon.TrangThai,
                    NgayThanhToan = hoaDon.NgayThanhToan
                };

                return ApiResponse<HoaDonDTO>.SuccessResponse(result, "Thanh toán thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<HoaDonDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
