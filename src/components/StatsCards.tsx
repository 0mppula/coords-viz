import type { LocationStats } from '../utils/coordinates';
import { formatLatitude, formatLongitude } from '../utils/coordinates';
import './StatsCards.css';

interface StatsCardsProps {
	stats: LocationStats;
}

interface StatDef {
	label: string;
	value: string;
	sub?: string;
	accent?: boolean;
}

function renderCard(card: StatDef) {
	return (
		<div className="card stat-card" key={card.label}>
			<span className="stat-card__label">{card.label}</span>
			<span className={`stat-card__value ${card.accent ? 'stat-card__value--accent' : ''}`}>
				{card.value}
			</span>
			{card.sub && <span className="stat-card__sub">{card.sub}</span>}
		</div>
	);
}

export default function StatsCards({ stats }: StatsCardsProps) {
	const empty = stats.total === 0;

	const overviewCards: StatDef[] = [
		{
			label: 'Total cities',
			value: String(stats.total),
			accent: true,
		},
		{
			label: 'Countries',
			value: String(stats.countries),
			accent: true,
		},
	];

	const extremeCards: StatDef[] = [
		{
			label: 'Northernmost',
			value: empty ? '—' : stats.northernmost!.city,
			sub: empty ? undefined : formatLatitude(stats.northernmost!.latitude),
		},
		{
			label: 'Southernmost',
			value: empty ? '—' : stats.southernmost!.city,
			sub: empty ? undefined : formatLatitude(stats.southernmost!.latitude),
		},
		{
			label: 'Easternmost',
			value: empty ? '—' : stats.easternmost!.city,
			sub: empty ? undefined : formatLongitude(stats.easternmost!.longitude),
		},
		{
			label: 'Westernmost',
			value: empty ? '—' : stats.westernmost!.city,
			sub: empty ? undefined : formatLongitude(stats.westernmost!.longitude),
		},
		{
			label: 'Closest to equator',
			value: empty ? '—' : stats.closestToEquator!.city,
			sub: empty ? undefined : formatLatitude(stats.closestToEquator!.latitude),
		},
	];

	return (
		<div className="stats-groups">
			<div className="stats-grid stats-grid--overview">{overviewCards.map(renderCard)}</div>
			<div className="stats-grid stats-grid--extremes">{extremeCards.map(renderCard)}</div>
		</div>
	);
}
