# Companies Directory — How It All Works

> A complete, end-to-end walkthrough of the Companies Directory frontend:
> the stack, the data layer, the filtering & search engine, the sorting,
> the pagination, the view-switching, the design system, and the request
> lifecycle from the moment the page loads to the moment a card appears
> on screen.

---

## Table of Contents

1. [Project Goal](#1-project-goal)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Why These Choices](#3-why-these-choices)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Folder Structure](#5-folder-structure)
6. [The Data Layer (Mock API)](#6-the-data-layer-mock-api)
7. [The API Contract](#7-the-api-contract)
8. [End-to-End Request Flow](#8-end-to-end-request-flow)
9. [State Management](#9-state-management)
10. [Filtering Engine](#10-filtering-engine)
11. [Search Implementation](#11-search-implementation)
12. [Sorting Implementation](#12-sorting-implementation)
13. [Pagination Implementation](#13-pagination-implementation)
14. [View Toggle (Grid ⇄ Table)](#14-view-toggle-grid--table)
15. [Loading, Empty, and Error States](#15-loading-empty-and-error-states)
16. [Design System](#16-design-system)
17. [Component Breakdown](#17-component-breakdown)
18. [Routing](#18-routing)
19. [Performance Notes](#19-performance-notes)
20. [Accessibility](#20-accessibility)
21. [Responsive Strategy](#21-responsive-strategy)
22. [SEO & Metadata](#22-seo--metadata)
23. [Extending the Project](#23-extending-the-project)
24. [Glossary](#24-glossary)

---

## 1. Project Goal

Build a responsive, production-quality React frontend that:

- Consumes a Companies API (mocked for this version).
- Displays the data in **two layouts**: a **card grid** and a **data table**.
- Provides **search** + **filters** (industry, country, size).
- Supports **sorting** (by name, rating, founded year).
- Supports **pagination** (9 items per page).
- Handles **loading**, **empty**, and **error** states gracefully.
- Looks and feels editorial — not generic.

The codebase is intentionally small so it can be read in one sitting, but
every concern (data, UI, state, design tokens) is cleanly separated so the
project can grow into a real backend-powered app without rewrites.

---

## 2. Tech Stack at a Glance

| Layer            | Choice                                | Why                                              |
|------------------|----------------------------------------|--------------------------------------------------|
| Framework        | **React 19**                           | Latest hooks, concurrent rendering               |
| Meta-framework   | **TanStack Start v1** (Vite 7)         | File-based routing, SSR-ready, type-safe         |
| Routing          | **TanStack Router**                    | Type-safe, search-param aware                    |
| Language         | **TypeScript (strict)**                | Compile-time safety                              |
| Styling          | **Tailwind CSS v4**                    | Utility-first, design-token driven               |
| UI primitives    | **shadcn/ui** (Radix under the hood)   | Accessible, unstyled-by-default, copy-in         |
| Icons            | **lucide-react**                       | Lightweight, consistent SVG icons                |
| Fonts            | **Fraunces** + **Inter** (Google)      | Editorial display + clean body                   |
| Data source      | **Local TypeScript module**            | No backend required for v1                       |
| API simulation   | **Promise + setTimeout (600 ms)**      | Mimics real network latency                      |

No global state library is needed — React's built-in hooks (`useState`,
`useEffect`, `useMemo`) handle everything cleanly.

---

## 3. Why These Choices

- **TanStack Start over CRA / plain Vite**: gives us file-based routing,
  SSR-ready loaders, and a typed router for free.
- **Tailwind v4 + design tokens**: every color, shadow, gradient, and
  animation is defined as a CSS variable in `src/styles.css`. Components
  never hardcode colors — they reference tokens like `bg-primary`,
  `text-muted-foreground`, `shadow-card`. This means a single edit to the
  token file restyles the entire app.
- **shadcn/ui**: gives us battle-tested accessible primitives
  (`Select`, `Input`, `Table`, `Badge`, etc.) without locking us into a
  rigid look. We restyle them with our tokens.
- **Local TS data**: keeps the demo zero-config. Swapping it for `fetch`
  is a one-line change (see [§7](#7-the-api-contract)).

---

## 4. High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │   src/routes/index.tsx  (the page)                   │  │
│   │                                                      │  │
│   │   ┌────────────────────────────────────────────┐     │  │
│   │   │ State:                                      │     │  │
│   │   │   data, loading, error                      │     │  │
│   │   │   filters, sort, view, page                 │     │  │
│   │   └────────────────────────────────────────────┘     │  │
│   │                  │                                    │  │
│   │                  ▼                                    │  │
│   │   ┌────────────────────────────────────────────┐     │  │
│   │   │ useMemo → filtered → sorted → paginated     │     │  │
│   │   └────────────────────────────────────────────┘     │  │
│   │                  │                                    │  │
│   │                  ▼                                    │  │
│   │   ┌──────────────┬─────────────┬───────────────┐     │  │
│   │   │CompanyFilters│ Sort select │  Pagination    │     │  │
│   │   │  (search +   │             │   buttons      │     │  │
│   │   │   dropdowns) │             │                │     │  │
│   │   └──────────────┴─────────────┴───────────────┘     │  │
│   │                  │                                    │  │
│   │                  ▼                                    │  │
│   │   ┌────────────────┐    ┌───────────────────┐        │  │
│   │   │ CompanyCard ×n │ OR │ CompanyTable      │        │  │
│   │   └────────────────┘    └───────────────────┘        │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│         ▲                                                   │
│         │ fetchCompanies() Promise                          │
│         │                                                   │
│   ┌─────┴───────────────────┐                               │
│   │ src/lib/companies-api.ts│  ← simulated 600 ms delay    │
│   └─────┬───────────────────┘                               │
│         │                                                   │
│   ┌─────┴───────────────────┐                               │
│   │ src/data/companies.ts   │  ← 20 sample companies       │
│   └─────────────────────────┘                               │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
src/
├── data/
│   └── companies.ts            # Static dataset + derived lists
├── lib/
│   └── companies-api.ts        # Mock fetch (Promise + setTimeout)
├── components/
│   ├── companies/
│   │   ├── CompanyCard.tsx     # Single company card (grid view)
│   │   ├── CompanyTable.tsx    # Sortable data table (table view)
│   │   └── CompanyFilters.tsx  # Search + filter dropdowns + view toggle
│   └── ui/                     # shadcn primitives (Button, Select, …)
├── routes/
│   ├── __root.tsx              # HTML shell + global meta tags
│   └── index.tsx               # The directory page (this is the brain)
├── router.tsx                  # Router config + global error boundary
└── styles.css                  # Design tokens + Tailwind setup
```

The interesting separation:

- **`data/`** is pure data — no React.
- **`lib/`** is the I/O boundary — swap this file to use a real API.
- **`components/companies/`** is presentation — receives props, renders UI.
- **`routes/index.tsx`** is the orchestrator — owns state and composes
  everything together.

---

## 6. The Data Layer (Mock API)

The dataset lives in `src/data/companies.ts`. Each company has the shape:

```ts
export type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  country: string;
  size: "Startup" | "Small" | "Medium" | "Large" | "Enterprise";
  founded: number;
  website: string;
  description: string;
  rating: number;
};
```

Twenty companies are seeded across multiple industries (Technology,
Healthcare, Finance, Retail, Energy, Aerospace, …) and ten countries
(USA, France, Japan, UK, Germany, …).

Two derived lists are exported so the filter dropdowns stay in sync with
the data automatically:

```ts
export const industries = Array.from(new Set(companies.map(c => c.industry))).sort();
export const countries  = Array.from(new Set(companies.map(c => c.country))).sort();
export const sizes      = ["Startup", "Small", "Medium", "Large", "Enterprise"];
```

If you add a new company with a brand-new industry, the dropdown picks it
up on the next reload — no manual edit required.

---

## 7. The API Contract

`src/lib/companies-api.ts` is the only place that knows **how** data
arrives. The page only knows it returns a `Promise<Company[]>`.

```ts
export async function fetchCompanies(): Promise<Company[]> {
  await new Promise(r => setTimeout(r, 600)); // simulated latency
  return companies;
}
```

To switch to a real backend, replace the body:

```ts
export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("Failed to load companies");
  return res.json();
}
```

The page (`routes/index.tsx`) does not change at all. This is the value
of keeping the boundary thin and well-typed.

---

## 8. End-to-End Request Flow

Here is what happens, step by step, when a user lands on `/`:

1. **TanStack Router** matches the URL `/` to `src/routes/index.tsx`.
2. The `<Index />` component mounts.
3. `useEffect(() => { … }, [])` fires once after first paint.
4. It calls `fetchCompanies()`. While the promise is pending,
   `loading === true`, so the page renders the skeleton placeholder
   (`<LoadingState />`).
5. After ~600 ms the promise resolves with 20 companies. The component
   sets `data` and clears `loading`.
6. React re-renders. The `useMemo` block runs the filter → sort pipeline
   and produces a `filtered` array.
7. Pagination math computes `currentPage` and slices the visible page
   into `paged`.
8. Depending on `view`, either `<CompanyCard />`s or `<CompanyTable />`
   is rendered with `paged`.
9. If the user types in the search box, picks a dropdown, changes the
   sort, or clicks a pagination button, the relevant piece of state
   changes and steps 6–8 re-run. No new network request is made — the
   data is in memory.

If the promise rejects (uncomment the `throw` in
`companies-api.ts`), the page shows a destructive `<Alert>` with the
error message instead of the list.

---

## 9. State Management

All state lives in the page component. There are six pieces:

| State        | Type                  | Owner                | Purpose                          |
|--------------|-----------------------|----------------------|----------------------------------|
| `data`       | `Company[] \| null`   | `useState`           | The full dataset from the API    |
| `loading`    | `boolean`             | `useState`           | Show skeletons while fetching    |
| `error`      | `string \| null`      | `useState`           | Show alert on failure            |
| `filters`    | `{search, industry, country, size}` | `useState` | Active filter values    |
| `sort`       | `SortKey`             | `useState`           | Active sort key                  |
| `view`       | `"grid" \| "table"`   | `useState`           | Active layout                    |
| `page`       | `number`              | `useState`           | Current pagination page (1-based)|

Two effects coordinate things:

- The first `useEffect` runs once and fetches data.
- The second `useEffect` resets `page` to 1 whenever
  `filters`, `sort`, or `view` changes — otherwise a user filtering down
  to 4 results while sitting on page 3 would see an empty page.

We deliberately did **not** reach for Context or a state library —
prop-drilling is shallow (one level), and a Context wrapper would add
boilerplate without measurable benefit.

---

## 10. Filtering Engine

The filtering pipeline is a single `useMemo` inside `routes/index.tsx`:

```ts
const filtered = useMemo(() => {
  if (!data) return [];
  const q = filters.search.trim().toLowerCase();

  const list = data.filter((c) => {
    if (filters.industry !== ALL && c.industry !== filters.industry) return false;
    if (filters.country  !== ALL && c.country  !== filters.country)  return false;
    if (filters.size     !== ALL && c.size     !== filters.size)     return false;
    if (q) {
      const hay = `${c.name} ${c.description} ${c.website} ${c.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // …sort step (next section)…
}, [data, filters, sort]);
```

Important details:

- The constant `ALL = "all"` is the sentinel value used by every "All
  industries / All countries / All sizes" option. Using a named constant
  prevents typos.
- Filters are **AND-combined**: a company must match every active filter.
- Search is **OR-combined within fields**: the query is matched against a
  concatenated haystack of name, description, website, and location.
- The whole computation is memoised — it only re-runs when `data`,
  `filters`, or `sort` actually change.

---

## 11. Search Implementation

The search input is a single `<Input>` inside `CompanyFilters.tsx`,
controlled by `filters.search`. Each keystroke fires:

```ts
onChange={(e) => onChange({ ...filters, search: e.target.value })}
```

Why **case-insensitive substring** matching instead of fuzzy/Levenshtein?

- The dataset is small (20 items). Substring matching is instant and
  predictable.
- Users typing "foundry" expect to find "Foundry & Co" — substring
  matching delivers that with zero ambiguity.
- The haystack includes `name + description + website + location`, so a
  user searching `paris` finds Maison Vert via its location even if they
  don't remember the brand.

There is no debouncing because the dataset is in memory; rendering 20
items per keystroke is well below any perceivable threshold. If the
dataset grew to thousands, debouncing the search input by ~150 ms would
be the next optimisation.

---

## 12. Sorting Implementation

Sorting is the second half of the same `useMemo`:

```ts
const sorted = [...list].sort((a, b) => {
  switch (sort) {
    case "name-asc":     return a.name.localeCompare(b.name);
    case "name-desc":    return b.name.localeCompare(a.name);
    case "rating-desc":  return b.rating - a.rating;
    case "founded-desc": return b.founded - a.founded;
    case "founded-asc":  return a.founded - b.founded;
  }
});
```

Five options are exposed in the `Select`:

- **Name (A → Z)** — alphabetical, the default.
- **Name (Z → A)** — reverse alphabetical.
- **Top rated** — highest `rating` first.
- **Newest first** — most recent `founded` year first.
- **Oldest first** — oldest `founded` year first.

`localeCompare` is used (not `<` / `>`) so that international names sort
correctly under the user's locale.

---

## 13. Pagination Implementation

Pagination is purely client-side because all data is already loaded.

```ts
const PAGE_SIZE   = 9;
const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
const currentPage = Math.min(page, totalPages);
const paged       = filtered.slice((currentPage - 1) * PAGE_SIZE,
                                   currentPage       * PAGE_SIZE);
```

Three guarantees:

- `totalPages` is always at least `1` (so we never render "Page 1 of 0").
- `currentPage` is clamped to `totalPages` — if a filter shrinks the
  results to 4, `page === 3` collapses to `1` automatically.
- The pagination bar is hidden when there is only one page.

The bar renders Prev / numbered buttons / Next, with the active page
styled via `variant="default"` and `aria-current="page"` for assistive
tech.

`PAGE_SIZE = 9` was chosen because the grid is 3 columns wide on
desktop, so 9 fills exactly three rows.

---

## 14. View Toggle (Grid ⇄ Table)

A two-button segmented control inside `CompanyFilters.tsx`:

```tsx
<Button variant={view === "grid"  ? "default" : "ghost"} onClick={() => onViewChange("grid")}>
  <LayoutGrid /> Grid
</Button>
<Button variant={view === "table" ? "default" : "ghost"} onClick={() => onViewChange("table")}>
  <Rows3 /> Table
</Button>
```

The page renders one of two trees based on `view`:

```tsx
view === "grid"
  ? <div className="grid …">{paged.map(c => <CompanyCard … />)}</div>
  : <CompanyTable companies={paged} />
```

Both consume the same `paged` array, so filters / sort / pagination
behave identically across views.

---

## 15. Loading, Empty, and Error States

The page has four mutually exclusive render branches:

1. **Error** → red `<Alert>` with the error message.
2. **Loading** → `<LoadingState />` with `<Skeleton>` placeholders sized
   to match the eventual content (cards or table rows).
3. **Empty** (filters returned 0 matches) → `<EmptyState />` with an icon,
   helpful copy, and a "Clear filters" button.
4. **Data** → grid or table.

This ordering matters — error wins over loading, loading wins over data,
empty replaces data when nothing matches.

---

## 16. Design System

All design decisions live in `src/styles.css` as CSS variables. The
palette is intentionally warm and editorial:

```css
--background:   oklch(0.985 0.008 85);   /* ivory */
--foreground:   oklch(0.18 0.025 50);    /* deep ink */
--primary:      oklch(0.62 0.21 35);     /* vivid coral */
--primary-glow: oklch(0.72 0.19 45);     /* warm orange */
--accent:       oklch(0.92 0.05 75);     /* peach tint */
```

Helpers exposed as Tailwind utilities:

| Utility               | Definition                                                    |
|-----------------------|---------------------------------------------------------------|
| `bg-gradient-hero`    | `linear-gradient(135deg, primary → primary-glow)`             |
| `bg-gradient-subtle`  | Page background gradient ivory → warm cream                   |
| `shadow-card`         | Soft baseline card shadow                                     |
| `shadow-card-hover`   | Lifted shadow with coral tint, used on `:hover`               |
| `shadow-elegant`      | Glow used on the hero brand mark                              |
| `transition-smooth`   | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`                       |
| `font-display`        | Fraunces (display) for headings                               |

Headings use **Fraunces** (a contemporary serif with optical sizing);
body text uses **Inter**. The combination reads as editorial without
being precious.

---

## 17. Component Breakdown

### `CompanyCard.tsx`
Pure presentational. Receives a `Company`, renders:
- A 2-letter monogram in a coral gradient tile.
- The company name (Fraunces) and rating.
- A 2-line description (`line-clamp-2`).
- Three badges: industry, location, size (with size colour-coded).
- Footer with founded year + website link.
- Hover lift via `hover:-translate-y-1` + `shadow-card-hover`.

### `CompanyTable.tsx`
Wraps the shadcn `<Table>`:
- Sticky-styled header with display font.
- Six columns: Company, Industry, Location, Size, Founded, Rating.
- Row hover highlights with the accent colour.

### `CompanyFilters.tsx`
The most logic-heavy component:
- Search `<Input>` with leading magnifier icon.
- Three `<Select>` dropdowns (Industry / Country / Size) using the
  shared `ALL` sentinel.
- View toggle (grid / table).
- Result count + "Clear filters" button (only when any filter is active).

### `routes/index.tsx`
The orchestrator. Owns all state, runs the filter/sort/paginate
pipeline, and composes the hero, filters, sort row, content, and
pagination.

---

## 18. Routing

TanStack Router uses **file-based routing**. Two files matter:

- `src/routes/__root.tsx` — the HTML shell. Sets global meta tags
  (title, description, og:title, og:description, twitter:card) and
  renders `<Outlet />` for child routes. Also defines a 404 page.
- `src/routes/index.tsx` — the `/` route. Uses `createFileRoute("/")`.

The router itself (`src/router.tsx`) wires in:
- `routeTree` (auto-generated by the Vite plugin — never edit manually).
- `defaultErrorComponent` — the global "Something went wrong" boundary
  with Try Again / Go Home actions.
- `scrollRestoration: true` so scroll position is preserved on back/forward.

---

## 19. Performance Notes

- **`useMemo` on the filter+sort pipeline** ensures we only recompute
  when inputs change.
- **Array slicing** for pagination is O(n) and trivial at this scale.
- **No images** are downloaded for cards (we render initials in a
  gradient tile), keeping the page tiny.
- **Fonts** are loaded from Google with `display=swap` so text never
  blocks paint.
- **Tailwind v4** purges unused utilities at build time, so the shipped
  CSS is small.

If the dataset grew to 10k+ rows we would:
1. Move filtering/sorting/pagination server-side.
2. Add request debouncing on the search input.
3. Virtualise the list (e.g. `@tanstack/react-virtual`).

---

## 20. Accessibility

- All inputs have `placeholder` text and visible icons.
- Dropdowns use shadcn's Radix-powered `<Select>` — fully keyboard
  navigable, with proper ARIA roles.
- Pagination buttons set `aria-current="page"` on the active page and
  the surrounding `<nav>` carries `aria-label="Pagination"`.
- View-toggle buttons set `aria-label` so screen readers announce
  "Grid view" / "Table view".
- Color contrast was checked against the warm palette; foreground on
  background and primary-foreground on primary both clear WCAG AA.

---

## 21. Responsive Strategy

- Hero: type scales from `text-5xl` → `text-6xl` → `text-7xl`.
- Filter row: stacks vertically on mobile, becomes a single row at `lg`.
- Filter dropdowns: 2-column grid on small screens, 3-column on `sm`,
  inline row on `lg`.
- Card grid: `1` column → `2` at `md` → `3` at `lg`.
- Table: horizontally scrollable inside its rounded container so it
  never breaks layout on narrow viewports.

---

## 22. SEO & Metadata

`__root.tsx` sets these tags globally:

```html
<title>Companies Directory — Discover innovators worldwide</title>
<meta name="description"  content="Browse a curated directory of companies…">
<meta property="og:title" content="Companies Directory — Discover innovators worldwide">
<meta property="og:description" content="Filter, sort and explore a handpicked directory…">
<meta name="twitter:card" content="summary">
```

Other SEO basics in place:
- A single `<h1>` per page.
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`.
- Viewport meta + UTF-8 charset.

---

## 23. Extending the Project

Suggested next steps, ordered by effort:

1. **Sync filters with the URL** using TanStack Router's
   `validateSearch` + `zodValidator`. Sharable views, browser back works,
   reload preserves filters.
2. **Detail page** at `/companies/$id` with a richer layout. Each card
   becomes a `<Link to="/companies/$id" params={{ id }}>`.
3. **Real backend** — enable Lovable Cloud, create a `companies` table
   with row-level security, and replace `fetchCompanies` with a server
   function. The page code does not change.
4. **Infinite scroll** — replace pagination with an
   `IntersectionObserver` that loads the next page when a sentinel
   element enters the viewport.
5. **Favouriting** — persist a per-user list of favourite companies
   (requires auth → Lovable Cloud).
6. **Analytics** — track which filter combinations are most used.

---

## 24. Glossary

- **Component** — a React function returning JSX.
- **Hook** — a function whose name starts with `use*`. Hooks let
  components hold state and run effects.
- **`useState`** — declares a reactive piece of state.
- **`useEffect`** — runs side effects (network calls, subscriptions)
  after render.
- **`useMemo`** — caches an expensive computation.
- **Design token** — a named CSS variable (e.g. `--primary`) that the
  whole UI references instead of hardcoding values.
- **shadcn/ui** — copy-in React components built on Radix primitives.
- **Radix** — a library of unstyled, accessible UI primitives.
- **TanStack Router** — a fully type-safe router for React.
- **TanStack Start** — the meta-framework wrapping the router with SSR.
- **Mock API** — a function that pretends to be a network request so the
  UI can be developed without a backend.

---

_That's the whole story — from the moment the user opens `/` to the
moment they click a pagination button — laid out so any developer
joining the project tomorrow can be productive in an hour._
