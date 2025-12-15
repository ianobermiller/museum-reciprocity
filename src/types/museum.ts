export interface Museum {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  website: string;
  admittancePolicy: string;
  proofOfResidenceRequired: boolean;
  latitude: number;
  longitude: number;
  discountType: 'free' | '50-percent' | 'distance-based' | 'varies';
  specialNotes: string;
  distance?: number; // Calculated distance from user's location
  type?: 'astc' | 'aza'; // Museum type
}

export interface UserMembership {
  homeMuseumId: string;
  homeMuseumName: string;
  homeAddress: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  homeLatitude?: number;
  homeLongitude?: number;
}

export interface CitySearchLocation {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export interface SearchFilters {
  citySearchLocation?: CitySearchLocation;
  citySearchRadius: 10 | 50 | 100; // miles
}

export interface AppState {
  museums: Museum[];
  filteredMuseums: Museum[];
  filters: SearchFilters;
  userMembership: UserMembership | null;
  showSettings: boolean;
}

export type MuseumType = 'astc' | 'aza';

