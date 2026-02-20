# Technical Decisions

## Framework: Nuxt 4

Nuxt was chosen for built-in SSR, file-based routing, server routes (Nitro), and automatic code splitting. The requirement that the first paint be server-rendered for SEO and performance ruled out client-only SPAs. Nuxt's `useAsyncData` handles the SSR-to-client data handoff without manual hydration logic.

## BFF Architecture (Backend-for-Frontend)

All external API calls go through Nitro server routes (`server/api/`). The frontend only calls `/api/*` on the same origin.

**Why**

- **No CORS** – same-origin requests, no preflight overhead
- **DTO mapping** – external shapes (DummyJSON) are mapped to minimal internal DTOs; the frontend never sees raw external data
- **Encapsulation** – swapping the data source only requires changing server routes; the frontend stays unchanged
- **Security** – external API keys or URLs stay server-side

## State: URL as Source of Truth

Filter, search, and pagination state lives in the URL query string (`?q=phone&category=smartphones&page=2`). No Pinia or other global store.

**Why**

- Bookmarkable and shareable
- Survives page refresh without persistence logic
- SSR and client read the same state – no hydration mismatch
- Back/forward navigation works via the router
- Avoids store–URL sync bugs

A store would be appropriate for state that does not belong in the URL (cart, auth, UI preferences). Product filtering is not in that category.

## Data Fetching: useAsyncData

`useAsyncData` uses a computed key derived from the current filters/page. On SSR it runs on the server and serializes the result into the Nuxt payload. On the client it hydrates from that payload and refetches when the key changes. It also exposes `pending` for loading states.

## Client-Side Interactivity with SSR

Interactive pieces (ProductFilters, ProductGallery) use Vue's `<ClientOnly>` for browser-only behaviour (gallery navigation, thumbnails). The SSR output includes the initial content (images, form fields with values from the URL). Interactive controls mount on the client after hydration, keeping:

- Fast first paint
- No layout shift (SSR fallback matches client layout)

## Styling: Tailwind CSS

Utility-first CSS via `@nuxtjs/tailwindcss`. No component library.

**Why**

- Minimal unused CSS in production (PurgeCSS built in)
- Co-located styles with markup
- Custom tokens (accent colour) via `tailwind.config.ts` `extend`

## Minimal DTOs

The BFF returns only what each view needs:

- **PLP:** id, title, price, image, category
- **PDP:** id, title, description, price, images, category, rating

DummyJSON exposes many more fields. Trimming reduces payload size, avoids leaking internals, and keeps the frontend contract explicit.

## Search: Visible Fields Only

Search results are filtered to fields shown on product cards: **title** and **category**. DummyJSON searches across title, description, brand, etc. We post-filter in the BFF so users only see results that match what they see in the UI.

## Pagination: Server-Side

Pagination is server-side (`?limit=20&skip=40`). The client never loads the full catalog, keeping initial page weight low and scaling with catalog size.

## SEO

Product detail pages set dynamic `<meta>` tags via `useSeoMeta` during SSR. Crawlers receive Open Graph and description tags in the initial HTML without executing JavaScript.

## No External State Library

No Pinia or Vuex. URL query params plus `useAsyncData` cover current state needs. A store would add sync complexity without benefit for this feature set.
