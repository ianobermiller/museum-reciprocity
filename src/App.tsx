import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MuseumSearch } from "@/components/MuseumSearch";
import { loadFilters, saveFilters, getDefaultFilters } from "@/lib/storage";
import type { Museum, SearchFilters } from "@/types/museum";
import astcData from "@/data/astc-museums.json";
import azaData from "@/data/aza-institutions.json";
import logoSvg from "./favicon.svg";
import "./index.css";

export function App() {
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Load filters on initial mount
    const savedFilters = loadFilters();
    return savedFilters || getDefaultFilters();
  });
  const [allMuseums] = useState<Museum[]>(() => {
    // Combine both datasets and add type property
    const astc = (astcData as Museum[]).map((m) => ({ ...m, type: "astc" as const }));
    const aza = (azaData as Museum[]).map((m) => ({ ...m, type: "aza" as const }));
    return [...astc, ...aza];
  });

  // Save filters when they change
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  const astcCount = allMuseums.filter((m) => m.type === "astc").length;
  const azaCount = allMuseums.filter((m) => m.type === "aza").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <img src={logoSvg} alt="Museum" className="h-6 w-6 mt-0.5" />
              <div>
                <h1 className="text-xl font-bold">Museum Reciprocity</h1>
                <p className="text-xs text-muted-foreground">
                  {astcCount} ASTC • {azaCount} AZA
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <MuseumSearch museums={allMuseums} filters={filters} onFiltersChange={setFilters} />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <a
              href="https://github.com/ianobermiller/museum-reciprocity"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
