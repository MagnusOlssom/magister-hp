import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconComment, IconEye } from '../components/icons';
import { useApp } from '../context/AppContext';
import { formatRelative } from '../utils/format';
import { addThread, resolveUser, useSocial } from '../utils/socialStore';

export default function DiscussionAreaPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const { profile } = useApp();
  const social = useSocial();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [composing, setComposing] = useState(false);

  const area = social.areas.find((a) => a.id === areaId);
  if (!area) {
    return (
      <div className="page page--narrow">
        <p>Diskussionsområdet hittades inte.</p>
        <Link to="/social" className="inline-link">
          Tillbaka till Social
        </Link>
      </div>
    );
  }

  const threads = social.threads
    .filter((t) => t.areaId === area.id)
    .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());

  const createThread = () => {
    if (!title.trim() || !body.trim()) return;
    const id = addThread(area.id, title, body);
    navigate(`/social/d/${area.id}/${id}`);
  };

  return (
    <div className="page page--narrow">
      <Link to="/social" className="inline-link back-link">
        <IconArrowLeft size={15} /> Social
      </Link>

      <header className="page-header area-header">
        <span className="area-header__emoji" aria-hidden="true">
          {area.emoji}
        </span>
        <div>
          <h1>{area.name}</h1>
          <p className="page-header__sub">{area.description}</p>
        </div>
      </header>

      {composing ? (
        <section className="card thread-form">
          <input
            type="text"
            className="field__input"
            placeholder="Rubrik"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="composer__input"
            rows={4}
            placeholder="Skriv ditt inlägg…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="thread-form__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setComposing(false)}>
              Avbryt
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={!title.trim() || !body.trim()}
              onClick={createThread}
            >
              Skapa inlägg
            </button>
          </div>
        </section>
      ) : (
        <button type="button" className="btn btn--primary" onClick={() => setComposing(true)}>
          Nytt inlägg
        </button>
      )}

      <div className="thread-list">
        {threads.map((t) => {
          const author = resolveUser(social, t.authorId, profile);
          const last = t.comments[t.comments.length - 1];
          const lastUser = last ? resolveUser(social, last.authorId, profile) : author;
          return (
            <Link key={t.id} to={`/social/d/${area.id}/${t.id}`} className="card thread-row">
              <h3 className="thread-row__title">{t.title}</h3>
              <p className="thread-row__preview">{t.body}</p>
              <div className="thread-row__meta">
                <span className="thread-row__stat">
                  <IconComment size={14} /> {t.comments.length}
                </span>
                <span className="thread-row__stat">
                  <IconEye size={14} /> {t.views}
                </span>
                <span className="thread-row__last">
                  Senast: {lastUser.name} · {formatRelative(t.lastActivityAt)}
                </span>
              </div>
            </Link>
          );
        })}
        {threads.length === 0 && (
          <p className="empty-hint">Inga inlägg än – var först med att starta en diskussion!</p>
        )}
      </div>
    </div>
  );
}
