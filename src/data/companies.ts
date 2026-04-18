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

export const companies: Company[] = [
  { id: 1, name: "Northwind Labs", industry: "Technology", location: "San Francisco", country: "USA", size: "Medium", founded: 2014, website: "northwind.io", description: "Cloud infrastructure for modern teams.", rating: 4.6 },
  { id: 2, name: "Aurora Health", industry: "Healthcare", location: "Boston", country: "USA", size: "Large", founded: 2008, website: "aurorahealth.com", description: "AI-driven diagnostics & patient care.", rating: 4.4 },
  { id: 3, name: "Maison Vert", industry: "Retail", location: "Paris", country: "France", size: "Small", founded: 2018, website: "maisonvert.fr", description: "Sustainable fashion & lifestyle goods.", rating: 4.7 },
  { id: 4, name: "Kaizen Robotics", industry: "Manufacturing", location: "Tokyo", country: "Japan", size: "Enterprise", founded: 1997, website: "kaizen-robotics.jp", description: "Industrial automation at planetary scale.", rating: 4.8 },
  { id: 5, name: "Helix Finance", industry: "Finance", location: "London", country: "UK", size: "Large", founded: 2011, website: "helixfin.uk", description: "Digital banking for the new economy.", rating: 4.2 },
  { id: 6, name: "Solstice Energy", industry: "Energy", location: "Berlin", country: "Germany", size: "Medium", founded: 2016, website: "solstice.de", description: "Solar microgrids for cities & communities.", rating: 4.5 },
  { id: 7, name: "Pixel Forge", industry: "Technology", location: "Austin", country: "USA", size: "Startup", founded: 2022, website: "pixelforge.dev", description: "Indie game studio building cult classics.", rating: 4.9 },
  { id: 8, name: "Olive & Oak", industry: "Food & Beverage", location: "Barcelona", country: "Spain", size: "Small", founded: 2019, website: "oliveoak.es", description: "Mediterranean kitchen, delivered.", rating: 4.3 },
  { id: 9, name: "Coral Reef Studios", industry: "Media", location: "Sydney", country: "Australia", size: "Medium", founded: 2013, website: "coralreef.tv", description: "Documentary filmmaking & post production.", rating: 4.6 },
  { id: 10, name: "Vanguard Aerospace", industry: "Aerospace", location: "Seattle", country: "USA", size: "Enterprise", founded: 1986, website: "vanguardaero.com", description: "Next-generation propulsion systems.", rating: 4.7 },
  { id: 11, name: "Lumen Education", industry: "Education", location: "Toronto", country: "Canada", size: "Medium", founded: 2015, website: "lumen.edu", description: "Adaptive learning for K-12 schools.", rating: 4.4 },
  { id: 12, name: "Tidewater Logistics", industry: "Logistics", location: "Rotterdam", country: "Netherlands", size: "Large", founded: 2002, website: "tidewater.nl", description: "Smart freight across the North Sea.", rating: 4.1 },
  { id: 13, name: "Saffron Studio", industry: "Media", location: "Mumbai", country: "India", size: "Small", founded: 2020, website: "saffron.studio", description: "Brand & motion design collective.", rating: 4.8 },
  { id: 14, name: "Glacier Biotech", industry: "Healthcare", location: "Zurich", country: "Switzerland", size: "Medium", founded: 2010, website: "glacierbio.ch", description: "Precision medicine, cold chain delivered.", rating: 4.5 },
  { id: 15, name: "Foundry & Co", industry: "Manufacturing", location: "Detroit", country: "USA", size: "Large", founded: 1962, website: "foundryco.com", description: "Heritage metalwork meets digital twin tech.", rating: 4.0 },
  { id: 16, name: "Nimbus Cloud", industry: "Technology", location: "Dublin", country: "Ireland", size: "Startup", founded: 2023, website: "nimbus.cloud", description: "Edge compute for real-time apps.", rating: 4.7 },
  { id: 17, name: "Casa Lima", industry: "Hospitality", location: "Lima", country: "Peru", size: "Small", founded: 2017, website: "casalima.pe", description: "Boutique hotels along the Pacific coast.", rating: 4.6 },
  { id: 18, name: "Quantum Edge", industry: "Finance", location: "Singapore", country: "Singapore", size: "Medium", founded: 2014, website: "quantumedge.sg", description: "Algorithmic trading & risk modeling.", rating: 4.3 },
  { id: 19, name: "Terra Verde", industry: "Energy", location: "São Paulo", country: "Brazil", size: "Large", founded: 2005, website: "terraverde.br", description: "Wind & hydro across South America.", rating: 4.4 },
  { id: 20, name: "Arctic Outfitters", industry: "Retail", location: "Oslo", country: "Norway", size: "Medium", founded: 2009, website: "arcticout.no", description: "Performance gear engineered for extremes.", rating: 4.7 },
];

export const industries = Array.from(new Set(companies.map((c) => c.industry))).sort();
export const countries = Array.from(new Set(companies.map((c) => c.country))).sort();
export const sizes: Company["size"][] = ["Startup", "Small", "Medium", "Large", "Enterprise"];
