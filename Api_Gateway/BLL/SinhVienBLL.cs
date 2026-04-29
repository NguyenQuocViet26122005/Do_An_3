using Api_Gateway.DAL;
using Api_Gateway.DTO.Common;
using Api_Gateway.DTO.SinhVien;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class SinhVienBLL
    {
        private readonly IUnitOfWork _unitOfWork;

        public SinhVienBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<List<SinhVienDTO>>> GetAll(string? khoa = null, string? lop = null)
        {
            try
            {
                var query = _unitOfWork.SinhViens.Query()
                    .Include(s => s.MaNguoiDungNavigation)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(khoa))
                {
                    query = query.Where(s => s.Khoa == khoa);
                }

                if (!string.IsNullOrEmpty(lop))
                {
                    query = query.Where(s => s.Lop == lop);
                }

                var sinhViens = await query.ToListAsync();

                var result = sinhViens.Select(s => new SinhVienDTO
                {
                    MaSinhVien = s.MaSinhVien,
                    MaNguoiDung = s.MaNguoiDung,
                    MaSv = s.MaSv,
                    HoTen = s.MaNguoiDungNavigation?.HoTen ?? "",
                    GioiTinh = s.MaNguoiDungNavigation?.GioiTinh,
                    NgaySinh = s.MaNguoiDungNavigation?.NgaySinh,
                    SoDienThoai = s.MaNguoiDungNavigation?.SoDienThoai,
                    Email = s.MaNguoiDungNavigation?.Email,
                    Cccd = s.MaNguoiDungNavigation?.Cccd,
                    DiaChi = s.MaNguoiDungNavigation?.DiaChi,
                    Khoa = s.Khoa,
                    Nganh = s.Nganh,
                    Lop = s.Lop,
                    NamHoc = s.NamHoc,
                    DiemTb = s.DiemTb
                }).ToList();

                return ApiResponse<List<SinhVienDTO>>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<SinhVienDTO>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<SinhVienDTO>> GetById(int id)
        {
            try
            {
                var sinhVien = await _unitOfWork.SinhViens.Query()
                    .Include(s => s.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(s => s.MaSinhVien == id);

                if (sinhVien == null)
                {
                    return ApiResponse<SinhVienDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                var result = new SinhVienDTO
                {
                    MaSinhVien = sinhVien.MaSinhVien,
                    MaNguoiDung = sinhVien.MaNguoiDung,
                    MaSv = sinhVien.MaSv,
                    HoTen = sinhVien.MaNguoiDungNavigation?.HoTen ?? "",
                    GioiTinh = sinhVien.MaNguoiDungNavigation?.GioiTinh,
                    NgaySinh = sinhVien.MaNguoiDungNavigation?.NgaySinh,
                    SoDienThoai = sinhVien.MaNguoiDungNavigation?.SoDienThoai,
                    Email = sinhVien.MaNguoiDungNavigation?.Email,
                    Cccd = sinhVien.MaNguoiDungNavigation?.Cccd,
                    DiaChi = sinhVien.MaNguoiDungNavigation?.DiaChi,
                    Khoa = sinhVien.Khoa,
                    Nganh = sinhVien.Nganh,
                    Lop = sinhVien.Lop,
                    NamHoc = sinhVien.NamHoc,
                    DiemTb = sinhVien.DiemTb
                };

                return ApiResponse<SinhVienDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<SinhVienDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<SinhVienDTO>> GetByMaSV(string maSV)
        {
            try
            {
                var sinhVien = await _unitOfWork.SinhViens.Query()
                    .Include(s => s.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(s => s.MaSv == maSV);

                if (sinhVien == null)
                {
                    return ApiResponse<SinhVienDTO>.ErrorResponse("Không tìm thấy sinh viên");
                }

                var result = new SinhVienDTO
                {
                    MaSinhVien = sinhVien.MaSinhVien,
                    MaNguoiDung = sinhVien.MaNguoiDung,
                    MaSv = sinhVien.MaSv,
                    HoTen = sinhVien.MaNguoiDungNavigation?.HoTen ?? "",
                    GioiTinh = sinhVien.MaNguoiDungNavigation?.GioiTinh,
                    NgaySinh = sinhVien.MaNguoiDungNavigation?.NgaySinh,
                    SoDienThoai = sinhVien.MaNguoiDungNavigation?.SoDienThoai,
                    Email = sinhVien.MaNguoiDungNavigation?.Email,
                    Cccd = sinhVien.MaNguoiDungNavigation?.Cccd,
                    DiaChi = sinhVien.MaNguoiDungNavigation?.DiaChi,
                    Khoa = sinhVien.Khoa,
                    Nganh = sinhVien.Nganh,
                    Lop = sinhVien.Lop,
                    NamHoc = sinhVien.NamHoc,
                    DiemTb = sinhVien.DiemTb
                };

                return ApiResponse<SinhVienDTO>.SuccessResponse(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<SinhVienDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
