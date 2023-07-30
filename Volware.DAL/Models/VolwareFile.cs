using Volware.Common;

namespace Volware.DAL.Models
{
    public class VolwareFile : BaseModel
    {
        public string FileName { get; set; }

        public int EntityId { get; set; }
        public VolwareFileEntityEnum Entity { get; set; }
    }
}
