import { useState, type FormEvent } from 'react';
import { geocodeLocation } from '../services/geocoder';
import type { GeocodeResult } from '../types/location';
import './LocationForm.css';

interface LocationFormProps {
	onSelect: (result: GeocodeResult) => void;
	existingError?: string | null;
}

export default function LocationForm({ onSelect, existingError }: LocationFormProps) {
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [matches, setMatches] = useState<GeocodeResult[]>([]);

	const runSearch = async (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) {
			setError('Enter a city or place name.');
			return;
		}

		setLoading(true);
		setError(null);
		setMatches([]);

		try {
			const results = await geocodeLocation(trimmed);
			if (results.length === 1) {
				onSelect(results[0]);
				setQuery('');
			} else {
				setMatches(results);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong looking that up.');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		void runSearch(query);
	};

	const handlePickMatch = (result: GeocodeResult) => {
		onSelect(result);
		setQuery('');
		setMatches([]);
	};

	const displayedError = error ?? existingError;

	return (
		<div className="card form-card">
			<div className="form-card__header">
				<h2>Add a location</h2>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="form-field">
					<div className="form-field__input-row">
						<input
							type="text"
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								if (error) setError(null);
							}}
							placeholder="Helsinki"
							disabled={loading}
							autoComplete="off"
							aria-label="Location name"
						/>
						<button type="submit" className="btn-primary" disabled={loading}>
							{loading ? (
								<>
									<span className="spinner" aria-hidden="true" />
									Locating
								</>
							) : (
								'Add'
							)}
						</button>
					</div>
				</div>
			</form>

			{displayedError && <div className="form-error">{displayedError}</div>}

			{matches.length > 0 && (
				<div className="match-dropdown">
					<div className="match-dropdown__label">
						{matches.length} matches — choose one
					</div>
					{matches.map((match, i) => (
						<button
							key={`${match.latitude}-${match.longitude}-${i}`}
							type="button"
							className="match-dropdown__item"
							onClick={() => handlePickMatch(match)}
						>
							<span>{match.displayName}</span>
							<span className="match-dropdown__item-sub">
								{match.latitude.toFixed(3)}, {match.longitude.toFixed(3)}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
