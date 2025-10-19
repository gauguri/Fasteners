using System;
using System.Collections.Generic;

namespace Fasteners.Web.Models;

public class HomeViewModel
{
    public string? Query { get; set; }
    public List<CategorySectionViewModel> CategorySections { get; set; } = new();
}

public class CategorySectionViewModel
{
    public string Title { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public List<ProductSummaryViewModel> Products { get; set; } = new();
}

public class ProductSummaryViewModel
{
    public Guid ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public decimal? Price { get; set; }
    public int VariantCount { get; set; }
}
