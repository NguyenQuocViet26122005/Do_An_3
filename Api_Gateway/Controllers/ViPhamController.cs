using Api_Gateway.BLL;
using Api_Gateway.DTO.ViPham;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ViPhamController : ControllerBase
    {
        private readonly ViPhamBLL _viPhamBLL;

        public ViPhamController(ViPhamBLL viPhamBLL)
        {
            _viPhamBLL = viPhamBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetAll([FromQuery] int? maSinhVien = null, [FromQuery] string? trangThai = null)
        {
            // Nếu là sinh viên, chỉ xem vi phạm của mình
            var vaiTro = User.FindFirst(ClaimTypes.Role)?.Value;
            if (vaiTro == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (int.TryParse(maActorClaim, out int maActor))
                {
                    maSinhVien = maActor;
                }
            }

            var result = await _viPhamBLL.GetAll(maSinhVien, trangThai);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _viPhamBLL.GetById(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> Create([FromBody] CreateViPhamDTO dto)
        {
            var maCanBoClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maCanBoClaim, out int maCanBo))
            {
                return Unauthorized(new { success = false, message = "Không xác định được cán bộ" });
            }

            var result = await _viPhamBLL.Create(maCanBo, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.MaViPham }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateViPhamDTO dto)
        {
            var result = await _viPhamBLL.Update(id, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut("{id}/xuly")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> XuLy(int id, [FromBody] XuLyViPhamRequest request)
        {
            var result = await _viPhamBLL.XuLy(id, request.TrangThai, request.GhiChu);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }

    public class XuLyViPhamRequest
    {
        public string TrangThai { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
    }
}
