using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class UserProfileViewModel
    {
        public UserProfileViewModel()
        {

        }

        public UserProfileViewModel(TempUser internalUser)
        {
            // TODO: Return here
            Id = internalUser.Id;
            Role = internalUser.Role;
            //ExternalUserId = keycloakUser.Id;
            //Email = keycloakUser.Email;
            //FirstName = keycloakUser.FirstName;
            //LastName = keycloakUser.LastName;
            //ThirdName = keycloakUser.LastName;
            //Username = keycloakUser.Username;
        }

        public int Id { get; set; }
        public string ExternalUserId { get; set; }
        public UserRoleEnum Role { get; set; }
        public double CreatedTimestamp { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ThirdName { get; set; }
        public string Username { get; set; }
    }
}
