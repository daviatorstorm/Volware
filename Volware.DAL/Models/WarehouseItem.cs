using System.ComponentModel;
using Volware.Common;

namespace Volware.DAL.Models
{
    public class WarehouseItem : BaseHistoryModel
    {
        [DefaultValue(true)]
        public bool IsActive { get; set; }

        public string Name { get; set; }

        public string Place { get; set; }

        public int Stock { get; set; }

        public WarehouseItemUnitEnum Unit { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }
    }
}
