export interface TravelLocation {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
  createdAt: string;
}

export interface GeocodeResult {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export interface GeocodeError {
  message: string;
}
