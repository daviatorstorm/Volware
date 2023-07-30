using Volware.DAL.Models;

namespace Volware.Admin.ViewModels
{
    public class PublicWarehouseViewModel
    {
        public PublicWarehouseViewModel(Warehouse x)
        {
            Id = x.Id;
            City = x.City;
            City = x.Address;
        }

        public int Id { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
    }
}
