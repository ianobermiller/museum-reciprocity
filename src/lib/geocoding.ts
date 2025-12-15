/**
 * Geocoding utilities for converting city names to coordinates
 */

export interface GeocodingResult {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

/**
 * Geocode a city name using OpenStreetMap Nominatim API
 * Returns coordinates for the city
 */
export async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
  const results = await geocodeCityMultiple(cityName, 1);
  return results.length > 0 ? results[0]! : null;
}

/**
 * Geocode a city name and return multiple possible matches
 */
export async function geocodeCityMultiple(cityName: string, limit: number = 5): Promise<GeocodingResult[]> {
  try {
    const query = encodeURIComponent(cityName);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Museum Finder App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((result: any) => {
      const address = result.address || {};
      return {
        city: address.city || address.town || address.village || cityName,
        state: address.state,
        country: address.country || 'Unknown',
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
      };
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

/**
 * Search for cities matching a query (for autocomplete)
 */
export async function searchCities(query: string, limit: number = 5): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}&addressdetails=1&featuretype=city`,
      {
        headers: {
          'User-Agent': 'Museum Finder App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('City search request failed');
    }

    const data = await response.json();

    return data
      .filter((result: any) => {
        // Filter for cities, towns, villages
        const type = result.type;
        return type === 'city' || type === 'town' || type === 'village' ||
               result.addresstype === 'city' || result.addresstype === 'town';
      })
      .map((result: any) => {
        const address = result.address || {};
        return {
          city: address.city || address.town || address.village || query,
          state: address.state,
          country: address.country || 'Unknown',
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name,
        };
      });
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
}

