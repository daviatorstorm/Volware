using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class PublicOrderItemViewModel
    {
        public PublicOrderItemViewModel(OrderItem orderItem)
        {
            Name = orderItem.Name;
            Quantity = orderItem.Quantity;
            Unit = orderItem.Unit;
        }

        public string Name { get; set; }
        public uint Quantity { get; set; }
        public WarehouseItemUnitEnum Unit { get; set; }
    }
}
