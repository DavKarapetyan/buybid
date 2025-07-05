export interface CityTransportOptions {
  fromCity: string;
  toCity: string;
  pricePerKm?: number;
  baseFee?: number;
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}&accept-language=en`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (your@email.com)",
        },
      }
    );

    if (!response.ok) {
      console.error("Nominatim error:", response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      console.warn("City not found:" + city);
      return null;
    }

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}


function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function calculateTransportCostFromCities({
  fromCity,
  toCity,
  pricePerKm = 120,
  baseFee = 1000,
}: CityTransportOptions): Promise<{ distanceKm: number; cost: number } | null> {
  const [fromCoords, toCoords] = await Promise.all([
    geocodeCity(fromCity),
    geocodeCity(toCity),
  ]);

  if (!fromCoords || !toCoords) return null;

  const distance = haversineDistance(
    fromCoords.lat,
    fromCoords.lon,
    toCoords.lat,
    toCoords.lon
  );

  const cost = baseFee + distance * pricePerKm;

  return {
    distanceKm: parseFloat(distance.toFixed(2)),
    cost: parseInt(cost.toFixed(0)),
  };
}
