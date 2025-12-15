import { useState, useMemo } from "react";
import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MuseumCard } from "./MuseumCard";
import { MapView } from "./MapView";
import { FilterPanel } from "./FilterPanel";
import type { Museum, SearchFilters } from "@/types/museum";
import { calculateDistance } from "@/lib/distance";

interface MuseumSearchProps {
  museums: Museum[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function MuseumSearch({ museums, filters, onFiltersChange }: MuseumSearchProps) {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredAndSortedMuseums = useMemo(() => {
    let result = [...museums];

    // Calculate distances and filter by city search
    const cityLocation = filters.citySearchLocation;
    if (cityLocation) {
      result = result.map((museum) => ({
        ...museum,
        distance: calculateDistance(
          cityLocation.latitude,
          cityLocation.longitude,
          museum.latitude,
          museum.longitude
        ),
      }));

      // Filter by radius
      result = result.filter(
        (museum) => museum.distance !== undefined && museum.distance <= filters.citySearchRadius
      );

      // Sort by distance
      result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
      // No city selected - show all museums sorted by name
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [museums, filters]);

  return (
    <div className="space-y-6">
      <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            {filters.citySearchLocation ? (
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedMuseums.length} museums within {filters.citySearchRadius}{" "}
                miles of {filters.citySearchLocation.city}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Showing all {filteredAndSortedMuseums.length} museums
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              title="Map view"
            >
              <Map className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {filteredAndSortedMuseums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No museums found in this area.</p>
            <p className="text-sm text-muted-foreground mt-2">Try increasing the search radius.</p>
          </div>
        ) : viewMode === "map" ? (
          <MapView museums={filteredAndSortedMuseums} showDistance={true} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedMuseums.map((museum) => (
              <MuseumCard key={`${museum.type}-${museum.id}`} museum={museum} showDistance={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
