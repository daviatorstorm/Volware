using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volware.Common.Filtering;
using Volware.DAL.Models;
using Volware.DAL.Repositories;
using Volware.Api.ViewModels;

namespace Volware.Api.Controllers
{
    public class WarehouseController : BaseController
    {
        private readonly WarehouseRepository _warehouseRepository;

        public WarehouseController(WarehouseRepository warehouseRepository, ILoggerFactory loggerFactory)
            : base(loggerFactory)
        {
            _warehouseRepository = warehouseRepository;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet]
        public async Task<FilterResult<WarehouseItem>> GetWarehouseItems([FromQuery] FilterParams filter)
        {
            FilterResult<WarehouseItem> items = await _warehouseRepository.GetFilteredItems(filter, WarehouseId);

            return items;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet("{id}")]
        public async Task<WarehouseItem> GetWarehouseItemById([FromRoute] int id)
        {
            WarehouseItem item = await _warehouseRepository.GetById(id);

            return item;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet("dropdown")]
        public async Task<List<WarehouseItem>> GetWarehouseItemDropdown([FromQuery] string q)
        {
            List<WarehouseItem> items = await _warehouseRepository.GetForDropdown(q, WarehouseId);

            return items;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpPost]
        public async Task<WarehouseItem> AddWarehouseItem([FromBody] WarehouseItemViewModel warehouseItem)
        {
            WarehouseItem item = await _warehouseRepository.AddOrUpdateItem(
                warehouseItem.ToModel(), WarehouseId, UserExternalId);

            return item;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpPut("{id}")]
        public async Task<WarehouseItem> UpdateWarehouseItem([FromRoute] int id, [FromBody] WarehouseItemViewModel warehouseItem)
        {
            WarehouseItem item = await _warehouseRepository.Update(
                id, warehouseItem.ToModel(), WarehouseId, UserExternalId);

            return item;
        }
    }
}
