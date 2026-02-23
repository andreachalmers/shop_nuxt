# Shop

Nuxt-4-SSR-Online-Shop. Produktübersicht mit Suche, Kategoriefilter und Paginierung. Produktdetailseiten mit Bildergalerie und verwandten Produkten. Daten von [DummyJSON](https://dummyjson.com) über eine BFF-Schicht.

## Voraussetzungen

- Node.js >= 18
- npm (oder pnpm / yarn / bun)

## Einrichtung

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffnet unter [http://localhost:3000](http://localhost:3000).

## Produktion

```bash
npm run build
npm run preview
```

## Projektstruktur

```
app/
├── pages/              # Seiten (SSR-Einstiegspunkte)
│   ├── index.vue       # Startseite
│   └── products/
│       ├── index.vue   # Produktübersicht (PLP)
│       └── [id].vue    # Produktdetail (PDP)
├── components/         # Wiederverwendbare UI-Komponenten
├── composables/        # Gemeinsame Logik (useProducts)
├── types/              # Frontend TypeScript-DTOs
└── app.vue             # Root-Layout

server/
├── api/                # BFF-Routen (Proxy zu DummyJSON)
│   ├── categories.get.ts
│   └── products/
│       ├── index.get.ts
│       ├── [id].get.ts
│       ├── search.get.ts
│       └── category/[category].get.ts
└── utils/              # Nur-Server-Helfer (DummyJSON-Mapper)
```

## Wichtige URLs

| Pfad | Beschreibung |
|------|--------------|
| `/` | Startseite |
| `/products` | Produktübersicht |
| `/products?q=phone&category=smartphones&page=2` | Gefilterte / paginierte Übersicht |
| `/products/:id` | Produktdetailseite |
| `/api/products` | BFF: Produktliste |
| `/api/products/search?q=phone` | BFF: Suche (nur Titel & Kategorie) |
| `/api/categories` | BFF: Kategorieliste |

## Dokumentation

- [Technische Entscheidungen](./docs/decisions.md) – Architektur, Framework-Auswahl und Begründung
