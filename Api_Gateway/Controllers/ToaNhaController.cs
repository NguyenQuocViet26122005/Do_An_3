using Api_Gateway.BLL;
using Api_Gateway.DTO.ToaNha;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ToaNhaController : ControllerBase
    {
        private readonly ToaNhaBLL _toaNhaBLL;

        public ToaNhaController(ToaNhaBLL toaNhaBLL)
        {
            _toaNhaBLL = toaNhaBLL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _toaNhaBLL.GetAll();
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _toaNhaBLL.GetById(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Create([FromBody] CreateToaNhaDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _toaNhaBLL.Create(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,CanBo")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateToaNhaDTO dto)
        {
            var result = await _toaNhaBLL.Update(id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _toaNhaBLL.Delete(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
