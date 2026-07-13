import type { TravelLocation } from '../types/location';

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format a latitude value as a degree string, e.g. 51.51 -> "51.51°N". */
export function formatLatitude(lat: number): string {
  const direction = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lat).toFixed(2)}°${direction}`;
}

/** Format a longitude value as a degree string, e.g. -0.13 -> "0.13°W". */
export function formatLongitude(lng: number): string {
  const direction = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lng).toFixed(2)}°${direction}`;
}

/** Format a raw coordinate pair as a compact monospace-friendly string. */
export function formatCoordinatePair(lat: number, lng: number): string {
  return `${formatLatitude(lat)}  ${formatLongitude(lng)}`;
}

export interface LocationStats {
  total: number;
  countries: number;
  northernmost: TravelLocation | null;
  southernmost: TravelLocation | null;
  easternmost: TravelLocation | null;
  westernmost: TravelLocation | null;
  closestToEquator: TravelLocation | null;
  averageLatitude: number;
  averageLongitude: number;
}

/** Compute summary statistics across a set of saved travel locations. */
export function computeStats(locations: TravelLocation[]): LocationStats {
  if (locations.length === 0) {
    return {
      total: 0,
      countries: 0,
      northernmost: null,
      southernmost: null,
      easternmost: null,
      westernmost: null,
      closestToEquator: null,
      averageLatitude: 0,
      averageLongitude: 0,
    };
  }

  const countries = new Set(locations.map((l) => l.country)).size;

  const northernmost = locations.reduce((a, b) => (b.latitude > a.latitude ? b : a));
  const southernmost = locations.reduce((a, b) => (b.latitude < a.latitude ? b : a));
  const easternmost = locations.reduce((a, b) => (b.longitude > a.longitude ? b : a));
  const westernmost = locations.reduce((a, b) => (b.longitude < a.longitude ? b : a));
  const closestToEquator = locations.reduce((a, b) =>
    Math.abs(b.latitude) < Math.abs(a.latitude) ? b : a
  );

  const averageLatitude =
    locations.reduce((sum, l) => sum + l.latitude, 0) / locations.length;
  const averageLongitude =
    locations.reduce((sum, l) => sum + l.longitude, 0) / locations.length;

  return {
    total: locations.length,
    countries,
    northernmost,
    southernmost,
    easternmost,
    westernmost,
    closestToEquator,
    averageLatitude,
    averageLongitude,
  };
}

/** Basic duplicate check based on rounded coordinates (avoids float precision mismatches). */
export function isDuplicateLocation(
  locations: TravelLocation[],
  latitude: number,
  longitude: number
): boolean {
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return locations.some(
    (l) => round(l.latitude) === round(latitude) && round(l.longitude) === round(longitude)
  );
}
