using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volware.Common;
using Volware.Common.Exceptions;
using Volware.Common.Filtering;
using Volware.DAL.Repositories;
using Volware.Api.ViewModels;

namespace Volware.Api.Controllers
{
    public class UserController : BaseController
    {
        private readonly UserRepository _userRepository;

        public UserController(UserRepository userRepository, ILoggerFactory loggerFactory)
            : base(loggerFactory)
        {
            _userRepository = userRepository;
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet("{id}")]
        public async Task<UserDetailsViewModel> GetById(int id)
        {
            var user = await _userRepository.GetById(id);

            return new UserDetailsViewModel(user);
        }

        [HttpGet("QR")]
        public async Task<Stream> GetQR()
        {
            var qrBytes = await _userRepository.GetQRCode(UserExternalId);

            Response.Headers["Content-Type"] = "image/png";

            return new MemoryStream(qrBytes);
        }

        [HttpGet("QR/{qrCode}")]
        public async Task<UserDetailsViewModel> Get([FromRoute] string qrCode)
        {
            var userProfile = await _userRepository.GetUserByQR(qrCode, WarehouseId);

            return new UserDetailsViewModel(userProfile);
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpGet]
        public async Task<List<UserDetailsViewModel>> GetUsers([FromQuery] FilterParams filter)
        {
            var users = await _userRepository.GetFilteredUsers(filter, WarehouseId);

            return users.Select(x => new UserDetailsViewModel(x)).ToList();
        }

        [HttpGet("profile")]
        public async Task<UserDetailsViewModel> GetProfile()
        {
            var user = await _userRepository.GetProfile(UserExternalId, WarehouseId);

            return new UserDetailsViewModel(user);
        }

        [Authorize(Roles = "WarehouseAdmin,Manager")]
        [HttpPost]
        public async Task<UserDetailsViewModel> AddUser([FromForm] CreateUserViewModel createUser)
        {
            if (createUser.Role == UserRoleEnum.WarehouseAdmin ||
                createUser.Role == UserRoleEnum.Receiver ||
                createUser.Role == UserRoleEnum.Driver)
            {
                throw new VolwareBadRequest("Unknown role");
            }

            if ((createUser.ProfilePhoto == null && createUser.ProfilePhoto.Length == 0) &&
                createUser.DocumentPhotos == null && createUser.DocumentPhotos.Count == 0)
            {
                throw new VolwareBadRequest("Files must be downloaded");
            }

            var user = await _userRepository.Add(createUser.ToModel(), createUser.ProfilePhoto,
                createUser.DocumentPhotos, UserExternalId, WarehouseId); ;

            return new UserDetailsViewModel(user);
        }
    }
}
