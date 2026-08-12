using Api_Gateway.BLL;
using Api_Gateway.DTO.HoaDon;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HoaDonController : ControllerBase
    {
        private readonly HoaDonBLL _hoaDonBLL;

        public HoaDonController(HoaDonBLL hoaDonBLL)
        {
            _hoaDonBLL = hoaDonBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetAll([FromQuery] int? maSinhVien = null, [FromQuery] string? trangThai = null)
        {
            // Nếu là sinh viên, chỉ xem hóa đơn của mình
            var vaiTro = User.FindFirst(ClaimTypes.Role)?.Value;
            if (vaiTro == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (int.TryParse(maActorClaim, out int maActor))
                {
                    maSinhVien = maActor;
                }
            }

            var result = await _hoaDonBLL.GetAll(maSinhVien, trangThai);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _hoaDonBLL.GetById(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> Create([FromBody] CreateHoaDonDTO dto)
        {
            var maCanBoClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maCanBoClaim, out int maCanBo))
            {
                return Unauthorized(new { success = false, message = "Không xác định được cán bộ" });
            }

            var result = await _hoaDonBLL.Create(maCanBo, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.MaHoaDon }, result);
        }

        [HttpPut("{id}/thanhtoan")]
        [Authorize(Roles = "CanBo,SinhVien")]
        public async Task<IActionResult> ThanhToan(int id, [FromBody] ThanhToanRequest request)
        {
            var result = await _hoaDonBLL.ThanhToan(id, request.PhuongThucThanhToan, request.MaGiaoDich);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        /// <summary>
        /// Tạo hóa đơn cho tất cả sinh viên trong phòng (tự động chia đều điện nước)
        /// </summary>
        [HttpPost("theo-phong")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> CreateTheoPhong([FromBody] CreateHoaDonTheoPhongRequest request)
        {
            var maCanBoClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maCanBoClaim, out int maCanBo))
            {
                return Unauthorized(new { success = false, message = "Không xác định được cán bộ" });
            }

            var result = await _hoaDonBLL.CreateTheoPhong(
                maCanBo,
                request.MaPhong,
                request.Thang,
                request.Nam,
                request.ChiSoDienCu,
                request.ChiSoDienMoi,
                request.GiaDien,
                request.ChiSoNuocCu,
                request.ChiSoNuocMoi,
                request.GiaNuoc,
                request.PhiDichVuMoiNguoi
            );

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }

    public class ThanhToanRequest
    {
        public string PhuongThucThanhToan { get; set; } = string.Empty;
        public string? MaGiaoDich { get; set; }
    }

    public class CreateHoaDonTheoPhongRequest
    {
        public int MaPhong { get; set; }
        public int Thang { get; set; }
        public int Nam { get; set; }
        public decimal ChiSoDienCu { get; set; }
        public decimal ChiSoDienMoi { get; set; }
        public decimal GiaDien { get; set; } = 3500;
        public decimal ChiSoNuocCu { get; set; }
        public decimal ChiSoNuocMoi { get; set; }
        public decimal GiaNuoc { get; set; } = 10000;
        public decimal PhiDichVuMoiNguoi { get; set; } = 30000;
    }
}
