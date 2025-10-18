using System.Collections.Generic;
using Fasteners.Domain.Entities;

namespace Fasteners.Web.Models;

public class HomeViewModel
{
    public string? Query { get; set; }
    public List<Product> FeaturedProducts { get; set; } = new();
}
