using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using Volware.Admin.Models;
using Volware.Admin.ViewModels;
using Volware.DAL.Models;
using Volware.DAL.Repositories;

namespace Volware.Admin.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserRepository userRepository;

        public UserController(ILogger<UserController> logger, UserRepository userRepository)
        {
            _logger = logger;
            this.userRepository = userRepository;
        }

        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([FromForm] CreateUserViewModel createUser)
        {
            try
            {
                var user = await userRepository.Add(new TempUser
                {
                    Role = createUser.Role,
                    WarehouseId = createUser.WarehouseId,
                    UserInfo = new UserInfo
                    {
                        FirstName = createUser.FirstName,
                        LastName = createUser.LastName,
                        ThirdName = createUser.ThirdName,
                        City = createUser.City,
                        Email = createUser.Email,
                        PhoneNumber = createUser.PhoneNumber
                    }
                }, createUser.ProfilePhoto, createUser.DocumentPhotos);

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        public async Task<IActionResult> Index()
        {
            return base.View(await userRepository.GetUsersByRole(new Common.Filtering.FilterParams(),
                            Common.UserRoleEnum.WarehouseAdmin));
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}