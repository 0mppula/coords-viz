import { useEffect, useState } from 'react';
import CoordinateChart from './components/CoordinateChart';
import Layout from './components/Layout';
import LocationForm from './components/LocationForm';
import LocationList from './components/LocationList';
import StatsCards from './components/StatsCards';
import { loadLocations, saveLocations } from './services/storage';
import type { GeocodeResult, TravelLocation } from './types/location';
import { computeStats, isDuplicateLocation } from './utils/coordinates';

export default function App() {
	const [locations, setLocations] = useState<TravelLocation[]>(() => loadLocations());
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		saveLocations(locations);
	}, [locations]);

	const handleSelectGeocode = (result: GeocodeResult) => {
		if (isDuplicateLocation(locations, result.latitude, result.longitude)) {
			setFormError(`${result.city} is already on your list.`);
			return;
		}
		setFormError(null);

		const newLocation: TravelLocation = {
			id: crypto.randomUUID(),
			city: result.city,
			country: result.country,
			latitude: result.latitude,
			longitude: result.longitude,
			displayName: result.displayName,
			createdAt: new Date().toISOString(),
		};

		setLocations((prev) => [newLocation, ...prev]);
		setSelectedId(newLocation.id);
	};

	const handleDelete = (id: string) => {
		setLocations((prev) => prev.filter((l) => l.id !== id));
		setSelectedId((current) => (current === id ? null : current));
	};

	const handleSelect = (id: string) => {
		setSelectedId((current) => (current === id ? null : id));
	};

	const stats = computeStats(locations);

	return (
		<Layout
			locationCount={locations.length}
			left={
				<>
					<LocationForm onSelect={handleSelectGeocode} existingError={formError} />
					<LocationList
						locations={locations}
						selectedId={selectedId}
						onSelect={handleSelect}
						onDelete={handleDelete}
					/>
				</>
			}
			right={
				<>
					<StatsCards stats={stats} />
					<CoordinateChart
						locations={locations}
						selectedId={selectedId}
						onSelect={handleSelect}
					/>
				</>
			}
		/>
	);
}
