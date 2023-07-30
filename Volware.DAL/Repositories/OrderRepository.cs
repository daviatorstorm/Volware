using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Volware.BackgroundWorker;
using Volware.Common;
using Volware.Common.Exceptions;
using Volware.Common.Filtering;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public class OrderRepository : BaseRepository<Order>
    {
        private readonly UserRepository _userRepository;
        private readonly IBackgroundQueue _backgroundQueue;

        public OrderRepository(UserRepository userRepository, IBackgroundQueue backgroundQueue, VolwareDBContext context)
            : base(context)
        {
            _userRepository = userRepository;
            _backgroundQueue = backgroundQueue;
        }

        public async Task<FilterResult<Order>> GetFiltered(OrderFilterParams filter, int warehouseId)
        {
            var items = Entities.Where(x => x.WarehouseId == warehouseId);

            if (!string.IsNullOrWhiteSpace(filter.Q))
            {
                items = items.Where(x => EF.Functions.Like(x.UniqueIdentifier.ToLower(), $"%{filter.Q.ToLower()}%"));
            }

            if (filter.D != DateTime.MinValue)
            {
                items = items.Where(x => x.DateCreated.Date == filter.D.ToUniversalTime().Date);
            }

            return new FilterResult<Order>
            {
                Results = await items
                    .OrderByDescending(x => x.DateCreated)
                    .Paginate(filter)
                    .ToListAsync(),
                Total = await items.CountAsync()
            };
        }

        public async Task<Order> GetById(int orderId, int warehouseId)
        {
            var order = await Entities
                .Include(x => x.OrderItems)
                .Include(x => x.Delivery)
                .FirstOrDefaultAsync(x => x.Id == orderId && x.WarehouseId == warehouseId);

            return order;
        }

        public async Task<Order> Add(List<OrderItem> createOrder, int warehouseId, string userExternalId)
        {
            var internalUser = await _userRepository.GetById(userExternalId);

            var warehouse = await Context.Warehouses.FirstAsync(x => x.Id == warehouseId);

            var orderItemsIds = createOrder.Select(x => x.Id).ToList();

            var warehouseItems = await Context.WarehouseItems.Where(x => orderItemsIds.Contains(x.Id)).ToListAsync();
            foreach (var warehouseItem in warehouseItems)
            {
                var orderElement = createOrder.First(x => x.Id == warehouseItem.Id);
                warehouseItem.Stock -= (int)orderElement.Quantity;
            }

            var order = new Order();
            order.UniqueIdentifier = $"Н-{warehouse.Iterator}";
            order.CreatedById = internalUser.Id;
            order.WarehouseId = warehouseId;
            order.OrderItems = createOrder;

            await Context.AddAsync(order);

            warehouse.Iterator += 1;

            await SaveChangesAsync();

            _backgroundQueue.QueueBackgroundWorkItemAsync(async (services, ct) =>
            {
                await services.GetRequiredService<ActionLogRepository>().Add(
                    order.Id, ActionTypeEnum.CreateOrder, internalUser.Id, warehouseId);
            });

            return order;
        }

        public async Task SetDeliveryForOrder(int orderId, Delivery createDelivery, int warehouseId, string userExternalId)
        {
            var order = await Entities
                .Include(x => x.Delivery)
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if (order == null)
            {
                throw new VolwareNotFoundException(userExternalId, order.GetType());
            }

            if (order.Delivery != null)
            {
                throw new VolwareBadRequest(new Dictionary<string, string> {
                    { "Delivery", "This order already has delivery" }
                });
            }

            var user = await Context.TempUsers.FirstOrDefaultAsync(x => x.ExternalId == userExternalId);

            switch (createDelivery.DeliveryType)
            {
                case OrderDeliveryTypeEnum.OnHands:
                    {
                        await HandleOnHandDeliveryType(order, createDelivery, user, warehouseId);
                        break;
                    }
                default:
                    {
                        throw new VolwareBadRequest("Delivery type didn't selected");
                    }
            }
        }

        private async Task HandleOnHandDeliveryType (Order order, Delivery createDelivery, TempUser user, int warehouseId)
        {
            order.Delivery = new Delivery
            {
                DeliveryType = createDelivery.DeliveryType,
                Description = createDelivery.Description,
                InitiatorId = user.Id,
                OrderId = order.Id
            };


            order.Status = OrderStatusEnum.Done;

            await SaveChangesAsync();

            _backgroundQueue.QueueBackgroundWorkItemAsync(async (services, ct) =>
            {
                await services.GetRequiredService<ActionLogRepository>().Add(
                    order.Id, ActionTypeEnum.FinishOrderDelivery, user.Id, warehouseId);
            });
        }
    }
}
