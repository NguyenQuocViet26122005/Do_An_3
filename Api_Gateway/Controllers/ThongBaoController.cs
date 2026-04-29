using Api_Gateway.BLL;
using Api_Gateway.DTO.ThongBao;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ThongBaoController : ControllerBase
    {
        private readonly ThongBaoBLL _thongBaoBLL;

        public ThongBaoController(ThongBaoBLL thongBaoBLL)
        {
            _thongBaoBLL = thongBaoBLL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? loaiNguoiNhan = null)
        {
            // Lọc theo vai trò người dùng
            var vaiTro = User.FindFirst(ClaimTypes.Role)?.Value;
            if (vaiTro == "SinhVien")
            {
                loaiNguoiNhan = "SinhVien";
            }
            else if (vaiTro == "CanBo")
            {
                loaiNguoiNhan = "CanBo";
            }

            var result = await _thongBaoBLL.GetAll(loaiNguoiNhan);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _thongBaoBLL.GetById(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Create([FromBody] CreateThongBaoDTO dto)
        {
            var maCanBoClaim = User.FindFirst("MaActor")?.Value;
            if (!int.TryParse(maCanBoClaim, out int maCanBo))
            {
                return Unauthorized(new { success = false, message = "Không xác định được cán bộ" });
            }

            var result = await _thongBaoBLL.Create(maCanBo, dto);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Data?.MaThongBao }, result);
        }

        [HttpPut("{id}/dadoc")]
        public async Task<IActionResult> DanhDauDaDoc(int id)
        {
            var result = await _thongBaoBLL.DanhDauDaDoc(id);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _thongBaoBLL.Delete(id);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
