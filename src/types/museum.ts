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
  discountType: "free" | "50-percent" | "distance-based" | "varies";
  specialNotes: string;
  distance?: number; // Calculated distance from user's location
  type?: "astc" | "aza"; // Museum type
}

export interface SearchFilters {
  citySearchLocation?: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
    displayName: string;
  };
  citySearchRadius: 10 | 50 | 100; // miles
}
