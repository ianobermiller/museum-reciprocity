import type { SearchFilters } from "@/types/museum";

const STORAGE_KEYS = {
  SEARCH_FILTERS: "museum-finder-search-filters",
} as const;

/**
 * Save search filters to localStorage
 */
export function saveFilters(filters: SearchFilters): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_FILTERS, JSON.stringify(filters));
  } catch (error) {
    console.error("Failed to save filters:", error);
  }
}

/**
 * Load search filters from localStorage
 */
export function loadFilters(): SearchFilters | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_FILTERS);
    if (stored) {
      return JSON.parse(stored) as SearchFilters;
    }
  } catch (error) {
    console.error("Failed to load filters:", error);
  }
  return null;
}

/**
 * Get default search filters
 */
export function getDefaultFilters(): SearchFilters {
  return {
    citySearchLocation: undefined,
    citySearchRadius: 50,
  };
}
