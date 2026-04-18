# Frontend Developer Test - Companies Directory

A production-ready React application showcasing a curated directory of companies with filtering, sorting, and view switching capabilities. Built with modern web technologies and best practices.

## Overview

This project demonstrates a complete frontend solution for browsing and exploring company information. Users can filter companies by industry, country, and company size, sort by various criteria, and switch between grid and table views. The application features a modern, elegant design with smooth animations and responsive layouts.

## Tech Stack

### Core Technologies

- **Framework**: TanStack Start (React-based full-stack framework)
- **Language**: TypeScript (strictly typed)
- **UI Library**: React 19 with hooks
- **Package Manager**: Bun (fast JavaScript runtime and package manager)

### Styling & UI

- **CSS Framework**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui (accessible, composable components)
- **Icons**: Lucide React
- **Animations**: tw-animate-css, custom CSS transitions

### Build & Development

- **Build Tool**: Vite 7 (fast build and HMR)
- **Code Quality**: ESLint, Prettier
- **Deployment**: Vercel (SPA mode with client-side routing)

## Features

### Company Directory

- **Comprehensive Company Listings**: Display companies with name, description, industry, location, rating, founding year, employee count, and website
- **Detailed Company Cards**: Visually appealing cards with company logo placeholder, key metrics, and action buttons
- **Data Table View**: Alternative table layout for comparing multiple companies at once

### Filtering System

- **Multi-criteria Filtering**: Filter by industry, country, and company size simultaneously
- **Real-time Search**: Search across company name, description, website, and location
- **Filter Reset**: One-click reset to clear all filters
- **Result Count**: Live update of matching companies count

### Sorting Options

- **Name Sorting**: Alphabetical A-Z and Z-A sorting
- **Rating Sorting**: Top-rated companies first
- **Founding Year Sorting**: Newest or oldest companies first

### Pagination

- **Page Navigation**: Previous/next buttons and direct page selection
- **Adaptive Pages**: Automatically adjusts based on filtered results
- **Page Indicators**: Shows current page and total pages

### User Experience

- **Loading States**: Skeleton loaders during data fetch
- **Error Handling**: User-friendly error messages with retry option
- **Empty States**: Helpful messages when no results match filters
- **Responsive Design**: Fully responsive across all device sizes

## Project Structure

```
frontend-dev-test/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   └── ... (40+ more UI components)
│   │   └── companies/          # Business logic components
│   │       ├── CompanyCard.tsx
│   │       ├── CompanyTable.tsx
│   │       └── CompanyFilters.tsx
│   ├── data/
│   │   └── companies.ts        # Static company data
│   ├── hooks/
│   │   └── use-mobile.tsx      # Custom hook for mobile detection
│   ├── lib/
│   │   ├── utils.ts            # Utility functions (cn helper)
│   │   └── companies-api.ts    # API functions for fetching companies
│   ├── routes/
│   │   ├── __root.tsx          # Root route with layout
│   │   └── index.tsx           # Main index page
│   ├── styles.css              # Global styles and design system
│   ├── router.tsx              # Router configuration
│   ├── client.tsx              # Client-side entry point
│   └── routeTree.gen.ts        # Generated route tree
├── scripts/
│   └── postbuild-spa.mjs       # SPA post-build script
├── public/
│   └── favicon.ico             # Site favicon
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
├── eslint.config.js            # ESLint configuration
├── prettierrc                  # Prettier configuration
└── tailwind.config.js          # Tailwind CSS configuration (if needed)
```

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Bun**: Visit https://bun.sh for installation instructions
- **Node.js**: Version 18+ (if not using Bun)

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/sparrow-003/frontend-dev-test.git

# Navigate to project directory
cd frontend-dev-test

# Install dependencies with Bun
bun install
```

### Development

Start the development server:

```bash
# Start development server
bun run dev
```

The application will be available at `http://localhost:5173` (or similar port).

### Building for Production

Create a production build:

```bash
# Build for production
bun run build
```

The built files will be in the `dist/client` directory.

### Preview Production Build

Test the production build locally:

```bash
# Preview production build
bun run preview
```

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. The `vercel.json` file handles:

- **Build Command**: `bun run build`
- **Output Directory**: `dist/client`
- **Install Command**: `bun install`
- **SPA Routing**: All routes are rewritten to index.html for client-side routing

To deploy:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect the configuration and deploy

### Manual Deployment

To deploy to any static hosting provider:

1. Run `bun run build`
2. Upload the contents of `dist/client` to your hosting provider
3. Configure your server to serve `index.html` for all routes (SPA mode)

## Design System

### Color Palette

The application uses a warm, editorial color palette:

- **Background**: Ivory white (#fdfcfb)
- **Foreground**: Deep ink (#2d2926)
- **Primary**: Vivid coral (#d4726a)
- **Secondary**: Soft cream (#f2ede6)
- **Muted**: Warm gray (#9a9590)
- **Accent**: Light coral (#f5e6e3)

### Typography

- **Display Font**: Fraunces (serif) - for headings
- **Body Font**: Inter (sans-serif) - for body text

### Components

All UI components are built with accessibility in mind:

- Keyboard navigation support
- Screen reader friendly
- ARIA labels where appropriate
- Focus management
- High contrast ratios

## API Reference

### Data Functions

#### fetchCompanies()

Retrieves the list of all companies.

```typescript
import { fetchCompanies } from "@/lib/companies-api";

const companies = await fetchCompanies();
// Returns: Company[]
```

#### Company Type

```typescript
interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  country: string;
  location: string;
  founded: number;
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  rating: number;
  website: string;
  logo?: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **shadcn/ui** for the beautiful component library
- **TanStack** for the excellent routing and query solutions
- **Tailwind Labs** for the amazing CSS framework
- **Lovable** for the project template and configuration

## Support

If you encounter any issues or have questions:

1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## Version History

- **1.0.0** - Initial release with company directory features
- Filter and sort capabilities
- Grid and table views
- Responsive design
- Production deployment configuration

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
