import { MapPin, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchFilters } from "@/types/museum";
import { geocodeCityMultiple, type GeocodingResult } from "@/lib/geocoding";

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  // Initialize cityInput with the current city location if it exists
  const [cityInput, setCityInput] = useState(filters.citySearchLocation?.displayName || "");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [cityMatches, setCityMatches] = useState<GeocodingResult[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search function
  const performSearch = useCallback(
    async (searchText: string) => {
      if (!searchText.trim() || searchText.length < 2) {
        setCityMatches([]);
        setGeocodingError(null);
        return;
      }

      setIsGeocoding(true);
      setGeocodingError(null);

      try {
        const results = await geocodeCityMultiple(searchText, 5);

        if (results.length === 0) {
          setGeocodingError("No cities found. Try a different name or format.");
          setCityMatches([]);
        } else if (results.length === 1) {
          // Auto-select when there's only one match
          const result = results[0];
          if (result) {
            onFiltersChange({
              ...filters,
              citySearchLocation: result,
            });
            setCityInput(result.displayName);
            setCityMatches([]);
            setGeocodingError(null);
          }
        } else {
          setCityMatches(results);
          setGeocodingError(null);
        }
      } catch {
        setGeocodingError("Error finding city. Please try again.");
        setCityMatches([]);
      } finally {
        setIsGeocoding(false);
      }
    },
    [filters, onFiltersChange]
  );

  // Effect to trigger search when user types
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if input matches the current selection
    if (filters.citySearchLocation && cityInput === filters.citySearchLocation.displayName) {
      return;
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(cityInput);
    }, 400); // Wait 400ms after user stops typing

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cityInput, filters.citySearchLocation, performSearch]);

  const handleSelectCity = (result: GeocodingResult) => {
    onFiltersChange({
      ...filters,
      citySearchLocation: result,
    });
    setCityInput(result.displayName);
    setCityMatches([]);
    setGeocodingError(null);
  };

  const handleCityInputChange = (value: string) => {
    setCityInput(value);
    // Clear the location when user starts editing
    if (filters.citySearchLocation && value !== filters.citySearchLocation.displayName) {
      onFiltersChange({
        ...filters,
        citySearchLocation: undefined,
      });
    }
  };

  const handleRadiusChange = (value: string) => {
    onFiltersChange({ ...filters, citySearchRadius: parseInt(value) as 10 | 50 | 100 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow user to navigate the dropdown with arrow keys
    if (e.key === "Escape") {
      setCityMatches([]);
    }
  };

  const handleClearInput = () => {
    setCityInput("");
    setCityMatches([]);
    setGeocodingError(null);
    if (filters.citySearchLocation) {
      onFiltersChange({
        ...filters,
        citySearchLocation: undefined,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search for a city (e.g., Los Angeles, Seattle)"
              value={cityInput}
              onChange={(e) => handleCityInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
            />
            {isGeocoding ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : cityInput ? (
              <button
                onClick={handleClearInput}
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                title="Clear search"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          {filters.citySearchLocation && (
            <div className="w-24">
              <Select value={String(filters.citySearchRadius)} onValueChange={handleRadiusChange}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">&lt; 10 mi</SelectItem>
                  <SelectItem value="50">&lt; 50 mi</SelectItem>
                  <SelectItem value="100">&lt; 100 mi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {geocodingError && <p className="text-sm text-destructive">{geocodingError}</p>}
        {cityMatches.length > 0 && (
          <Command className="border rounded-md shadow-md">
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup heading="Select a city">
                {cityMatches.map((result, index) => (
                  <CommandItem
                    key={index}
                    value={result.displayName}
                    onSelect={() => handleSelectCity(result)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.city}</span>
                      <span className="text-sm text-muted-foreground">{result.displayName}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
