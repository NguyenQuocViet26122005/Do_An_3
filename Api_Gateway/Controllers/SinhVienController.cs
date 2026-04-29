using Api_Gateway.BLL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api_Gateway.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SinhVienController : ControllerBase
    {
        private readonly SinhVienBLL _sinhVienBLL;

        public SinhVienController(SinhVienBLL sinhVienBLL)
        {
            _sinhVienBLL = sinhVienBLL;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> GetAll([FromQuery] string? khoa = null, [FromQuery] string? lop = null)
        {
            var result = await _sinhVienBLL.GetAll(khoa, lop);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _sinhVienBLL.GetById(id);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpGet("masv/{maSV}")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> GetByMaSV(string maSV)
        {
            var result = await _sinhVienBLL.GetByMaSV(maSV);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }
    }
}
