using System;
using System.Collections.Generic;

namespace Fasteners.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public Category? Parent { get; set; }
    public List<Category> Children { get; set; } = new();
    public List<Product> Products { get; set; } = new();
}

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    public Guid BrandId { get; set; }
    public Brand? Brand { get; set; }
    public List<ProductVariant> Variants { get; set; } = new();
    public List<ProductSpecification> Specifications { get; set; } = new();
    public List<ProductImage> Images { get; set; } = new();
}

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Mpn { get; set; } = string.Empty;
    public string ThreadStandard { get; set; } = string.Empty;
    public string ThreadSize { get; set; } = string.Empty;
    public string Diameter { get; set; } = string.Empty;
    public string Length { get; set; } = string.Empty;
    public string HeadType { get; set; } = string.Empty;
    public string DriveType { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty;
    public string Finish { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string PackSize { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public List<PriceTier> PriceTiers { get; set; } = new();
    public Inventory? Inventory { get; set; } = new();
}

public class PriceTier
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    public string TierName { get; set; } = string.Empty;
    public int MinQuantity { get; set; }
    public decimal Price { get; set; }
}

public class Inventory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    public int OnHand { get; set; }
    public int Allocated { get; set; }
    public int Backordered { get; set; }
    public bool AllowBackorder { get; set; }
    public DateTime? EstimatedRestockDate { get; set; }
}

public class Brand
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
}

public class ProductSpecification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public Guid SpecificationId { get; set; }
    public Specification? Specification { get; set; }
    public Guid SpecOptionId { get; set; }
    public SpecOption? SpecOption { get; set; }
}

public class Specification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<SpecOption> Options { get; set; } = new();
}

public class SpecOption
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SpecificationId { get; set; }
    public Specification? Specification { get; set; }
    public string Value { get; set; } = string.Empty;
    public string NormalizedValue { get; set; } = string.Empty;
}

public class Supplier
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
}

public class PurchaseOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedArrival { get; set; }
    public List<PurchaseOrderLine> Lines { get; set; } = new();
    public string Status { get; set; } = "Draft";
}

public class PurchaseOrderLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PurchaseOrderId { get; set; }
    public PurchaseOrder? PurchaseOrder { get; set; }
    public Guid ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    public int Quantity { get; set; }
    public decimal Cost { get; set; }
}

public class ProductImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public string Url { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string AltText { get; set; } = string.Empty;
}
