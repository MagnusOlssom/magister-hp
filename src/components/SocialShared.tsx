import { useState } from 'react';
import { FACULTY_MAP } from '../data/faculties';
import type { SocialUser } from '../types';
import { formatRelative } from '../utils/format';
import Avatar from './Avatar';

export function AuthorLine({
  user,
  time,
  size = 40,
}: {
  user: SocialUser;
  time: string;
  size?: number;
}) {
  const fac = user.faculty ? FACULTY_MAP[user.faculty] : null;
  return (
    <div className="author-line">
      <Avatar name={user.name} src={user.avatar} size={size} />
      <div className="author-line__meta">
        <span className="author-line__name">
          {user.name}
          {fac && (
            <span className="author-line__faculty" style={{ color: fac.color }}>
              {' '}
              · {fac.shortName} {fac.emoji}
            </span>
          )}
        </span>
        <span className="author-line__time">{formatRelative(time)}</span>
      </div>
    </div>
  );
}

export function Composer({
  placeholder,
  onSubmit,
  buttonLabel = 'Publicera',
  rows = 2,
}: {
  placeholder: string;
  onSubmit: (text: string) => void;
  buttonLabel?: string;
  rows?: number;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };
  return (
    <div className="composer">
      <textarea
        className="composer__input"
        rows={rows}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="composer__actions">
        <button type="button" className="btn btn--primary btn--sm" disabled={!text.trim()} onClick={submit}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
