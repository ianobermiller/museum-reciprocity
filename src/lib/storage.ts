import type { UserMembership, SearchFilters } from "@/types/museum";

const STORAGE_KEYS = {
  USER_MEMBERSHIP: "museum-finder-user-membership",
  SEARCH_FILTERS: "museum-finder-search-filters",
} as const;

/**
 * Save user membership to localStorage
 */
export function saveMembership(membership: UserMembership | null): void {
  try {
    if (membership) {
      localStorage.setItem(STORAGE_KEYS.USER_MEMBERSHIP, JSON.stringify(membership));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_MEMBERSHIP);
    }
  } catch (error) {
    console.error("Failed to save membership:", error);
  }
}

/**
 * Load user membership from localStorage
 */
export function loadMembership(): UserMembership | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_MEMBERSHIP);
    if (stored) {
      return JSON.parse(stored) as UserMembership;
    }
  } catch (error) {
    console.error("Failed to load membership:", error);
  }
  return null;
}

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
