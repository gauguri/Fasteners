using System;
using System.Collections.Generic;
using System.Linq;
using Fasteners.Domain.Entities;
using Fasteners.Domain.Services;

namespace Fasteners.Application.Catalog;

public interface ICatalogService
{
    IEnumerable<Product> Search(string query, IEnumerable<string>? filters = null);
    ProductVariant CreateVariant(Product product, Action<ProductVariant> configure);
}

public class CatalogService : ICatalogService
{
    private readonly List<Product> _products;

    public CatalogService(IEnumerable<Product> products)
    {
        _products = products.ToList();
    }

    public IEnumerable<Product> Search(string query, IEnumerable<string>? filters = null)
    {
        var normalized = query?.Trim().ToLowerInvariant() ?? string.Empty;
        IEnumerable<Product> result = _products;

        if (!string.IsNullOrWhiteSpace(normalized))
        {
            result = result.Where(product =>
                product.Name.ToLowerInvariant().Contains(normalized) ||
                product.Variants.Any(v => v.Sku.ToLowerInvariant().Contains(normalized)));
        }

        if (filters != null)
        {
            foreach (var filter in filters)
            {
                var token = filter.ToLowerInvariant();
                result = result.Where(product => product.Variants.Any(v =>
                    v.Material.ToLowerInvariant().Contains(token) ||
                    v.Finish.ToLowerInvariant().Contains(token) ||
                    v.ThreadStandard.ToLowerInvariant().Contains(token)));
            }
        }

        return result.Take(50).ToList();
    }

    public ProductVariant CreateVariant(Product product, Action<ProductVariant> configure)
    {
        var variant = new ProductVariant
        {
            ProductId = product.Id,
            Product = product
        };

        configure(variant);
        variant.Sku = SkuBuilder.BuildSku(product, variant);
        variant.Mpn = SkuBuilder.BuildMpn(product, variant);
        product.Variants.Add(variant);
        return variant;
    }
}
