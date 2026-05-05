# ForgeLine Fasteners

Production-shaped Next.js starter for a military fasteners ecommerce experience.

## Included

- Searchable seeded catalog with category and series landing pages
- Product detail pages with pricing, stock state, attributes, and sample documents
- RFQ flow with a stub API endpoint
- Cart and checkout scaffolding
- Customer account dashboard with orders and certification documents
- Admin workspace for quote queue and CSV-import handoff
- Support pages for contact, FAQ, shipping, quality, terms, and privacy

## Local Setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.

## Notes

- Data is currently seeded in `lib/data.ts`.
- `/api/quote` and `/api/import` are placeholders for CRM, email, CSV parsing, and search indexing workflows.
- Checkout is intentionally modeled around a hosted payment handoff rather than direct card capture.
