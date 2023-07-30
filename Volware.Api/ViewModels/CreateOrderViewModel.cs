using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class CreateOrderViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public WarehouseItemUnitEnum Unit { get; set; }
        public uint Quantity { get; set; }

        public OrderItem ToModel()
        {
            return new OrderItem
            {
                Name = Name,
                Quantity = Quantity,
                Unit = Unit,
                WarehouseItemId = Id
            };
        }
    }
}
