import { companies, type Company } from "@/data/companies";

// Simulates a network request — in real apps, swap for fetch().
export async function fetchCompanies(): Promise<Company[]> {
  await new Promise((r) => setTimeout(r, 600));
  // Uncomment to simulate an error:
  // throw new Error("Failed to load companies");
  return companies;
}
