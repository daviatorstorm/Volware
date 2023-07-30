using Volware.Common.Exceptions;
using Volware.DAL.Repositories;
using Volware.Api.ViewModels;

namespace Volware.Api.Validators
{
    public class OrderValidator
    {
        private readonly VolwareDBContext _context;

        public OrderValidator(VolwareDBContext context)
        {
            _context = context;
        }

        public void ValidateOrderCreate(List<CreateOrderViewModel> order)
        {
            var orderItemsIds = order.Select(x => x.Id).ToList();

            var warehouseItems = _context.WarehouseItems.Where(x => orderItemsIds.Contains(x.Id)).ToList();

            if (warehouseItems.Count != orderItemsIds.Count)
            {
                throw new VolwareBadRequest("Some of the items are not in the database");
            }

            foreach (var item in warehouseItems)
            {
                var orderItem = order.First(x => x.Id == item.Id);
                if (orderItem.Quantity > item.Stock)
                {
                    throw new VolwareBadRequest($"Item {orderItem.Name} beeing taken more than its is on the stock");
                }
            }
        }
    }
}
