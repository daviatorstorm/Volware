using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using Volware.Common;

namespace Volware.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase, IActionFilter
    {
        private readonly ILoggerFactory _loggerFactory;
        private ILogger _logger;

        public string UserExternalId
        {
            get =>
                User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value;
        }

        public int WarehouseId
        {
            get =>
                int.Parse(User.Claims.FirstOrDefault(x => x.Type == "warehouse").Value);
        }

        public UserRoleEnum Role
        {
            get =>
                Enum.Parse<UserRoleEnum>(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value);
        }

        public BaseController(ILoggerFactory loggerFactory)
        {
            _loggerFactory = loggerFactory;
        }

        public ILogger Logger
        {
            get
            {
                return _logger;
            }
        }

        [NonAction]
        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null)
            {
                _logger.LogError(context.Exception, context.Exception.Message);
            }
        }

        [NonAction]
        public void OnActionExecuting(ActionExecutingContext context)
        {
            _logger = _loggerFactory.CreateLogger(context.Controller.GetType());
            _logger.LogInformation("Controller starting");
        }
    }
}
