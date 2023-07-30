using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volware.Api.Validators;
using Volware.Api.ViewModels;
using Volware.Common;
using Volware.Common.Filtering;
using Volware.DAL.Models;
using Volware.DAL.Repositories;

namespace Volware.Api.Controllers
{
    public class OrderController : BaseController
    {
        private readonly UserRepository _userRepository;
        private readonly OrderRepository _orderRepository;
        private readonly OrderValidator _orderValidator;

        public OrderController(UserRepository userRepository, OrderRepository orderRepository,
            OrderValidator orderValidator, ILoggerFactory loggerFactory)
            : base(loggerFactory)
        {
            _userRepository = userRepository;
            _orderRepository = orderRepository;
            _orderValidator = orderValidator;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet]
        public async Task<FilterResult<PublicOrderViewModel>> GetFiltered([FromQuery] OrderFilterParams filterParams)
        {
            FilterResult<Order> orders = await _orderRepository.GetFiltered(filterParams, WarehouseId);

            return new FilterResult<PublicOrderViewModel>
            {
                Results = orders.Results.Select(x => new PublicOrderViewModel(x)).ToList(),
                Total = orders.Total
            };
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet("{orderId}")]
        public async Task<PublicOrderViewModel> GetById([FromRoute] int orderId)
        {
            Order order = await _orderRepository.GetById(orderId, WarehouseId);

            UserDetailsViewModel userProfile = new UserDetailsViewModel(
                await _userRepository.GetById(order.CreatedById));

            return new PublicOrderViewModel(order, userProfile);
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpPost]
        public async Task<PublicOrderViewModel> AddWarehouseItem([FromBody] List<CreateOrderViewModel> createOrder)
        {
            _orderValidator.ValidateOrderCreate(createOrder);

            Order order = await _orderRepository.Add(
                createOrder.Select(x => x.ToModel()).ToList(), WarehouseId, UserExternalId);

            UserDetailsViewModel userProfile = new UserDetailsViewModel(
                await _userRepository.GetById(order.CreatedById));

            return new PublicOrderViewModel(order, userProfile);
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpPut("delivery/{orderId}")]
        public async Task SetDeliveryTypeForOrder([FromRoute] int orderId, [FromBody] CreateDeliveryViewModel createDelivery)
        {
            await _orderRepository.SetDeliveryForOrder(
                orderId, createDelivery.ToModel(), WarehouseId, UserExternalId);
        }
    }
}
