using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class ActionLogViewModel
    {
        public ActionLogViewModel(ActionLog x)
        {
            ActionType = x.ActionType;
            EntityId = x.EntityId;
            Initiator = x.Initiator != null ?
                new UserViewModel(x.Initiator) :
                null;
        }

        public ActionTypeEnum ActionType { get; set; }

        public int EntityId { get; set; }

        public UserViewModel Initiator { get; set; }
    }
}
