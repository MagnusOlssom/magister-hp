import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'success' | 'warning';
}

export default function StatCard({ label, value, sub, icon, tone = 'default' }: Props) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__body">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
        {sub && <div className="stat-card__sub">{sub}</div>}
      </div>
    </div>
  );
}
