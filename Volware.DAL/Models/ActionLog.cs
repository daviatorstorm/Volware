using Volware.Common;

namespace Volware.DAL.Models
{
    public class ActionLog : BaseHistoryModel
    {
        public string Message { get; set; }
        public ActionTypeEnum ActionType { get; set; }

        public string ExternalUserId { get; set; }

        public int EntityId { get; set; }

        public int InitiatorId { get; set; }
        public TempUser Initiator { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }
    }
}
