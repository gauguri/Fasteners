using System;
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
        var featuredCategorySlugs = new[] { "bolts", "nuts" };

        var categories = await _dbContext.Categories
            .Where(c => featuredCategorySlugs.Contains(c.Slug))
            .Include(c => c.Products)
                .ThenInclude(p => p.Variants)
            .AsNoTracking()
            .ToListAsync();

        var sections = categories
            .OrderBy(c => Array.IndexOf(featuredCategorySlugs, c.Slug))
            .Select(c => new CategorySectionViewModel
            {
                Title = c.Name,
                CategorySlug = c.Slug,
                Subtitle = c.Name switch
                {
                    "Bolts" => "High-torque bolts engineered for performance-critical assemblies.",
                    "Nuts" => "Lock in reliability with precision-machined nuts for every thread profile.",
                    _ => $"Explore our range of {c.Name.ToLowerInvariant()}."
                },
                Products = c.Products
                    .OrderBy(p => p.Name)
                    .Select(p =>
                    {
                        var variant = p.Variants
                            .OrderBy(v => v.UnitPrice)
                            .FirstOrDefault();

                        return new ProductSummaryViewModel
                        {
                            ProductId = p.Id,
                            Name = p.Name,
                            Description = p.Description,
                            Sku = variant?.Sku,
                            Price = variant?.UnitPrice,
                            VariantCount = p.Variants.Count
                        };
                    })
                    .ToList()
            })
            .ToList();

        var model = new HomeViewModel
        {
            Query = query,
            CategorySections = sections
        };

        return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
