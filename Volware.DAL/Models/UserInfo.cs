namespace Volware.DAL.Models
{
    public class UserInfo : BaseModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ThirdName { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string PhoneNumber { get; set; }

        public int UserId { get; set; }
        public TempUser User { get; set; }
    }
}
