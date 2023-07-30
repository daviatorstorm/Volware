using Microsoft.AspNetCore.Mvc;
using Volware.Admin.ViewModels;
using Volware.Common.Filtering;
using Volware.DAL.Models;
using Volware.DAL.Repositories;

namespace Volware.Admin.Controllers
{
    public class WarehouseController : Controller
    {
        private readonly WarehouseRepository warehouseRepository;

        public WarehouseController(WarehouseRepository warehouseRepository)
        {
            this.warehouseRepository = warehouseRepository;
        }

        // GET: Warehouse
        public async Task<ActionResult> Index()
        {
            var result = await warehouseRepository.GetFiltered(new FilterParams());

            return View(result.Results.Select(x => new PublicWarehouseViewModel(x)));
        }

        // GET: Warehouse/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Warehouse/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Warehouse/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(CreateWarehouseViewModel warehouse)
        {
            try
            {
                await warehouseRepository.AddWarehouse(new Warehouse
                {
                    Address = warehouse.Address,
                    City = warehouse.City
                });

                await warehouseRepository.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Warehouse/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Warehouse/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Warehouse/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Warehouse/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // API

        [HttpGet]
        public async Task<IActionResult> WarehousesForDropdown()
        {
            var warehouses = await warehouseRepository.GetFiltered(new FilterParams());

            return Json(warehouses.Results);
        }
    }
}
