import type { TravelLocation } from '../types/location';
import { formatLatitude, formatLongitude } from '../utils/coordinates';

interface TooltipPayloadItem {
  payload: TravelLocation;
}

interface CoordinateTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

export default function CoordinateTooltip({ active, payload }: CoordinateTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const location = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__city">{location.city}</div>
      <div className="chart-tooltip__country">{location.country}</div>
      <div className="chart-tooltip__coords">
        {formatLatitude(location.latitude)} &nbsp; {formatLongitude(location.longitude)}
      </div>
    </div>
  );
}
