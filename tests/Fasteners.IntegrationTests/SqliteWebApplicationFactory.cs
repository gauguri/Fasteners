using System.Linq;
using Fasteners.Infrastructure.Persistence;
using Fasteners.Infrastructure.Seed;
using Fasteners.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Fasteners.IntegrationTests;

public class SqliteWebApplicationFactory : WebApplicationFactory<Program>
{
    private SqliteConnection? _connection;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<FastenersDbContext>));

            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            services.AddDbContext<FastenersDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });

            var serviceProvider = services.BuildServiceProvider();

            using var scope = serviceProvider.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<FastenersDbContext>();
            db.Database.EnsureCreated();

            var seeder = scopedServices.GetRequiredService<SeedData>();
            seeder.EnsureSeedAsync().GetAwaiter().GetResult();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            _connection?.Dispose();
        }
    }
}
