using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class CreateDeliveryViewModel
    {
        public OrderDeliveryTypeEnum DeliveryType { get; set; }
        public string Description { get; set; }

        public Delivery ToModel()
        {
            return new Delivery
            {
                DeliveryType = DeliveryType,
                Description = Description
            };
        }
    }
}
