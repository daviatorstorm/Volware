using System.ComponentModel.DataAnnotations;

namespace Volware.DAL.Models
{
    public class UserQR
    {
        public DateTime ValidTo { get; set; }
        public DateTime IssuedAt { get; set; }

        public string Seed { get; set; }

        public string ExternalUserId { get; set; }

        [Key]
        public int UserId { get; set; }
        public TempUser User { get; set; }
    }
}
