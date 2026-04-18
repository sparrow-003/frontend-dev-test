import { companies, type Company } from "@/data/companies";

// Returns the local company dataset synchronously-fast (no artificial delay).
export async function fetchCompanies(): Promise<Company[]> {
  return companies;
}
