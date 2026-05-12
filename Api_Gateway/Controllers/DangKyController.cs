using Api_Gateway.BLL;
using Api_Gateway.DTO.DangKy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DangKyController : ControllerBase
    {
        private readonly DangKyPhongBLL _dangKyBLL;

        public DangKyController(DangKyPhongBLL dangKyBLL)
        {
            _dangKyBLL = dangKyBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo,SinhVien")]
        public async Task<IActionResult> GetAll([FromQuery] int? maSinhVien, [FromQuery] string? trangThai)
        {
            var vaiTro = User.FindFirst(ClaimTypes.Role)?.Value;

            // Nếu là SinhVien, chỉ được xem đăng ký của chính mình
            if (vaiTro == "SinhVien")
            {
                var maActorClaim = User.FindFirst("MaActor")?.Value;
                if (int.TryParse(maActorClaim, out int maSinhVienCuaMinh))
                {
                    maSinhVien = maSinhVienCuaMinh;
                }
            }

            var result = await _dangKyBLL.GetAll(maSinhVien, trangThai);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost]
        [Authorize(Roles = "SinhVien")]
        public async Task<IActionResult> Create([FromBody] CreateDangKyDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var maActorClaim = User.FindFirst("MaActor")?.Value;
            if (string.IsNullOrEmpty(maActorClaim) || !int.TryParse(maActorClaim, out int maSinhVien))
            {
                return Unauthorized(new { message = "Không xác định được sinh viên" });
            }

            var result = await _dangKyBLL.Create(maSinhVien, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/duyet")]
        [Authorize(Roles = "CanBo")]
        public async Task<IActionResult> Duyet(int id, [FromBody] DuyetDangKyDTO dto)
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

            var result = await _dangKyBLL.Duyet(id, maCanBo, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SinhVien")]
        public async Task<IActionResult> Delete(int id)
        {
            var maActorClaim = User.FindFirst("MaActor")?.Value;
            if (string.IsNullOrEmpty(maActorClaim) || !int.TryParse(maActorClaim, out int maSinhVien))
            {
                return Unauthorized(new { message = "Không xác định được sinh viên" });
            }

            var result = await _dangKyBLL.Delete(id, maSinhVien);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
