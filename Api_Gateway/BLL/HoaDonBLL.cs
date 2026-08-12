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
                    MaPhong = h.MaHopDongNavigation?.MaPhong,
                    TenPhong = h.MaHopDongNavigation?.MaPhongNavigation?.SoPhong,
                    TenToaNha = h.MaHopDongNavigation?.MaPhongNavigation?.MaToaNhaNavigation?.TenToaNha,
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
                    HanThanhToan = h.HanThanhToan,
                    NgayThanhToan = h.NgayThanhToan,
                    MaCanBoTao = h.MaCanBoTao,
                    TenCanBoTao = h.MaCanBoTaoNavigation?.MaNguoiDungNavigation?.HoTen,
                    ChiSoDienCu = h.ChiSoDienCu,
                    ChiSoDienMoi = h.ChiSoDienMoi,
                    ChiSoNuocCu = h.ChiSoNuocCu,
                    ChiSoNuocMoi = h.ChiSoNuocMoi,
                    PhuongThucThanhToan = h.PhuongThucThanhToan,
                    MaGiaoDich = h.MaGiaoDich
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
                    MaPhong = hoaDon.MaHopDongNavigation?.MaPhong,
                    TenPhong = hoaDon.MaHopDongNavigation?.MaPhongNavigation?.SoPhong,
                    TenToaNha = hoaDon.MaHopDongNavigation?.MaPhongNavigation?.MaToaNhaNavigation?.TenToaNha,
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
                    HanThanhToan = hoaDon.HanThanhToan,
                    NgayThanhToan = hoaDon.NgayThanhToan,
                    MaCanBoTao = hoaDon.MaCanBoTao,
                    TenCanBoTao = hoaDon.MaCanBoTaoNavigation?.MaNguoiDungNavigation?.HoTen,
                    ChiSoDienCu = hoaDon.ChiSoDienCu,
                    ChiSoDienMoi = hoaDon.ChiSoDienMoi,
                    ChiSoNuocCu = hoaDon.ChiSoNuocCu,
                    ChiSoNuocMoi = hoaDon.ChiSoNuocMoi,
                    PhuongThucThanhToan = hoaDon.PhuongThucThanhToan,
                    MaGiaoDich = hoaDon.MaGiaoDich
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

                var hopDong = await _unitOfWork.HopDongs.Query()
                    .Include(h => h.MaSinhVienNavigation)
                        .ThenInclude(sv => sv!.MaNguoiDungNavigation)
                    .Include(h => h.MaPhongNavigation)
                    .FirstOrDefaultAsync(h => h.MaHopDong == dto.MaHopDong);

                if (hopDong == null)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Không tìm thấy hợp đồng");
                }

                // Kiểm tra trạng thái hợp đồng
                if (hopDong.TrangThai != "HieuLuc")
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse($"Hợp đồng không còn hiệu lực (trạng thái: {hopDong.TrangThai})");
                }

                if (hopDong.MaSinhVien != dto.MaSinhVien)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Hợp đồng không thuộc sinh viên này");
                }

                // KIỂM TRA TIỀN PHÒNG KHỚP VỚI HỢP ĐỒNG
                if (dto.TienPhong != hopDong.GiaThue)
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse(
                        $"Tiền phòng không khớp với hợp đồng. Giá thuê trong hợp đồng là {hopDong.GiaThue:N0} VNĐ, bạn nhập {dto.TienPhong:N0} VNĐ");
                }

                if (await _unitOfWork.HoaDons.AnyAsync(h => h.MaHopDong == dto.MaHopDong && h.Thang == dto.Thang && h.Nam == dto.Nam))
                {
                    return ApiResponse<HoaDonDTO>.ErrorResponse("Hóa đơn tháng này đã tồn tại");
                }

                // ===== LOGIC CHIA ĐỀU ĐIỆN NƯỚC THEO SỐ NGƯỜI =====
                decimal tienDienThucTe = dto.TienDien;
                decimal tienNuocThucTe = dto.TienNuoc;

                if (dto.ChiaTheoPhong)
                {
                    // Lấy số người đang ở trong phòng
                    var soNguoiO = hopDong.MaPhongNavigation?.SoNguoiHienTai ?? 1;
                    
                    if (soNguoiO <= 0)
                    {
                        return ApiResponse<HoaDonDTO>.ErrorResponse("Phòng không có người ở, không thể tạo hóa đơn");
                    }

                    // Chia đều tiền điện và nước
                    tienDienThucTe = Math.Round(dto.TienDien / soNguoiO, 0); // Làm tròn đến đơn vị VNĐ
                    tienNuocThucTe = Math.Round(dto.TienNuoc / soNguoiO, 0);
                }

                var tongTien = dto.TienPhong + tienDienThucTe + tienNuocThucTe + dto.PhiDichVu + dto.PhiPhat;

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
                    TienDien = tienDienThucTe,      // Đã chia đều nếu ChiaTheoPhong = true
                    TienNuoc = tienNuocThucTe,      // Đã chia đều nếu ChiaTheoPhong = true
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

        /// <summary>
        /// Tạo hóa đơn cho TẤT CẢ sinh viên trong phòng
        /// Tự động chia đều tiền điện nước theo số người
        /// </summary>
        public async Task<ApiResponse<List<HoaDonDTO>>> CreateTheoPhong(
            int maCanBo,
            int maPhong,
            int thang,
            int nam,
            decimal chiSoDienCu,
            decimal chiSoDienMoi,
            decimal giaDien,
            decimal chiSoNuocCu,
            decimal chiSoNuocMoi,
            decimal giaNuoc,
            decimal phiDichVuMoiNguoi)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // 1. Kiểm tra chỉ số
                if (chiSoDienMoi < chiSoDienCu)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<List<HoaDonDTO>>.ErrorResponse("Chỉ số điện mới phải >= chỉ số cũ");
                }

                if (chiSoNuocMoi < chiSoNuocCu)
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<List<HoaDonDTO>>.ErrorResponse("Chỉ số nước mới phải >= chỉ số cũ");
                }

                // 2. Lấy danh sách hợp đồng hiệu lực trong phòng
                var hopDongs = await _unitOfWork.HopDongs.Query()
                    .Include(h => h.MaSinhVienNavigation).ThenInclude(s => s!.MaNguoiDungNavigation)
                    .Include(h => h.MaPhongNavigation).ThenInclude(p => p!.MaToaNhaNavigation)
                    .Where(h => h.MaPhong == maPhong && h.TrangThai == "HieuLuc")
                    .ToListAsync();

                if (!hopDongs.Any())
                {
                    await _unitOfWork.RollbackAsync();
                    return ApiResponse<List<HoaDonDTO>>.ErrorResponse("Không có sinh viên nào đang ở phòng này");
                }

                var soNguoiO = hopDongs.Count;
                var phong = hopDongs.First().MaPhongNavigation;

                // 3. Tính toán tiền điện nước
                var soDienTieuThu = chiSoDienMoi - chiSoDienCu;
                var soNuocTieuThu = chiSoNuocMoi - chiSoNuocCu;
                var tongTienDien = soDienTieuThu * giaDien;
                var tongTienNuoc = soNuocTieuThu * giaNuoc;

                // Chia đều cho số người
                var tienDienMoiNguoi = Math.Round(tongTienDien / soNguoiO, 0);
                var tienNuocMoiNguoi = Math.Round(tongTienNuoc / soNguoiO, 0);

                // 4. Tạo hóa đơn cho từng sinh viên
                var danhSachHoaDon = new List<HoaDonDTO>();

                foreach (var hopDong in hopDongs)
                {
                    // Kiểm tra đã có hóa đơn tháng này chưa
                    if (await _unitOfWork.HoaDons.AnyAsync(h =>
                        h.MaHopDong == hopDong.MaHopDong &&
                        h.Thang == thang &&
                        h.Nam == nam))
                    {
                        continue; // Skip nếu đã có
                    }

                    var soHoaDon = $"HD{nam}{thang:D2}{phong?.SoPhong}{hopDong.MaSinhVien}";
                    var tongTien = hopDong.GiaThue + tienDienMoiNguoi + tienNuocMoiNguoi + phiDichVuMoiNguoi;

                    var hoaDon = new HoaDon
                    {
                        SoHoaDon = soHoaDon,
                        MaHopDong = hopDong.MaHopDong,
                        MaSinhVien = hopDong.MaSinhVien,
                        Thang = thang,
                        Nam = nam,
                        NgayPhatHanh = DateOnly.FromDateTime(DateTime.Now),
                        HanThanhToan = DateOnly.FromDateTime(DateTime.Now.AddDays(15)),
                        TienPhong = hopDong.GiaThue,
                        TienDien = tienDienMoiNguoi,
                        TienNuoc = tienNuocMoiNguoi,
                        PhiDichVu = phiDichVuMoiNguoi,
                        PhiPhat = 0,
                        TongTien = tongTien,
                        ChiSoDienCu = chiSoDienCu,
                        ChiSoDienMoi = chiSoDienMoi,
                        ChiSoNuocCu = chiSoNuocCu,
                        ChiSoNuocMoi = chiSoNuocMoi,
                        TrangThai = "ChuaThanhToan",
                        MaCanBoTao = maCanBo,
                        NgayTao = DateTime.Now
                    };

                    await _unitOfWork.HoaDons.AddAsync(hoaDon);
                }

                // QUAN TRỌNG: Phải SaveChanges trước khi Commit để MaHoaDon được generate
                await _unitOfWork.SaveChangesAsync();
                
                // Sau khi save, cập nhật lại danh sách DTO với MaHoaDon đã có
                danhSachHoaDon.Clear();
                foreach (var hopDong in hopDongs)
                {
                    var hoaDonVuaTao = await _unitOfWork.HoaDons.Query()
                        .FirstOrDefaultAsync(h => 
                            h.MaHopDong == hopDong.MaHopDong && 
                            h.Thang == thang && 
                            h.Nam == nam);
                    
                    if (hoaDonVuaTao != null)
                    {
                        danhSachHoaDon.Add(new HoaDonDTO
                        {
                            MaHoaDon = hoaDonVuaTao.MaHoaDon,
                            SoHoaDon = hoaDonVuaTao.SoHoaDon,
                            MaSinhVien = hoaDonVuaTao.MaSinhVien,
                            TenSinhVien = hopDong.MaSinhVienNavigation?.MaNguoiDungNavigation?.HoTen,
                            Thang = thang,
                            Nam = nam,
                            TienPhong = hoaDonVuaTao.TienPhong ?? 0,
                            TienDien = hoaDonVuaTao.TienDien ?? 0,
                            TienNuoc = hoaDonVuaTao.TienNuoc ?? 0,
                            PhiDichVu = hoaDonVuaTao.PhiDichVu ?? 0,
                            TongTien = hoaDonVuaTao.TongTien,
                            TrangThai = "ChuaThanhToan"
                        });
                    }
                }

                await _unitOfWork.CommitAsync();

                var tenToaNha = phong?.MaToaNhaNavigation?.TenToaNha ?? "";
                return ApiResponse<List<HoaDonDTO>>.SuccessResponse(
                    danhSachHoaDon,
                    $"✅ Đã tạo {danhSachHoaDon.Count} hóa đơn cho {danhSachHoaDon.Count} sinh viên tại {tenToaNha} - Phòng {phong?.SoPhong} (Tháng {thang}/{nam})"
                );
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<List<HoaDonDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
