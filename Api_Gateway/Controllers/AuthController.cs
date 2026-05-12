using Api_Gateway.BLL;
using Api_Gateway.DTO.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthBLL _authBLL;

        public AuthController(AuthBLL authBLL)
        {
            _authBLL = authBLL;
        }

        /// <summary>
        /// Đăng nhập vào hệ thống
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authBLL.Login(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Đăng ký tài khoản mới
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authBLL.Register(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Admin: lấy danh sách người dùng
        /// </summary>
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers([FromQuery] string? vaiTro, [FromQuery] bool? trangThai)
        {
            var result = await _authBLL.GetUsers(vaiTro, trangThai);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>
        /// Admin: thay đổi trạng thái tài khoản (khóa/mở khóa)
        /// </summary>
        [HttpPut("users/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetUserStatus(int id, [FromBody] SetUserStatusDto request)
        {
            var result = await _authBLL.SetUserStatus(id, request.TrangThai);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
