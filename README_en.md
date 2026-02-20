# Shop

Nuxt 4 SSR ecommerce storefront. Product listing with search, category filtering, and pagination. Product detail pages with image gallery and related products. Data sourced from [DummyJSON](https://dummyjson.com) via a BFF layer.

## Prerequisites

- Node.js >= 18
- npm (or pnpm / yarn / bun)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm run preview
```

The build output is in `.output/`. Deploy with `node .output/server/index.mjs` or any Node-compatible host.

## Project Structure

```
app/
├── pages/              # Route pages (SSR entry points)
│   ├── index.vue       # Home
│   └── products/
│       ├── index.vue   # Product listing (PLP)
│       └── [id].vue    # Product detail (PDP)
├── components/         # Reusable UI components
├── composables/        # Shared logic (useProducts)
├── types/              # Frontend TypeScript DTOs
└── app.vue             # Root layout

server/
├── api/                # BFF routes (proxy to DummyJSON)
│   ├── categories.get.ts
│   └── products/
│       ├── index.get.ts
│       ├── [id].get.ts
│       ├── search.get.ts
│       └── category/[category].get.ts
└── utils/              # Server-only helpers (dummyjson mappers)
```

## Key URLs

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/products` | Product listing |
| `/products?q=phone&category=smartphones&page=2` | Filtered / paginated listing |
| `/products/:id` | Product detail page |
| `/api/products` | BFF: product list |
| `/api/products/search?q=phone` | BFF: search (title & category only) |
| `/api/categories` | BFF: category list |

## Documentation

- [Technical decisions](./docs/decisions_en.md) – architecture, framework choices, and rationale
