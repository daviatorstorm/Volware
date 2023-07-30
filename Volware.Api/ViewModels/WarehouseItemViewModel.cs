using System.ComponentModel.DataAnnotations;
using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class WarehouseItemViewModel
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Stock { get; set; }

        public string Place { get; set; }

        public int? ExistingId { get; set; }

        [Required]
        public WarehouseItemUnitEnum Unit { get; set; }

        public WarehouseItem ToModel()
        {
            return new WarehouseItem
            {
                Id = ExistingId ?? 0,

                Name = Name,
                Place = Place,
                Stock = Stock,
                Unit = Unit
            };
        }
    }
}
