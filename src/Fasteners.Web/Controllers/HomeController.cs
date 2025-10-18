using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Fasteners.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Fasteners.Web.Models;

namespace Fasteners.Web.Controllers;

public class HomeController : Controller
{
    private readonly FastenersDbContext _dbContext;

    public HomeController(FastenersDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IActionResult> Index(string? query)
    {
        var products = await _dbContext.Products
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Take(12)
            .ToListAsync();

        var model = new HomeViewModel
        {
            Query = query,
            FeaturedProducts = products
        };

        return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
