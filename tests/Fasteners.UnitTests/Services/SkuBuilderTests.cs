using Fasteners.Domain.Entities;
using Fasteners.Domain.Services;
using Xunit;

namespace Fasteners.UnitTests.Services;

public class SkuBuilderTests
{
    [Fact]
    public void BuildSku_ComposesNormalizedIdentifier()
    {
        var category = new Category { Name = "Bolts" };
        var product = new Product { Name = "Hex Cap Bolt", Category = category };
        var variant = new ProductVariant
        {
            Product = product,
            Material = "Stainless",
            Finish = "316",
            ThreadStandard = "UNC",
            ThreadSize = "1/4-20",
            Diameter = "0.25",
            Length = "1.00",
            HeadType = "Hex",
            PackSize = "100"
        };

        var sku = SkuBuilder.BuildSku(product, variant);
        Assert.Equal("BOLTS-STAINLESS-316-UNC-1/4-20-0.25-1.00-HEX-100", sku);
    }
}
