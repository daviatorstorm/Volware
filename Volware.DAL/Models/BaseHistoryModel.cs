namespace Volware.DAL.Models
{
    public class BaseHistoryModel : BaseModel
    {
        public DateTime DateCreated { get; private set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
    }
}
