import type { GeocodeResult } from '../types/location';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
  type: string;
  class: string;
  importance?: number;
}

function extractCity(address: NominatimAddress | undefined, fallback: string): string {
  if (!address) return fallback;
  return (
    address.city ??
    address.town ??
    address.village ??
    address.hamlet ??
    address.municipality ??
    address.county ??
    fallback
  );
}

/**
 * Geocode a free-text location query using OpenStreetMap's Nominatim API.
 * No API key required. Returns up to `limit` candidate matches.
 */
export async function geocodeLocation(
  query: string,
  limit = 5
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a location.');
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(limit),
  });

  let response: Response;
  try {
    response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new Error('Network error while looking up that location. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new Error(`Geocoding service responded with an error (${response.status}).`);
  }

  const data = (await response.json()) as NominatimResult[];

  if (!data || data.length === 0) {
    throw new Error(`No results found for "${trimmed}". Try a different spelling.`);
  }

  return data.map((result) => {
    const cityGuess = extractCity(result.address, trimmed);
    const countryGuess = result.address?.country ?? 'Unknown';
    return {
      city: cityGuess,
      country: countryGuess,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
    };
  });
}
