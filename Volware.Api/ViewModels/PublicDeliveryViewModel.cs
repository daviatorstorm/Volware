using Volware.DAL.Models;
using Volware.Common;

namespace Volware.Api.ViewModels
{
    public class PublicDeliveryViewModel
    {
        public PublicDeliveryViewModel()
        {
        }

        public PublicDeliveryViewModel(Delivery delivery)
        {
            DeliveryType = delivery.DeliveryType;
            Description = delivery.Description;
        }

        public OrderDeliveryTypeEnum DeliveryType { get; set; }
        public string Description { get; set; }
    }
}
