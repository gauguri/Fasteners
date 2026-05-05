using Fasteners.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fasteners.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin,Staff")]
public class DashboardController : Controller
{
    private readonly FastenersDbContext _dbContext;

    public DashboardController(FastenersDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IActionResult> Index()
    {
        var productCount = await _dbContext.Products.CountAsync();
        var variantCount = await _dbContext.ProductVariants.CountAsync();
        var inventoryOnHand = await _dbContext.Inventory.SumAsync(x => x.OnHand);

        ViewData["ProductCount"] = productCount;
        ViewData["VariantCount"] = variantCount;
        ViewData["InventoryOnHand"] = inventoryOnHand;

        return View();
    }
}
