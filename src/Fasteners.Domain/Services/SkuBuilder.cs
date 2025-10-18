using System;
using System.Globalization;
using System.Linq;
using System.Text;
using Fasteners.Domain.Entities;

namespace Fasteners.Domain.Services;

public static class SkuBuilder
{
    public static string BuildSku(Product product, ProductVariant variant)
    {
        if (product == null) throw new ArgumentNullException(nameof(product));
        if (variant == null) throw new ArgumentNullException(nameof(variant));

        static string Normalize(string value)
        {
            var normalized = value.Trim().ToUpperInvariant().Replace(" ", "-");
            var filtered = normalized.Where(c => char.IsLetterOrDigit(c) || c is '-' or '.' or '/');
            return string.Join(string.Empty, filtered);
        }

        var components = new[]
        {
            Normalize(product.Category?.Name ?? string.Empty),
            Normalize(variant.Material),
            Normalize(variant.Finish),
            Normalize(variant.ThreadStandard),
            Normalize(variant.ThreadSize),
            Normalize(variant.Diameter),
            Normalize(variant.Length),
            Normalize(variant.HeadType),
            Normalize(variant.PackSize)
        }.Where(x => !string.IsNullOrWhiteSpace(x));

        var builder = new StringBuilder();
        builder.AppendJoin('-', components);
        return builder.ToString().Trim('-');
    }

    public static string BuildMpn(Product product, ProductVariant variant)
    {
        var sku = BuildSku(product, variant);
        return string.Create(CultureInfo.InvariantCulture, $"{sku}-MPN");
    }
}
