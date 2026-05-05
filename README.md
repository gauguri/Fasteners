# Fasteners Commerce

Production-shaped fasteners ecommerce workspace.

This branch adds a modern Next.js storefront for a B2B military/aerospace fasteners catalog while preserving the existing ASP.NET Core commerce starter that lives under `src/`.

## Next.js Storefront

The new storefront includes:

- Modern homepage, category, series, product, search, cart, checkout, quote, account, admin, and support pages.
- Seeded catalog data with normalized specs, live-style inventory, customer pricing, pack/minimum-order rules, alternates, supersessions, compliance metadata, and documents.
- Product detail pages with rich product imagery, interactive 3D-style product viewer, pricing, inventory, compliance, alternates, and document sections.
- Powerful catalog search with exact part matching, normalized matching, prefix search, typo tolerance, filters, saved searches, autocomplete, and paste-a-BOM bulk lookup.
- API routes for product lookup, individual product details, autocomplete, BOM lookup, quote submission, and import handling.

### Run the Next.js app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm run start
```

## ASP.NET Core Starter

The repository also includes the original clean-architecture inspired ASP.NET Core 8 starter:

- `src/Fasteners.Domain`
- `src/Fasteners.Application`
- `src/Fasteners.Infrastructure`
- `src/Fasteners.Web`
- `src/Fasteners.Api`
- `tests/`
- `tools/`

### Run the ASP.NET solution

```bash
dotnet restore fasteners-commerce.sln
dotnet build fasteners-commerce.sln
dotnet run --project src/Fasteners.Web
```

## Notes

- Next.js catalog data is currently seeded in `lib/data.ts`.
- Search ranking and BOM parsing live in `lib/search.ts`.
- Checkout, quote, and import routes are scaffolded for later provider integrations.
- Sensitive runtime settings should stay out of source control.
