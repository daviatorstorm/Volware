using Volware.Common;
using Volware.DAL.Models;

namespace Volware.Api.ViewModels
{
    public class PublicOrderViewModel
    {
        public int Id { get; set; }

        public DateTime DateCreated { get; set; }

        public string UniqueIdentifier { get; set; }

        public OrderStatusEnum Status { get; set; }

        public UserDetailsViewModel CreatedBy { get; set; }
        public PublicDeliveryViewModel Delivery { get; set; }

        public IEnumerable<PublicOrderItemViewModel> OrderItems { get; set; }
        public IEnumerable<ActionLog> Actions { get; set; }

        public PublicOrderViewModel(Order order, UserDetailsViewModel userProfile = null)
        {
            Id = order.Id;
            DateCreated = order.DateCreated;
            UniqueIdentifier = order.UniqueIdentifier;
            CreatedBy = userProfile ?? new UserDetailsViewModel();
            Status = order.Status;
            Delivery = order.Delivery != null ?
                new PublicDeliveryViewModel(order.Delivery) :
                null;

            OrderItems = order.OrderItems != null ?
                order.OrderItems.Select(x => new PublicOrderItemViewModel(x)) :
                null;
        }
    }
}
