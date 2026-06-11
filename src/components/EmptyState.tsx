import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, text, action }: Props) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {text && <p className="empty-state__text">{text}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
