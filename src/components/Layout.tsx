import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  left: ReactNode;
  right: ReactNode;
  locationCount: number;
}

export default function Layout({ left, right, locationCount }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand">
          <div className="layout__mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.4" opacity="0.9" />
              <path d="M3 12H21" stroke="white" strokeWidth="1.2" opacity="0.7" />
              <path d="M12 3V21" stroke="white" strokeWidth="1.2" opacity="0.7" />
              <circle cx="12" cy="12" r="1.6" fill="white" />
            </svg>
          </div>
          <div className="layout__titles">
            <h1>Coordinates</h1>
            <p>lat / lng travel log</p>
          </div>
        </div>
        <div className="layout__meta">
          <span className="layout__meta-dot" />
          <span>
            {locationCount} location{locationCount === 1 ? '' : 's'} tracked
          </span>
        </div>
      </header>
      <div className="layout__body">
        <div className="layout__left">{left}</div>
        <div className="layout__right">{right}</div>
      </div>
    </div>
  );
}
