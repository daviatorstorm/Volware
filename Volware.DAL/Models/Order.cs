using Volware.Common;

namespace Volware.DAL.Models
{
    public class Order : BaseHistoryModel
    {
        public string UniqueIdentifier { get; set; }

        public int CreatedById { get; set; }
        public TempUser CreatedBy { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }

        public OrderStatusEnum Status { get; set; }

        public int? DeliveryId { get; set; }
        public Delivery Delivery { get; set; }

        public IEnumerable<OrderItem> OrderItems { get; set; }
        //public IEnumerable<ActionLog> Actions { get; set; }
    }
}
