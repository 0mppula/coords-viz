import { useMemo, useRef, useState } from 'react';
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ReferenceLine,
	ResponsiveContainer,
} from 'recharts';
import type { TravelLocation } from '../types/location';
import CoordinateTooltip from './Tooltip';
import './CoordinateChart.css';

interface CoordinateChartProps {
	locations: TravelLocation[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

const AXIS_TICKS = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
const LAT_TICKS = [-90, -60, -30, 0, 30, 60, 90];

const CHART_MARGIN = { top: 24, right: 28, bottom: 26, left: 8 };

interface DotProps {
	cx?: number;
	cy?: number;
	payload?: TravelLocation;
}

function makeDot(selectedId: string | null, onSelect: (id: string) => void) {
	return function CoordinateDot(props: DotProps) {
		const { cx, cy, payload } = props;
		if (cx === undefined || cy === undefined || !payload) return null;
		const isActive = payload.id === selectedId;

		return (
			<g
				style={{ cursor: 'pointer' }}
				onClick={() => onSelect(payload.id)}
				className="coordinate-dot"
			>
				{isActive && (
					<circle cx={cx} cy={cy} r={13} fill="var(--accent-glow)" opacity={0.5}>
						<animate
							attributeName="r"
							values="10;16;10"
							dur="1.6s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							values="0.5;0.15;0.5"
							dur="1.6s"
							repeatCount="indefinite"
						/>
					</circle>
				)}
				<circle
					cx={cx}
					cy={cy}
					r={isActive ? 7 : 5}
					fill={isActive ? 'var(--accent-cyan)' : 'var(--accent-blue)'}
					stroke="rgba(11,11,12,0.9)"
					strokeWidth={1.5}
				/>
			</g>
		);
	};
}

export default function CoordinateChart({ locations, selectedId, onSelect }: CoordinateChartProps) {
	const plotRef = useRef<HTMLDivElement>(null);
	const [cursorReadout, setCursorReadout] = useState<string | null>(null);

	const chartData = useMemo(
		() => locations.map((l) => ({ ...l, longitude: l.longitude, latitude: l.latitude })),
		[locations],
	);

	const DotShape = useMemo(() => makeDot(selectedId, onSelect), [selectedId, onSelect]);

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const container = plotRef.current;
		if (!container) {
			setCursorReadout(null);
			return;
		}

		const rect = container.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const plotWidth = rect.width - CHART_MARGIN.left - CHART_MARGIN.right;
		const plotHeight = rect.height - CHART_MARGIN.top - CHART_MARGIN.bottom;
		if (plotWidth <= 0 || plotHeight <= 0) return;

		const fracX = (x - CHART_MARGIN.left) / plotWidth;
		const fracY = (y - CHART_MARGIN.top) / plotHeight;

		const lng = fracX * 360 - 180;
		const lat = 90 - fracY * 180;

		if (lng < -182 || lng > 182 || lat < -92 || lat > 92) {
			setCursorReadout(null);
			return;
		}

		const clampedLng = Math.max(-180, Math.min(180, lng));
		const clampedLat = Math.max(-90, Math.min(90, lat));

		setCursorReadout(
			`${clampedLat >= 0 ? clampedLat.toFixed(1) + '°N' : (-clampedLat).toFixed(1) + '°S'}  ${
				clampedLng >= 0 ? clampedLng.toFixed(1) + '°E' : (-clampedLng).toFixed(1) + '°W'
			}`,
		);
	};

	return (
		<div className="card chart-card">
			<div className="chart-card__header">
				<div>
					<h2>Coordinate Grid</h2>
				</div>
				<div className="chart-card__readout">{cursorReadout ?? '— · —'}</div>
			</div>

			<div
				className="chart-card__plot"
				ref={plotRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => setCursorReadout(null)}
			>
				<span className="chart-axis-label chart-axis-label--n">N +90°</span>
				<span className="chart-axis-label chart-axis-label--s">S −90°</span>
				<span className="chart-axis-label chart-axis-label--w">W −180°</span>
				<span className="chart-axis-label chart-axis-label--e">E +180°</span>

				{locations.length === 0 && (
					<div className="chart-empty-overlay">
						<div className="chart-empty-overlay__inner">
							<strong>The grid is empty</strong>
							Add a location on the left to plot your first coordinate.
						</div>
					</div>
				)}

				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart margin={CHART_MARGIN}>
						<CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />
						<XAxis
							type="number"
							dataKey="longitude"
							domain={[-180, 180]}
							ticks={AXIS_TICKS}
							stroke="rgba(255,255,255,0.15)"
							tick={{
								fill: '#616168',
								fontSize: 11,
								fontFamily: 'JetBrains Mono, monospace',
							}}
							tickLine={false}
							axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
						/>
						<YAxis
							type="number"
							dataKey="latitude"
							domain={[-90, 90]}
							ticks={LAT_TICKS}
							stroke="rgba(255,255,255,0.15)"
							tick={{
								fill: '#616168',
								fontSize: 11,
								fontFamily: 'JetBrains Mono, monospace',
							}}
							tickLine={false}
							axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
							width={44}
						/>
						<ReferenceLine
							y={0}
							stroke="rgba(34, 211, 238, 0.4)"
							strokeWidth={1.2}
							strokeDasharray="2 4"
						/>
						<ReferenceLine
							x={0}
							stroke="rgba(34, 211, 238, 0.4)"
							strokeWidth={1.2}
							strokeDasharray="2 4"
						/>
						<RechartsTooltip
							content={<CoordinateTooltip />}
							cursor={{ stroke: 'rgba(34,211,238,0.25)', strokeWidth: 1 }}
						/>
						<Scatter
							data={chartData}
							shape={DotShape}
							isAnimationActive
							animationDuration={600}
							animationEasing="ease-out"
						/>
					</ScatterChart>
				</ResponsiveContainer>
			</div>

			<div className="chart-legend">
				<div className="chart-legend__item">
					<span
						className="chart-legend__swatch"
						style={{ background: 'var(--accent-blue)' }}
					/>
					City
				</div>
				<div className="chart-legend__item">
					<span
						className="chart-legend__swatch"
						style={{ background: 'var(--accent-cyan)' }}
					/>
					Selected
				</div>
				<div className="chart-legend__item">
					0° lines mark the equator and prime meridian
				</div>
			</div>
		</div>
	);
}
