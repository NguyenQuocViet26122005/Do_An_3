using Api_Gateway.BLL;
using Api_Gateway.DTO.HopDong;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HopDongController : ControllerBase
    {
        private readonly HopDongBLL _hopDongBLL;

        public HopDongController(HopDongBLL hopDongBLL)
        {
            _hopDongBLL = hopDongBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetAll([FromQuery] int? maSinhVien, [FromQuery] string? trangThai)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (string.IsNullOrEmpty(maActorClaim) || !int.TryParse(maActorClaim, out int currentSinhVien))
                {
                    return Unauthorized(new { message = "Không xác định được sinh viên" });
                }
                maSinhVien = currentSinhVien;
            }

            var result = await _hopDongBLL.GetAll(maSinhVien, trangThai);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> Create([FromBody] CreateHopDongDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var maActorClaim = User.FindFirst("MaActor")?.Value;
            if (string.IsNullOrEmpty(maActorClaim) || !int.TryParse(maActorClaim, out int maCanBo))
            {
                return Unauthorized(new { message = "Không xác định được cán bộ" });
            }

            var result = await _hopDongBLL.Create(maCanBo, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/gia-han")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> GiaHan(int id, [FromBody] GiaHanHopDongDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? maSinhVien = null;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (string.IsNullOrEmpty(maActorClaim) || !int.TryParse(maActorClaim, out int currentSinhVien))
                {
                    return Unauthorized(new { message = "Không xác định được sinh viên" });
                }
                maSinhVien = currentSinhVien;
            }

            var result = await _hopDongBLL.GiaHan(id, dto, maSinhVien);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/cham-dut")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> ChamDut(int id)
        {
            var result = await _hopDongBLL.ChamDut(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
