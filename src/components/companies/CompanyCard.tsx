import { Building2, Globe, MapPin, Star, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/data/companies";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

const sizeTone: Record<Company["size"], string> = {
  Startup: "bg-accent text-accent-foreground",
  Small: "bg-accent text-accent-foreground",
  Medium: "bg-secondary text-secondary-foreground",
  Large: "bg-primary/10 text-primary",
  Enterprise: "bg-primary text-primary-foreground",
};

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-hero font-display text-xl font-semibold text-primary-foreground shadow-elegant">
          {initials(company.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-xl font-semibold leading-tight">
              {company.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {company.rating}
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{company.description}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1 border-border/70 font-normal">
          <Building2 className="h-3 w-3" />
          {company.industry}
        </Badge>
        <Badge variant="outline" className="gap-1 border-border/70 font-normal">
          <MapPin className="h-3 w-3" />
          {company.location}, {company.country}
        </Badge>
        <Badge className={`gap-1 border-0 font-normal ${sizeTone[company.size]}`}>
          <Users className="h-3 w-3" />
          {company.size}
        </Badge>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span>Founded {company.founded}</span>
        <a
          href={`https://${company.website}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary transition-smooth hover:text-primary-glow"
        >
          <Globe className="h-3 w-3" />
          {company.website}
        </a>
      </div>
    </Card>
  );
}
