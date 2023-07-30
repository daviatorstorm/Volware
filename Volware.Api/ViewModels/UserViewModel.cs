using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class UserViewModel
    {
        public UserViewModel(TempUser user)
        {
            Id = user.ExternalId;
            Email = user.UserInfo.Email;
            Role = user.Role;
            FirstName = user.UserInfo.FirstName;
            LastName = user.UserInfo.LastName;
            InternalId = user.Id;
        }

        public string Id { get; set; }
        public int InternalId { get; set; }
        public string Email { get; set; }
        public UserRoleEnum Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
