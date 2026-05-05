using System.Linq;
using Fasteners.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fasteners.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly FastenersDbContext _dbContext;

    public ProductsController(FastenersDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts([FromQuery] string? query = null)
    {
        var productsQuery = _dbContext.Products
            .Include(p => p.Variants)
            .ThenInclude(v => v.Inventory)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var token = query.ToLowerInvariant();
            productsQuery = productsQuery.Where(p => p.Name.ToLower().Contains(token) ||
                                                     p.Variants.Any(v => v.Sku.ToLower().Contains(token)));
        }

        var products = await productsQuery.Take(100).ToListAsync();
        return Ok(products.Select(product => new
        {
            product.Id,
            product.Name,
            product.Description,
            product.Slug,
            Category = product.CategoryId,
            Variants = product.Variants.Select(v => new
            {
                v.Id,
                v.Sku,
                v.UnitPrice,
                v.Material,
                v.Finish,
                v.ThreadStandard,
                v.ThreadSize,
                v.Diameter,
                v.Length,
                v.HeadType,
                v.PackSize,
                Inventory = new
                {
                    OnHand = v.Inventory?.OnHand ?? 0,
                    Allocated = v.Inventory?.Allocated ?? 0,
                    Backordered = v.Inventory?.Backordered ?? 0
                }
            })
        }));
    }
}
