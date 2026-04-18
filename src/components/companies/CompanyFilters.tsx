import { Search, X, LayoutGrid, Rows3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industries, countries, sizes } from "@/data/companies";

export type View = "grid" | "table";

export type Filters = {
  search: string;
  industry: string;
  country: string;
  size: string;
};

export const ALL = "all";

export function CompanyFilters({
  filters,
  onChange,
  view,
  onViewChange,
  onReset,
  resultCount,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  view: View;
  onViewChange: (v: View) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const isFiltered =
    filters.search !== "" ||
    filters.industry !== ALL ||
    filters.country !== ALL ||
    filters.size !== ALL;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search companies, descriptions, websites…"
            className="h-11 pl-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:gap-2">
          <Select
            value={filters.industry}
            onValueChange={(v) => onChange({ ...filters, industry: v })}
          >
            <SelectTrigger className="h-11 lg:w-[160px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All industries</SelectItem>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.country}
            onValueChange={(v) => onChange({ ...filters, country: v })}
          >
            <SelectTrigger className="h-11 lg:w-[160px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.size}
            onValueChange={(v) => onChange({ ...filters, size: v })}
          >
            <SelectTrigger className="h-11 lg:w-[140px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All sizes</SelectItem>
              {sizes.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border/70 bg-background p-0.5">
            <Button
              size="sm"
              variant={view === "grid" ? "default" : "ghost"}
              className="h-9 gap-1.5 px-3"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              size="sm"
              variant={view === "table" ? "default" : "ghost"}
              className="h-9 gap-1.5 px-3"
              onClick={() => onViewChange("table")}
              aria-label="Table view"
            >
              <Rows3 className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span>{" "}
          {resultCount === 1 ? "company" : "companies"}
        </p>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
