import type { TravelLocation } from '../types/location';
import { formatLatitude, formatLongitude } from '../utils/coordinates';
import './LocationList.css';

interface LocationListProps {
  locations: TravelLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LocationList({
  locations,
  selectedId,
  onSelect,
  onDelete,
}: LocationListProps) {
  return (
    <div className="card list-card">
      <div className="list-card__header">
        <h2>Saved locations</h2>
        <span className="list-card__count">{locations.length}</span>
      </div>

      {locations.length === 0 ? (
        <div className="list-empty">
          <strong>No cities yet</strong>
          Add your first location above to see it plotted on the grid.
        </div>
      ) : (
        <div className="list-card__scroll">
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              className={`list-row ${location.id === selectedId ? 'list-row--active' : ''}`}
              onClick={() => onSelect(location.id)}
              title={location.displayName}
            >
              <div className="list-row__main">
                <div className="list-row__city">{location.city}</div>
                <div className="list-row__country">{location.country}</div>
              </div>
              <div className="list-row__coords">
                {formatLatitude(location.latitude)} {formatLongitude(location.longitude)}
              </div>
              <span
                className="list-row__delete"
                role="button"
                aria-label={`Delete ${location.city}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(location.id);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
