using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fasteners.Infrastructure.Persistence.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Brands",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Brands", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Categories",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ParentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Categories", x => x.Id);
                table.ForeignKey(
                    name: "FK_Categories_Categories_ParentId",
                    column: x => x.ParentId,
                    principalTable: "Categories",
                    principalColumn: "Id");
            });

        migrationBuilder.CreateTable(
            name: "Specifications",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Specifications", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Suppliers",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Suppliers", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                BrandId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Products", x => x.Id);
                table.ForeignKey(
                    name: "FK_Products_Brands_BrandId",
                    column: x => x.BrandId,
                    principalTable: "Brands",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_Products_Categories_CategoryId",
                    column: x => x.CategoryId,
                    principalTable: "Categories",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "SpecOptions",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                SpecificationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                NormalizedValue = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_SpecOptions", x => x.Id);
                table.ForeignKey(
                    name: "FK_SpecOptions_Specifications_SpecificationId",
                    column: x => x.SpecificationId,
                    principalTable: "Specifications",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "PurchaseOrders",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                SupplierId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                ExpectedArrival = table.Column<DateTime>(type: "datetime2", nullable: true),
                Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PurchaseOrders", x => x.Id);
                table.ForeignKey(
                    name: "FK_PurchaseOrders_Suppliers_SupplierId",
                    column: x => x.SupplierId,
                    principalTable: "Suppliers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "ProductSpecifications",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                SpecificationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                SpecOptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProductSpecifications", x => x.Id);
                table.ForeignKey(
                    name: "FK_ProductSpecifications_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_ProductSpecifications_SpecOptions_SpecOptionId",
                    column: x => x.SpecOptionId,
                    principalTable: "SpecOptions",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_ProductSpecifications_Specifications_SpecificationId",
                    column: x => x.SpecificationId,
                    principalTable: "Specifications",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "ProductVariants",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Sku = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Mpn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ThreadStandard = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ThreadSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Diameter = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Length = table.Column<string>(type: "nvarchar(max)", nullable: false),
                HeadType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                DriveType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Material = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Finish = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Grade = table.Column<string>(type: "nvarchar(max)", nullable: false),
                PackSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProductVariants", x => x.Id);
                table.ForeignKey(
                    name: "FK_ProductVariants_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "ProductImages",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ThumbnailUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                SortOrder = table.Column<int>(type: "int", nullable: false),
                AltText = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProductImages", x => x.Id);
                table.ForeignKey(
                    name: "FK_ProductImages_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "Inventory",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductVariantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                OnHand = table.Column<int>(type: "int", nullable: false),
                Allocated = table.Column<int>(type: "int", nullable: false),
                Backordered = table.Column<int>(type: "int", nullable: false),
                AllowBackorder = table.Column<bool>(type: "bit", nullable: false),
                EstimatedRestockDate = table.Column<DateTime>(type: "datetime2", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Inventory", x => x.Id);
                table.ForeignKey(
                    name: "FK_Inventory_ProductVariants_ProductVariantId",
                    column: x => x.ProductVariantId,
                    principalTable: "ProductVariants",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "PriceTiers",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductVariantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                TierName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                MinQuantity = table.Column<int>(type: "int", nullable: false),
                Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PriceTiers", x => x.Id);
                table.ForeignKey(
                    name: "FK_PriceTiers_ProductVariants_ProductVariantId",
                    column: x => x.ProductVariantId,
                    principalTable: "ProductVariants",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "PurchaseOrderLines",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                PurchaseOrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductVariantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Quantity = table.Column<int>(type: "int", nullable: false),
                Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PurchaseOrderLines", x => x.Id);
                table.ForeignKey(
                    name: "FK_PurchaseOrderLines_ProductVariants_ProductVariantId",
                    column: x => x.ProductVariantId,
                    principalTable: "ProductVariants",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_PurchaseOrderLines_PurchaseOrders_PurchaseOrderId",
                    column: x => x.PurchaseOrderId,
                    principalTable: "PurchaseOrders",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Categories_ParentId",
            table: "Categories",
            column: "ParentId");

        migrationBuilder.CreateIndex(
            name: "IX_Categories_Slug",
            table: "Categories",
            column: "Slug",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Inventory_ProductVariantId",
            table: "Inventory",
            column: "ProductVariantId",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_PriceTiers_ProductVariantId",
            table: "PriceTiers",
            column: "ProductVariantId");

        migrationBuilder.CreateIndex(
            name: "IX_ProductImages_ProductId",
            table: "ProductImages",
            column: "ProductId");

        migrationBuilder.CreateIndex(
            name: "IX_Products_BrandId",
            table: "Products",
            column: "BrandId");

        migrationBuilder.CreateIndex(
            name: "IX_Products_CategoryId",
            table: "Products",
            column: "CategoryId");

        migrationBuilder.CreateIndex(
            name: "IX_Products_Slug",
            table: "Products",
            column: "Slug",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_ProductSpecifications_ProductId",
            table: "ProductSpecifications",
            column: "ProductId");

        migrationBuilder.CreateIndex(
            name: "IX_ProductSpecifications_SpecificationId",
            table: "ProductSpecifications",
            column: "SpecificationId");

        migrationBuilder.CreateIndex(
            name: "IX_ProductSpecifications_SpecOptionId",
            table: "ProductSpecifications",
            column: "SpecOptionId");

        migrationBuilder.CreateIndex(
            name: "IX_ProductVariants_ProductId",
            table: "ProductVariants",
            column: "ProductId");

        migrationBuilder.CreateIndex(
            name: "IX_ProductVariants_Sku",
            table: "ProductVariants",
            column: "Sku",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_PurchaseOrderLines_ProductVariantId",
            table: "PurchaseOrderLines",
            column: "ProductVariantId");

        migrationBuilder.CreateIndex(
            name: "IX_PurchaseOrderLines_PurchaseOrderId",
            table: "PurchaseOrderLines",
            column: "PurchaseOrderId");

        migrationBuilder.CreateIndex(
            name: "IX_PurchaseOrders_SupplierId",
            table: "PurchaseOrders",
            column: "SupplierId");

        migrationBuilder.CreateIndex(
            name: "IX_SpecOptions_SpecificationId",
            table: "SpecOptions",
            column: "SpecificationId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Inventory");

        migrationBuilder.DropTable(
            name: "PriceTiers");

        migrationBuilder.DropTable(
            name: "ProductImages");

        migrationBuilder.DropTable(
            name: "ProductSpecifications");

        migrationBuilder.DropTable(
            name: "PurchaseOrderLines");

        migrationBuilder.DropTable(
            name: "ProductVariants");

        migrationBuilder.DropTable(
            name: "SpecOptions");

        migrationBuilder.DropTable(
            name: "PurchaseOrders");

        migrationBuilder.DropTable(
            name: "Products");

        migrationBuilder.DropTable(
            name: "Specifications");

        migrationBuilder.DropTable(
            name: "Suppliers");

        migrationBuilder.DropTable(
            name: "Brands");

        migrationBuilder.DropTable(
            name: "Categories");
    }
}
