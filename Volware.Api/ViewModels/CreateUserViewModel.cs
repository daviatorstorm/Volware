using System.ComponentModel.DataAnnotations;
using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class CreateUserViewModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string ThirdName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string City { get; set; }
        [Required]
        public string PhoneNumber { get; set; }

        public UserRoleEnum Role { get; set; }

        [Required]
        public IFormFile ProfilePhoto { get; set; }
        [Required]
        public IFormFileCollection DocumentPhotos { get; set; }

        public TempUser ToModel()
        {
            return new TempUser
            {
                Role = Role,
                UserInfo = new UserInfo
                {
                    FirstName = FirstName,
                    LastName = LastName,
                    ThirdName = ThirdName,
                    Email = Email,
                    City = City,
                    PhoneNumber = PhoneNumber
                }
            };
        }
    }
}
