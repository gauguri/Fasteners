using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace Fasteners.IntegrationTests.Controllers;

public class HomePageTests : IClassFixture<SqliteWebApplicationFactory>
{
    private readonly HttpClient _client;

    public HomePageTests(SqliteWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HomePage_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/");
        response.EnsureSuccessStatusCode();
        var html = await response.Content.ReadAsStringAsync();
        Assert.Contains("Engineered fasteners for every mission", html);
    }
}
