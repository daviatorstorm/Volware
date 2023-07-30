using System.ComponentModel.DataAnnotations.Schema;
using Volware.Common;

namespace Volware.DAL.Models
{
    public class TempUser : BaseHistoryModel
    {
        public UserRoleEnum Role { get; set; }

        public string ExternalId { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }

        public int? CreatedById { get; set; }
        public TempUser CreatedBy { get; set; }

        public UserQR UserQR { get; set; }
        public UserInfo UserInfo { get; set; }

        public int ProfileImageId { get; set; }
        [NotMapped]
        public VolwareFile ProfileImage { get; set; }

        [NotMapped]
        public IEnumerable<VolwareFile> Documents { get; set; }
        [NotMapped]
        public IEnumerable<ActionLog> Actions { get; set; }
    }
}
