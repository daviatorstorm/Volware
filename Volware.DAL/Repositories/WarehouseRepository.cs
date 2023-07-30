using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Volware.BackgroundWorker;
using Volware.Common;
using Volware.Common.Exceptions;
using Volware.Common.Filtering;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public class WarehouseRepository : BaseRepository<WarehouseItem>
    {
        private readonly IBackgroundQueue _backgroundQueue;
        private readonly UserRepository _userRepository;

        public WarehouseRepository(IBackgroundQueue backgroundQueue, UserRepository userRepository, VolwareDBContext context)
            : base(context)
        {
            _backgroundQueue = backgroundQueue;
            _userRepository = userRepository;
        }

        public async Task<FilterResult<Warehouse>> GetFiltered(FilterParams filter)
        {
            var items = Context.Warehouses.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Q))
            {
                items = items.Where(x => EF.Functions.Like(x.Address.ToLower(), $"%{filter.Q.ToLower()}%") ||
                    EF.Functions.Like(x.City.ToLower(), $"%{filter.Q.ToLower()}%"));
            }

            return new FilterResult<Warehouse>
            {
                Results = await items.Paginate(filter)
                    .ToListAsync(),
                Total = await items.CountAsync()
            };
        }

        public async Task<FilterResult<WarehouseItem>> GetFilteredItems(FilterParams filter, int warehouseId)
        {
            var items = Entities.Where(x => x.WarehouseId == warehouseId);

            if (!string.IsNullOrWhiteSpace(filter.Q))
            {
                items = items.Where(x => EF.Functions.Like(x.Name.ToLower(), $"%{filter.Q.ToLower()}%"));
            }

            return new FilterResult<WarehouseItem>
            {
                Results = await items.Paginate(filter)
                    .ToListAsync(),
                Total = await items.CountAsync()
            };
        }

        public async Task<Warehouse> AddWarehouse(Warehouse warehouse)
        {
            var entity = (await Context.Warehouses.AddAsync(warehouse)).Entity;

            return entity;
        }

        public async Task<WarehouseItem> AddOrUpdateItem(WarehouseItem item, int warehouseId, string userExternalId)
        {
            var internalUser = await _userRepository.GetById(userExternalId);
            if (item.Id != 0)
            {
                item = await UpdateItem(item, warehouseId, internalUser.Id);
            }
            else
            {
                item = await AddItem(item, warehouseId, internalUser.Id);
            }

            return item;
        }

        public async Task<List<WarehouseItem>> GetForDropdown(string warehouseItemName, int warehouseId)
        {
            if (string.IsNullOrWhiteSpace(warehouseItemName))
            {
                return Enumerable.Empty<WarehouseItem>().ToList();
            }

            IQueryable<WarehouseItem> items = Entities;

            if (!string.IsNullOrWhiteSpace(warehouseItemName))
            {
                items = items.Where(x => EF.Functions.Like(x.Name.ToLower(), $"%{warehouseItemName.ToLower()}%"));
            }

            return await items.Where(x => x.WarehouseId == warehouseId)
                .Select(x => new WarehouseItem { Name = x.Name, Id = x.Id })
                .Take(10)
                .ToListAsync();
        }

        private async Task<WarehouseItem> AddItem(WarehouseItem item, int warehouseId, int userId)
        {
            if (Entities.Any(x => EF.Functions.Like(x.Name.ToLower(), $"%{item.Name}%") && x.WarehouseId == warehouseId))
            {
                throw new VolwareBadRequest("Item already exist");
            }

            item.WarehouseId = warehouseId;

            await this.Add(item);

            await SaveChangesAsync();

            _backgroundQueue.QueueBackgroundWorkItemAsync(async (services, ct) =>
            {
                await services.GetRequiredService<ActionLogRepository>().Add(
                    item.Id, ActionTypeEnum.UpdateWarehouseItem, userId, warehouseId);
            });

            return item;
        }

        private async Task<WarehouseItem> UpdateItem(WarehouseItem item, int warehouseId, int userId)
        {
            WarehouseItem existingItem = await Entities.FirstOrDefaultAsync(x =>
                x.Id == item.Id && x.WarehouseId == warehouseId);

            existingItem.Stock += item.Stock;
            existingItem.Place = item.Place;

            await SaveChangesAsync();

            _backgroundQueue.QueueBackgroundWorkItemAsync(async (services, ct) =>
            {
                await services.GetRequiredService<ActionLogRepository>().Add(
                    existingItem.Id, ActionTypeEnum.AddWarehouseItem, userId, warehouseId);
            });

            return existingItem;
        }

        public async Task<WarehouseItem> Update(int id, WarehouseItem warehouseItem, int warehouseId, string externalUserId)
        {
            var entity = Entities.FirstOrDefault(x => x.Id == id);
            if (entity == null)
            {
                throw new VolwareNotFoundException(externalUserId, typeof(WarehouseItem));
            }

            entity.LastUpdated = DateTime.UtcNow;
            entity.Name = warehouseItem.Name;
            entity.Place = warehouseItem.Place;
            entity.Unit = warehouseItem.Unit;

            await SaveChangesAsync();

            return null;
        }
    }
}
