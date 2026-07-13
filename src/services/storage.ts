import type { TravelLocation } from '../types/location';

const STORAGE_KEY = 'travel-coords:locations';

/** Read all saved locations from localStorage. Returns an empty array on any failure. */
export function loadLocations(): TravelLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TravelLocation[];
  } catch {
    return [];
  }
}

/** Persist the full list of locations to localStorage. */
export function saveLocations(locations: TravelLocation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch {
    // Storage may be unavailable (private mode, quota exceeded, etc). Fail silently.
  }
}
