using Volware.Common;

namespace Volware.Admin.ViewModels
{
    public class CreateUserViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ThirdName { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string PhoneNumber { get; set; }
        public UserRoleEnum Role { get; set; }
        public int WarehouseId { get; set; }

        public IFormFile ProfilePhoto { get; set; }
        public IFormFileCollection DocumentPhotos { get; set; }
    }
}
