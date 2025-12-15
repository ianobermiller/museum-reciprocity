/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * Returns distance in miles "as the crow flies"
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a museum is within the 90-mile exclusion zone
 */
export function isWithinExclusionZone(
  museumLat: number,
  museumLon: number,
  userLat: number,
  userLon: number
): boolean {
  const distance = calculateDistance(museumLat, museumLon, userLat, userLon);
  return distance <= 90;
}

/**
 * Parse guest count from admittance policy text
 * Returns approximate number of guests allowed
 */
export function parseGuestCount(admittancePolicy: string): number {
  const lowerPolicy = admittancePolicy.toLowerCase();

  // Look for patterns like "two adults and four children"
  const adultMatch = lowerPolicy.match(/(\w+)\s+adult/);
  const childMatch = lowerPolicy.match(/(\w+)\s+child/);
  const peopleMatch = lowerPolicy.match(/(\w+)\s+people/);
  const upToMatch = lowerPolicy.match(/up to (\w+)/);
  const maxMatch = lowerPolicy.match(/maximum of (\w+)/);

  const numberWords: { [key: string]: number } = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10,
  };

  if (lowerPolicy.includes('unlimited')) {
    return 999;
  }

  if (maxMatch && numberWords[maxMatch[1]]) {
    return numberWords[maxMatch[1]];
  }

  if (upToMatch && numberWords[upToMatch[1]]) {
    return numberWords[upToMatch[1]];
  }

  if (peopleMatch && numberWords[peopleMatch[1]]) {
    return numberWords[peopleMatch[1]];
  }

  let total = 0;
  if (adultMatch && numberWords[adultMatch[1]]) {
    total += numberWords[adultMatch[1]];
  }
  if (childMatch && numberWords[childMatch[1]]) {
    total += numberWords[childMatch[1]];
  }

  return total || 0;
}

