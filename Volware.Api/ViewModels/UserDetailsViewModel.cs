using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class UserDetailsViewModel
    {
        public UserDetailsViewModel()
        {
        }

        public UserDetailsViewModel(TempUser internalUser)
        {
            Id = internalUser.Id;
            Role = internalUser.Role;
            
            if(internalUser.UserInfo != null)
            {
                ExternalUserId = internalUser.ExternalId;
                Email = internalUser.UserInfo.Email;
                FirstName = internalUser.UserInfo.FirstName;
                LastName = internalUser.UserInfo.LastName;
                ThirdName = internalUser.UserInfo.ThirdName;
                PhoneNumber = internalUser.UserInfo.PhoneNumber;
                City = internalUser.UserInfo.City;
            }

            if (internalUser.ProfileImage != null)
                ProfileImage = internalUser.ProfileImage.FileName;
            if (internalUser.Documents != null)
                DocumentImages = internalUser.Documents.Select(x => x.FileName).ToList();
        }

        public int Id { get; set; }
        public string ExternalUserId { get; set; }
        public ICollection<string> DocumentImages { get; set; }
        public string ProfileImage { get; set; }
        public UserRoleEnum Role { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ThirdName { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
    }
}
