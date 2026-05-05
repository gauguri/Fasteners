using Fasteners.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Fasteners.Infrastructure.Persistence;

public class FastenersDbContext : DbContext
{
    public FastenersDbContext(DbContextOptions<FastenersDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<PriceTier> PriceTiers => Set<PriceTier>();
    public DbSet<Inventory> Inventory => Set<Inventory>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<ProductSpecification> ProductSpecifications => Set<ProductSpecification>();
    public DbSet<Specification> Specifications => Set<Specification>();
    public DbSet<SpecOption> SpecOptions => Set<SpecOption>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderLine> PurchaseOrderLines => Set<PurchaseOrderLine>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<ProductVariant>().HasIndex(x => x.Sku).IsUnique();

        modelBuilder.Entity<Category>()
            .HasMany(c => c.Children)
            .WithOne(c => c.Parent)
            .HasForeignKey(c => c.ParentId);

        modelBuilder.Entity<Product>()
            .HasMany(p => p.Variants)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId);

        modelBuilder.Entity<Product>()
            .HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId);

        modelBuilder.Entity<ProductVariant>()
            .Property(v => v.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PriceTier>()
            .Property(t => t.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PurchaseOrderLine>()
            .Property(l => l.Cost)
            .HasPrecision(18, 2);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FastenersDbContext).Assembly);
    }
}
