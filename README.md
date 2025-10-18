# Fasteners Commerce

Fasteners Commerce is a sample e-commerce solution for high-specification fasteners. The project demonstrates a clean-architecture inspired ASP.NET Core 8 stack with a modular separation between Domain, Application, Infrastructure, MVC storefront, and JSON API.

> **Important:** This repository is intentionally lightweight compared to a full production deployment. It provides a functional baseline you can extend with richer catalog management, checkout, logistics, and wholesale workflows.

## Project structure

```
fasteners-commerce/
├── src/
│   ├── Fasteners.Domain/          # Entities and domain services
│   ├── Fasteners.Application/     # Application services and catalog orchestration
│   ├── Fasteners.Infrastructure/  # EF Core DbContext, seeding, configuration
│   ├── Fasteners.Web/             # MVC storefront (Tailwind CSS + Razor)
│   └── Fasteners.Api/             # Minimal JSON API with JWT authentication
├── tests/
│   ├── Fasteners.UnitTests/       # Domain-focused unit tests (xUnit)
│   └── Fasteners.IntegrationTests/# Basic MVC integration smoke tests
├── tools/
│   ├── Seed/seed-data.json        # Placeholder for richer seed data
│   └── Import/samples/fasteners.csv # Sample import format (to be implemented)
├── Dockerfile.web
├── Dockerfile.api
├── docker-compose.yml
└── .github/workflows/ci.yml       # GitHub Actions build + test pipeline
```

## Prerequisites

* .NET SDK 8.0.x (the repository ships with a `global.json` pinning to 8.0.404).
* SQL Server 2022 or LocalDB for local development.
* Node.js (optional) if you plan to integrate Tailwind build tooling instead of CDN delivery.

## Getting started

### 1. Restore and build

```bash
dotnet restore fasteners-commerce.sln
dotnet build fasteners-commerce.sln
```

### 2. Apply EF Core migrations & seed data

```bash
dotnet ef database update --project src/Fasteners.Infrastructure --startup-project src/Fasteners.Web
```

The `SeedData` service will populate a starter catalog on first run.

### 3. Run the MVC storefront

```bash
dotnet run --project src/Fasteners.Web
```

Navigate to `https://localhost:5001` to browse the storefront, use the search bar, and view sample featured products.

### 4. Run the JSON API

```bash
dotnet run --project src/Fasteners.Api
```

Swagger UI is available at `https://localhost:5001/swagger` for the API project. Use the `GET /api/v1/products` endpoint to explore seeded catalog data.

## Docker workflow

The repository includes Dockerfiles and a `docker-compose.yml` for local container-based development.

```bash
docker compose up --build
```

This command launches three containers:

* **web** – ASP.NET Core MVC storefront served on port `8080`.
* **api** – JSON API served on port `8081`.
* **db** – SQL Server 2022 Express.

## Continuous integration

The GitHub Actions workflow restores dependencies, builds the solution, runs the test suite, and publishes container images. Update the image names under the `Publish Web Image` and `Publish API Image` steps to match your registry.

## Testing

* **Unit tests:** `dotnet test tests/Fasteners.UnitTests/Fasteners.UnitTests.csproj`
* **Integration tests:** `dotnet test tests/Fasteners.IntegrationTests/Fasteners.IntegrationTests.csproj`

## Configuration

Key configuration is stored in `appsettings.json` for each application project. Override settings using environment variables or user secrets. Sensitive keys (Stripe, JWT, shipping providers) should be managed outside of source control.

## Next steps

This starter includes a minimal data model and UI meant to be expanded. Suggested enhancements include:

* Rich faceted search with HTMX partial updates.
* Advanced pricing tiers with wholesale/contract logic.
* Quote management workflow and saved carts.
* BOM imports, bulk catalog management, and admin dashboard.
* Production-ready Tailwind build pipeline and Lighthouse performance tuning.

Contributions are welcome via pull requests.
