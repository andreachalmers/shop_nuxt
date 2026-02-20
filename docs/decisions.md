# Technische Entscheidungen

## Framework: Nuxt 4

Nuxt wurde gewählt wegen eingebautem SSR, dateibasierter Routen, Server-Routen (Nitro) und automatischem Code-Splitting. Die Anforderung, dass der First Paint serverseitig gerendert wird (SEO und Performance), schloss rein clientseitige SPAs aus. Nuxts `useAsyncData` übernimmt die Übergabe der Daten von SSR zum Client ohne manuelle Hydration-Logik.

## BFF-Architektur (Backend-for-Frontend)

Alle externen API-Aufrufe laufen über Nitro-Serverrouten (`server/api/`). Das Frontend ruft nur `/api/*` auf derselben Origin auf.

**Warum**

- **DTO-Mapping** – externe Strukturen (DummyJSON) werden auf minimale interne DTOs abgebildet; das Frontend sieht nie Rohdaten
- **Kapselung** – ein Austausch der Datenquelle erfordert nur Änderungen an den Serverrouten; das Frontend bleibt unverändert

## State: URL als einzige Wahrheitsquelle

Filter-, Such- und Paginierungs-State steht in der URL-Query (`?q=phone&category=smartphones&page=2`). Kein Pinia oder anderer globaler Store.

**Warum**

- Lesezeichenfähig und teilbar
- Übersteht Seiten-Refresh ohne eigene Persistenzlogik
- SSR und Client lesen denselben State – keine Hydration-Konflikte
- Zurück/Vorwärts funktioniert über den Router
- Vermeidet Store–URL-Sync-Fehler

Ein Store wäre sinnvoll für State, der nicht in die URL gehört (Warenkorb, Auth, UI-Einstellungen). Produktfilter gehören nicht dazu.

## Data Fetching: useAsyncData

`useAsyncData` nutzt einen berechneten Schlüssel aus den aktuellen Filtern/Seite. Bei SSR läuft es auf dem Server und serialisiert das Ergebnis in die Nuxt-Payload. Im Client wird daraus hydriert und neu gefetcht, wenn sich der Schlüssel ändert. Zusätzlich gibt es `pending` für Ladezustände.

## Clientseitige Interaktivität mit SSR

Interaktive Teile (ProductFilters, ProductGallery) nutzen Vues `<ClientOnly>` für reines Browserverhalten (Galerie-Navigation, Thumbnails). Die SSR-Ausgabe enthält den initialen Inhalt (Bilder, Formularfelder mit Werten aus der URL). Interaktive Steuerelemente werden erst nach der Hydration clientseitig eingehängt, sodass:

- schneller First Paint erhalten bleibt
- kein Layout-Sprung entsteht (SSR-Fallback passt zum Client-Layout)

## Styling: Tailwind CSS

Utility-first CSS über `@nuxtjs/tailwindcss`. Keine Komponentenbibliothek.

**Warum**

- Minimal ungenutzter CSS in Produktion (PurgeCSS eingebaut)
- Stile direkt neben dem Markup
- Eigene Tokens (Akzentfarbe) über `tailwind.config.ts` `extend`

## Minimale DTOs

Der BFF liefert nur, was jede Ansicht braucht:

- **PLP:** id, title, price, image, category
- **PDP:** id, title, description, price, images, category, rating

DummyJSON bietet deutlich mehr Felder. Das Trimmen reduziert die Payload-Größe, vermeidet Datenlecks und hält den Frontend-Contract explizit.

## Suche: Nur sichtbare Felder

Suchergebnisse werden auf Felder beschränkt, die auf Produktkarten angezeigt werden: **title** und **category**. DummyJSON durchsucht auch Titel, Beschreibung, Marke usw. Im BFF filtern wir nach, damit Nutzer nur Ergebnisse sehen, die zur UI passen.

## Paginierung: Serverseitig

Paginierung läuft serverseitig (`?limit=20&skip=40`). Der Client lädt nie den gesamten Katalog, wodurch die initiale Seitengröße gering bleibt und mit der Kataloggröße skaliert.

## SEO

Produktdetailseiten setzen dynamische `<meta>`-Tags per `useSeoMeta` während SSR. Crawler erhalten Open-Graph- und Beschreibungs-Tags im initialen HTML, ohne JavaScript ausführen zu müssen.

## Keine externe State-Library

Kein Pinia oder Vuex. URL-Query-Parameter plus `useAsyncData` decken den aktuellen State-Bedarf. Ein Store würde nur Sync-Komplexität hinzufügen, ohne Nutzen für diesen Funktionsumfang.
