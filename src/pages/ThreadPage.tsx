import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthorLine, Composer } from '../components/SocialShared';
import { IconArrowLeft, IconEye } from '../components/icons';
import { useApp } from '../context/AppContext';
import { addThreadComment, markThreadViewed, resolveUser, useSocial } from '../utils/socialStore';

export default function ThreadPage() {
  const { areaId, threadId } = useParams();
  const { profile } = useApp();
  const social = useSocial();

  useEffect(() => {
    if (threadId) markThreadViewed(threadId);
  }, [threadId]);

  const area = social.areas.find((a) => a.id === areaId);
  const thread = social.threads.find((t) => t.id === threadId);

  if (!thread || !area) {
    return (
      <div className="page page--narrow">
        <p>Inlägget hittades inte.</p>
        <Link to="/social" className="inline-link">
          Tillbaka till Social
        </Link>
      </div>
    );
  }

  const author = resolveUser(social, thread.authorId, profile);

  return (
    <div className="page page--narrow">
      <Link to={`/social/d/${area.id}`} className="inline-link back-link">
        <IconArrowLeft size={15} /> {area.emoji} {area.name}
      </Link>

      <article className="card thread-detail">
        <h1 className="thread-detail__title">{thread.title}</h1>
        <div className="thread-detail__head">
          <AuthorLine user={author} time={thread.createdAt} />
          <span className="thread-detail__views">
            <IconEye size={14} /> {thread.views}
          </span>
        </div>
        <p className="thread-detail__body">{thread.body}</p>
      </article>

      <h2 className="section-title">{thread.comments.length} svar</h2>

      <div className="comment-thread">
        {thread.comments.map((c) => {
          const cu = resolveUser(social, c.authorId, profile);
          return (
            <div key={c.id} className="card comment-card">
              <AuthorLine user={cu} time={c.createdAt} size={32} />
              <p className="comment-card__body">{c.body}</p>
            </div>
          );
        })}
        {thread.comments.length === 0 && (
          <p className="empty-hint">Inga svar än – bli först med att svara.</p>
        )}
      </div>

      <div className="card">
        <Composer
          placeholder="Skriv ett svar…"
          buttonLabel="Svara"
          rows={3}
          onSubmit={(text) => addThreadComment(thread.id, text)}
        />
      </div>
    </div>
  );
}
