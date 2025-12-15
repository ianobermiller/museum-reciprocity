import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MuseumSearch } from "@/components/MuseumSearch";
import { loadFilters, saveFilters, getDefaultFilters } from "@/lib/storage";
import type { Museum, SearchFilters } from "@/types/museum";
import astcData from "@/data/astc-museums.json";
import azaData from "@/data/aza-institutions.json";
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
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Museum Finder</h1>
                <p className="text-xs text-muted-foreground">
                  {astcCount} ASTC Museums • {azaCount} AZA Institutions
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
    </div>
  );
}

export default App;
