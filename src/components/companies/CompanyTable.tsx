import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/data/companies";

export function CompanyTable({ companies }: { companies: Company[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-display text-foreground">Company</TableHead>
            <TableHead className="font-display text-foreground">Industry</TableHead>
            <TableHead className="font-display text-foreground">Location</TableHead>
            <TableHead className="font-display text-foreground">Size</TableHead>
            <TableHead className="font-display text-foreground">Founded</TableHead>
            <TableHead className="text-right font-display text-foreground">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((c) => (
            <TableRow key={c.id} className="transition-smooth hover:bg-accent/40">
              <TableCell>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.website}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">{c.industry}</Badge>
              </TableCell>
              <TableCell>
                {c.location}
                <span className="text-muted-foreground">, {c.country}</span>
              </TableCell>
              <TableCell>{c.size}</TableCell>
              <TableCell>{c.founded}</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {c.rating}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
