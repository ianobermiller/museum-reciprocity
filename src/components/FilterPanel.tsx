import { MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import type { SearchFilters } from "@/types/museum";
import { geocodeCityMultiple, type GeocodingResult } from "@/lib/geocoding";

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  // Initialize cityInput with the current city location if it exists
  const [cityInput, setCityInput] = useState(filters.citySearchLocation?.displayName || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [cityMatches, setCityMatches] = useState<GeocodingResult[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = async (searchText: string) => {
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
        setGeocodingError('No cities found. Try a different name or format.');
        setCityMatches([]);
      } else {
        setCityMatches(results);
        setGeocodingError(null);
      }
    } catch (error) {
      setGeocodingError('Error finding city. Please try again.');
      setCityMatches([]);
    } finally {
      setIsGeocoding(false);
    }
  };

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
  }, [cityInput, filters.citySearchLocation]);

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
    if (e.key === 'Escape') {
      setCityMatches([]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search for a city (e.g., Los Angeles, Seattle)"
            value={cityInput}
            onChange={(e) => handleCityInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
          {isGeocoding && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        {geocodingError && (
          <p className="text-sm text-destructive">{geocodingError}</p>
        )}
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
      {filters.citySearchLocation && (
        <div className="max-w-xs">
          <Select value={String(filters.citySearchRadius)} onValueChange={handleRadiusChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Within 10 miles</SelectItem>
              <SelectItem value="50">Within 50 miles</SelectItem>
              <SelectItem value="100">Within 100 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
