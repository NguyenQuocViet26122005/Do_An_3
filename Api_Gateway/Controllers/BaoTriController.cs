using Api_Gateway.BLL;
using Api_Gateway.DTO.BaoTri;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BaoTriController : ControllerBase
    {
        private readonly YeuCauBaoTriBLL _yeuCauBaoTriBLL;

        public BaoTriController(YeuCauBaoTriBLL yeuCauBaoTriBLL)
        {
            _yeuCauBaoTriBLL = yeuCauBaoTriBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetAll([FromQuery] int? maSinhVien = null, [FromQuery] string? trangThai = null)
        {
            // Nếu là sinh viên, chỉ xem yêu cầu của mình
            var vaiTro = User.FindFirst(ClaimTypes.Role)?.Value;
            if (vaiTro == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (int.TryParse(maActorClaim, out int maActor))
                {
                    maSinhVien = maActor;
                }
            }

            var result = await _yeuCauBaoTriBLL.GetAll(maSinhVien, trangThai);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _yeuCauBaoTriBLL.GetById(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "SinhVien")]
        public async Task<IActionResult> Create([FromBody] CreateYeuCauBaoTriDTO dto)
        {
            var maSinhVienClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maSinhVienClaim, out int maSinhVien))
            {
                return Unauthorized(new { success = false, message = "Không xác định được sinh viên" });
            }

            var result = await _yeuCauBaoTriBLL.Create(maSinhVien, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.MaYeuCau }, result);
        }

        [HttpPut("{id}/xuly")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> XuLy(int id, [FromBody] XuLyBaoTriDTO dto)
        {
            var maCanBoClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maCanBoClaim, out int maCanBo))
            {
                return Unauthorized(new { success = false, message = "Không xác định được cán bộ" });
            }

            var result = await _yeuCauBaoTriBLL.XuLy(id, maCanBo, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
