using Volware.Common;

namespace Volware.DAL.Models
{
    public class OrderItem : BaseModel
    {
        public string Name { get; set; }
        public uint Quantity { get; set; }
        public WarehouseItemUnitEnum Unit { get; set; }

        public int WarehouseItemId { get; set; }
        public WarehouseItem WarehouseItem { get; set; }
    }
}
