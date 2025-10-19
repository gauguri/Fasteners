IF DB_ID('FastenersCommerce') IS NULL
BEGIN
    CREATE DATABASE FastenersCommerce;
END
GO

USE FastenersCommerce;
GO

IF OBJECT_ID('dbo.PurchaseOrderLines', 'U') IS NOT NULL DROP TABLE dbo.PurchaseOrderLines;
IF OBJECT_ID('dbo.PriceTiers', 'U') IS NOT NULL DROP TABLE dbo.PriceTiers;
IF OBJECT_ID('dbo.Inventory', 'U') IS NOT NULL DROP TABLE dbo.Inventory;
IF OBJECT_ID('dbo.ProductImages', 'U') IS NOT NULL DROP TABLE dbo.ProductImages;
IF OBJECT_ID('dbo.ProductSpecifications', 'U') IS NOT NULL DROP TABLE dbo.ProductSpecifications;
IF OBJECT_ID('dbo.ProductVariants', 'U') IS NOT NULL DROP TABLE dbo.ProductVariants;
IF OBJECT_ID('dbo.PurchaseOrders', 'U') IS NOT NULL DROP TABLE dbo.PurchaseOrders;
IF OBJECT_ID('dbo.SpecOptions', 'U') IS NOT NULL DROP TABLE dbo.SpecOptions;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Suppliers', 'U') IS NOT NULL DROP TABLE dbo.Suppliers;
IF OBJECT_ID('dbo.Specifications', 'U') IS NOT NULL DROP TABLE dbo.Specifications;
IF OBJECT_ID('dbo.Brands', 'U') IS NOT NULL DROP TABLE dbo.Brands;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
GO

CREATE TABLE dbo.Brands
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL
);
GO

CREATE TABLE dbo.Categories
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Slug NVARCHAR(450) NOT NULL,
    ParentId UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_Categories_Categories_ParentId FOREIGN KEY (ParentId) REFERENCES dbo.Categories (Id)
);
GO

CREATE UNIQUE INDEX IX_Categories_Slug ON dbo.Categories (Slug);
CREATE INDEX IX_Categories_ParentId ON dbo.Categories (ParentId);
GO

CREATE TABLE dbo.Specifications
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL
);
GO

CREATE TABLE dbo.Suppliers
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    ContactEmail NVARCHAR(MAX) NOT NULL,
    ContactPhone NVARCHAR(MAX) NOT NULL
);
GO

CREATE TABLE dbo.Products
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Slug NVARCHAR(450) NOT NULL,
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    BrandId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Products_Categories_CategoryId FOREIGN KEY (CategoryId) REFERENCES dbo.Categories (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Products_Brands_BrandId FOREIGN KEY (BrandId) REFERENCES dbo.Brands (Id) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX IX_Products_Slug ON dbo.Products (Slug);
CREATE INDEX IX_Products_CategoryId ON dbo.Products (CategoryId);
CREATE INDEX IX_Products_BrandId ON dbo.Products (BrandId);
GO

CREATE TABLE dbo.SpecOptions
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    SpecificationId UNIQUEIDENTIFIER NOT NULL,
    Value NVARCHAR(MAX) NOT NULL,
    NormalizedValue NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_SpecOptions_Specifications_SpecificationId FOREIGN KEY (SpecificationId) REFERENCES dbo.Specifications (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_SpecOptions_SpecificationId ON dbo.SpecOptions (SpecificationId);
GO

CREATE TABLE dbo.PurchaseOrders
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    SupplierId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    ExpectedArrival DATETIME2 NULL,
    Status NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_PurchaseOrders_Suppliers_SupplierId FOREIGN KEY (SupplierId) REFERENCES dbo.Suppliers (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_PurchaseOrders_SupplierId ON dbo.PurchaseOrders (SupplierId);
GO

CREATE TABLE dbo.ProductVariants
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    Sku NVARCHAR(450) NOT NULL,
    Mpn NVARCHAR(MAX) NOT NULL,
    ThreadStandard NVARCHAR(MAX) NOT NULL,
    ThreadSize NVARCHAR(MAX) NOT NULL,
    Diameter NVARCHAR(MAX) NOT NULL,
    Length NVARCHAR(MAX) NOT NULL,
    HeadType NVARCHAR(MAX) NOT NULL,
    DriveType NVARCHAR(MAX) NOT NULL,
    Material NVARCHAR(MAX) NOT NULL,
    Finish NVARCHAR(MAX) NOT NULL,
    Grade NVARCHAR(MAX) NOT NULL,
    PackSize NVARCHAR(MAX) NOT NULL,
    UnitPrice DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_ProductVariants_Products_ProductId FOREIGN KEY (ProductId) REFERENCES dbo.Products (Id) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX IX_ProductVariants_Sku ON dbo.ProductVariants (Sku);
CREATE INDEX IX_ProductVariants_ProductId ON dbo.ProductVariants (ProductId);
GO

CREATE TABLE dbo.ProductImages
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    Url NVARCHAR(MAX) NOT NULL,
    ThumbnailUrl NVARCHAR(MAX) NOT NULL,
    SortOrder INT NOT NULL,
    AltText NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_ProductImages_Products_ProductId FOREIGN KEY (ProductId) REFERENCES dbo.Products (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ProductImages_ProductId ON dbo.ProductImages (ProductId);
GO

CREATE TABLE dbo.Inventory
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ProductVariantId UNIQUEIDENTIFIER NOT NULL,
    OnHand INT NOT NULL,
    Allocated INT NOT NULL,
    Backordered INT NOT NULL,
    AllowBackorder BIT NOT NULL,
    EstimatedRestockDate DATETIME2 NULL,
    CONSTRAINT FK_Inventory_ProductVariants_ProductVariantId FOREIGN KEY (ProductVariantId) REFERENCES dbo.ProductVariants (Id) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX IX_Inventory_ProductVariantId ON dbo.Inventory (ProductVariantId);
GO

CREATE TABLE dbo.PriceTiers
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ProductVariantId UNIQUEIDENTIFIER NOT NULL,
    TierName NVARCHAR(MAX) NOT NULL,
    MinQuantity INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_PriceTiers_ProductVariants_ProductVariantId FOREIGN KEY (ProductVariantId) REFERENCES dbo.ProductVariants (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_PriceTiers_ProductVariantId ON dbo.PriceTiers (ProductVariantId);
GO

CREATE TABLE dbo.ProductSpecifications
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    SpecificationId UNIQUEIDENTIFIER NOT NULL,
    SpecOptionId UNIQUEIDENTIFIER NOT NULL,
    -- Use NO ACTION on SpecificationId to avoid SQL Server multiple cascade path errors. The SpecOption cascade still removes
    -- related ProductSpecifications when its Specification is deleted.
    CONSTRAINT FK_ProductSpecifications_Products_ProductId FOREIGN KEY (ProductId) REFERENCES dbo.Products (Id) ON DELETE CASCADE,
    CONSTRAINT FK_ProductSpecifications_Specifications_SpecificationId FOREIGN KEY (SpecificationId) REFERENCES dbo.Specifications (Id) ON DELETE NO ACTION,
    CONSTRAINT FK_ProductSpecifications_SpecOptions_SpecOptionId FOREIGN KEY (SpecOptionId) REFERENCES dbo.SpecOptions (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ProductSpecifications_ProductId ON dbo.ProductSpecifications (ProductId);
CREATE INDEX IX_ProductSpecifications_SpecificationId ON dbo.ProductSpecifications (SpecificationId);
CREATE INDEX IX_ProductSpecifications_SpecOptionId ON dbo.ProductSpecifications (SpecOptionId);
GO

CREATE TABLE dbo.PurchaseOrderLines
(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    PurchaseOrderId UNIQUEIDENTIFIER NOT NULL,
    ProductVariantId UNIQUEIDENTIFIER NOT NULL,
    Quantity INT NOT NULL,
    Cost DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_PurchaseOrderLines_PurchaseOrders_PurchaseOrderId FOREIGN KEY (PurchaseOrderId) REFERENCES dbo.PurchaseOrders (Id) ON DELETE CASCADE,
    CONSTRAINT FK_PurchaseOrderLines_ProductVariants_ProductVariantId FOREIGN KEY (ProductVariantId) REFERENCES dbo.ProductVariants (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_PurchaseOrderLines_PurchaseOrderId ON dbo.PurchaseOrderLines (PurchaseOrderId);
CREATE INDEX IX_PurchaseOrderLines_ProductVariantId ON dbo.PurchaseOrderLines (ProductVariantId);
GO

-- Seed data
DECLARE @CategoryBolts UNIQUEIDENTIFIER = 'D8DCE12C-52BF-4C9C-9B6F-0D71E4F6D601';
DECLARE @CategoryNuts UNIQUEIDENTIFIER = '6CFE9E2A-AC91-4E2A-9D92-1E39A2A0772A';
DECLARE @BrandApex UNIQUEIDENTIFIER = '8D392C51-79B4-4FF2-9B8F-CA3DA81C27E6';
DECLARE @ProductHexCap UNIQUEIDENTIFIER = '5F7832B5-3A3C-4C91-B9C8-8C5D8F5E84AA';
DECLARE @VariantHexCap UNIQUEIDENTIFIER = 'DCB5E6E0-3E30-463E-9B60-4BA6CF32F2A7';
DECLARE @SpecThread UNIQUEIDENTIFIER = 'F0F6C873-8F46-4C63-B5E3-66F0BDE6A5D0';
DECLARE @SpecOptionThread UNIQUEIDENTIFIER = '4D2F6E35-75D2-4F0D-9BC9-90E4E4F1C785';
DECLARE @ProductSpecThread UNIQUEIDENTIFIER = '2B24FBDA-CCCB-4D8D-8B50-CA869927C250';
DECLARE @InventoryHexCap UNIQUEIDENTIFIER = '6EEDBE65-1F34-4F43-8C08-EF29A954CC21';

INSERT INTO dbo.Categories (Id, Name, Slug, ParentId) VALUES
(@CategoryBolts, N'Bolts', N'bolts', NULL),
(@CategoryNuts, N'Nuts', N'nuts', NULL);

INSERT INTO dbo.Brands (Id, Name) VALUES
(@BrandApex, N'Apex Fasteners');

INSERT INTO dbo.Products (Id, Name, Description, Slug, CategoryId, BrandId) VALUES
(@ProductHexCap, N'Hex Cap Bolt', N'High strength alloy steel hex cap bolt with zinc finish.', N'hex-cap-bolt', @CategoryBolts, @BrandApex);

INSERT INTO dbo.ProductVariants
(
    Id,
    ProductId,
    Sku,
    Mpn,
    ThreadStandard,
    ThreadSize,
    Diameter,
    Length,
    HeadType,
    DriveType,
    Material,
    Finish,
    Grade,
    PackSize,
    UnitPrice
)
VALUES
(
    @VariantHexCap,
    @ProductHexCap,
    N'BOLTS-ALLOY-STEEL-ZINC-UNC-1/4-20-0.25-IN-1.0-IN-HEX-25',
    N'BOLTS-ALLOY-STEEL-ZINC-UNC-1/4-20-0.25-IN-1.0-IN-HEX-25-MPN',
    N'UNC',
    N'1/4-20',
    N'0.25 in',
    N'1.0 in',
    N'Hex',
    N'',
    N'Alloy Steel',
    N'Zinc',
    N'',
    N'25',
    12.50
);

INSERT INTO dbo.Inventory
(
    Id,
    ProductVariantId,
    OnHand,
    Allocated,
    Backordered,
    AllowBackorder,
    EstimatedRestockDate
)
VALUES
(
    @InventoryHexCap,
    @VariantHexCap,
    120,
    10,
    0,
    0,
    NULL
);

INSERT INTO dbo.Specifications (Id, Name, Description) VALUES
(@SpecThread, N'Thread', N'');

INSERT INTO dbo.SpecOptions (Id, SpecificationId, Value, NormalizedValue) VALUES
(@SpecOptionThread, @SpecThread, N'1/4-20', N'0.25');

INSERT INTO dbo.ProductSpecifications (Id, ProductId, SpecificationId, SpecOptionId) VALUES
(@ProductSpecThread, @ProductHexCap, @SpecThread, @SpecOptionThread);
GO
