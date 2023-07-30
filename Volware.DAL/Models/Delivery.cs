using Volware.Common;

namespace Volware.DAL.Models
{
    public class Delivery : BaseModel
    {
        public string Description { get; set; }

        public OrderDeliveryTypeEnum DeliveryType { get; set; }

        public int InitiatorId { get; set; }
        public TempUser Initiator { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        //public IEnumerable<DeliveryPoint> DeliveryPoints { get; set; }
    }
}
