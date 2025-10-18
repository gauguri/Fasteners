using System.Threading.Tasks;
using Fasteners.Web;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Fasteners.IntegrationTests.Controllers;

public class HomePageTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HomePageTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task HomePage_ReturnsSuccessStatusCode()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/");
        response.EnsureSuccessStatusCode();
        var html = await response.Content.ReadAsStringAsync();
        Assert.Contains("Engineered fasteners for every mission", html);
    }
}
