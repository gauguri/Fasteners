using System.Threading.Tasks;
using Fasteners.Domain.Entities;
using Fasteners.Domain.Services;
using Fasteners.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fasteners.Infrastructure.Seed;

public class SeedData
{
    private readonly FastenersDbContext _db;
    private readonly ILogger<SeedData> _logger;

    public SeedData(FastenersDbContext db, ILogger<SeedData> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task EnsureSeedAsync()
    {
        if (await _db.Products.AnyAsync())
        {
            _logger.LogInformation("Seed data already present");
            return;
        }

        _logger.LogInformation("Seeding catalog data");

        var bolts = new Category { Name = "Bolts", Slug = "bolts" };
        var nuts = new Category { Name = "Nuts", Slug = "nuts" };
        _db.Categories.AddRange(bolts, nuts);

        var brand = new Brand { Name = "Apex Fasteners" };
        _db.Brands.Add(brand);

        var product = new Product
        {
            Name = "Hex Cap Bolt",
            Slug = "hex-cap-bolt",
            Category = bolts,
            Brand = brand,
            Description = "High strength alloy steel hex cap bolt with zinc finish."
        };

        var variant = new ProductVariant
        {
            Product = product,
            ThreadStandard = "UNC",
            ThreadSize = "1/4-20",
            Diameter = "0.25 in",
            Length = "1.0 in",
            Material = "Alloy Steel",
            Finish = "Zinc",
            HeadType = "Hex",
            PackSize = "25",
            UnitPrice = 12.50m,
            Inventory = new Inventory { OnHand = 120, Allocated = 10 }
        };

        variant.Sku = SkuBuilder.BuildSku(product, variant);
        variant.Mpn = SkuBuilder.BuildMpn(product, variant);

        product.Variants.Add(variant);
        _db.Products.Add(product);

        var spec = new Specification { Name = "Thread" };
        var option = new SpecOption { Specification = spec, Value = "1/4-20", NormalizedValue = "0.25" };
        spec.Options.Add(option);
        _db.Specifications.Add(spec);

        var productSpec = new ProductSpecification
        {
            Product = product,
            Specification = spec,
            SpecOption = option
        };
        _db.ProductSpecifications.Add(productSpec);

        await _db.SaveChangesAsync();
    }
}
