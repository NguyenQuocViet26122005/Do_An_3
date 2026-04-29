using Api_Gateway.BLL;
using Api_Gateway.DTO.Phong;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PhongController : ControllerBase
    {
        private readonly PhongBLL _phongBLL;

        public PhongController(PhongBLL phongBLL)
        {
            _phongBLL = phongBLL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? maToaNha, [FromQuery] string? trangThai)
        {
            var result = await _phongBLL.GetAll(maToaNha, trangThai);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _phongBLL.GetById(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}/giuong")]
        public async Task<IActionResult> GetGiuong(int id)
        {
            var result = await _phongBLL.GetGiuongByPhong(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Create([FromBody] CreatePhongDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _phongBLL.Create(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePhongDTO dto)
        {
            var result = await _phongBLL.Update(id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _phongBLL.Delete(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
