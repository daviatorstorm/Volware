using Microsoft.AspNetCore.Mvc;
using Volware.Common;
using Volware.Common.Filtering;
using Volware.DAL.Repositories;
using Volware.Api.ViewModels;
using Volware.DAL.Models;

namespace Volware.Api.Controllers
{
    public class ActionLogController : BaseController
    {
        private readonly ActionLogRepository _actionLogRepository;

        public ActionLogController(ActionLogRepository actionLogRepository, ILoggerFactory loggerFactory)
            : base(loggerFactory)
        {
            _actionLogRepository = actionLogRepository;
        }

        [HttpGet]
        public async Task<FilterResult<ActionLogViewModel>> GetFiltered([FromQuery] ActionLogFilterParams filterParams)
        {
            FilterResult<ActionLog> result;
            if (Role == UserRoleEnum.WarehouseAdmin)
            {
                result = await _actionLogRepository.GetFiltered(filterParams, WarehouseId);
            }
            else
            {
                result = await _actionLogRepository.GetFiltered(filterParams, WarehouseId, UserExternalId);
            }

            return new FilterResult<ActionLogViewModel>
            {
                Results = result.Results.Select(x => new ActionLogViewModel(x))
                    .ToList(),
                Total = result.Total
            };
        }
    }
}
