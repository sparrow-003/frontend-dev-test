import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Building2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { CompanyTable } from "@/components/companies/CompanyTable";
import {
  ALL,
  CompanyFilters,
  type Filters,
  type View,
} from "@/components/companies/CompanyFilters";
import { companies as initialCompanies } from "@/data/companies";

export const Route = createFileRoute("/")({
  component: Index,
});

type SortKey = "name-asc" | "name-desc" | "rating-desc" | "founded-desc" | "founded-asc";
const PAGE_SIZE = 9;

const initialFilters: Filters = {
  search: "",
  industry: ALL,
  country: ALL,
  size: ALL,
};

function Index() {
  // Local dataset — load instantly, no async/loading state.
  const data = initialCompanies;
  const error: string | null = null;

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [view, setView] = useState<View>("grid");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [page, setPage] = useState(1);

  // Reset to first page whenever filters/sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort, view]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = filters.search.trim().toLowerCase();
    const list = data.filter((c) => {
      if (filters.industry !== ALL && c.industry !== filters.industry) return false;
      if (filters.country !== ALL && c.country !== filters.country) return false;
      if (filters.size !== ALL && c.size !== filters.size) return false;
      if (q) {
        const hay = `${c.name} ${c.description} ${c.website} ${c.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "rating-desc": return b.rating - a.rating;
        case "founded-desc": return b.founded - a.founded;
        case "founded-asc": return a.founded - b.founded;
      }
    });
    return sorted;
  }, [data, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.04]" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            A handpicked directory
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Companies <em className="font-normal italic text-primary">worth</em> knowing.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Explore innovators across industries and continents. Filter by what matters,
            switch views, and discover your next favorite team.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {/* Filters */}
        <section className="-mt-8 sm:-mt-10">
          <CompanyFilters
            filters={filters}
            onChange={setFilters}
            view={view}
            onViewChange={setView}
            onReset={() => setFilters(initialFilters)}
            resultCount={filtered.length}
          />
        </section>

        {/* Sort row */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                <SelectItem value="rating-desc">Top rated</SelectItem>
                <SelectItem value="founded-desc">Newest first</SelectItem>
                <SelectItem value="founded-asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <section className="mt-6">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Couldn't load companies</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={() => setFilters(initialFilters)} />
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {paged.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          ) : (
            <CompanyTable companies={paged} />
          )}
        </section>

        {/* Pagination */}
        {!error && filtered.length > 0 && totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(n)}
                className="h-9 w-9 p-0"
                aria-current={n === currentPage ? "page" : undefined}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        )}
      </main>

      <footer className="border-t border-border/60 bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span className="font-display text-sm font-semibold text-foreground">
            Companies Directory
          </span>
          <span>© {new Date().getFullYear()} — Built with React & Tailwind</span>
        </div>
      </footer>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <Building2 className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold">No matches</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try broadening your filters or clearing the search to see more companies.
      </p>
      <Button onClick={onReset} className="mt-5">Clear filters</Button>
    </div>
  );
}
