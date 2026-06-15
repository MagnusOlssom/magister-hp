import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthorLine, Composer } from '../components/SocialShared';
import { IconComment, IconHeart, IconUsers } from '../components/icons';
import { useApp } from '../context/AppContext';
import type { FeedPost } from '../types';
import {
  addPost,
  addPostComment,
  resolveUser,
  toggleLike,
  useSocial,
} from '../utils/socialStore';

export default function SocialPage() {
  const { profile } = useApp();
  const social = useSocial();

  return (
    <div className="page social-page">
      <header className="page-header">
        <h1>Social</h1>
        <p className="page-header__sub">
          Dela, fråga och peppa varandra inför provet. (Lokal förhandsvisning – innehållet visas
          bara på den här enheten.)
        </p>
      </header>

      <div className="social-layout">
        <main className="social-main">
          <div className="card">
            <Composer
              placeholder={`Vad tänker du på${profile.name ? ', ' + profile.name.split(' ')[0] : ''}? Dela ett tips eller en fråga…`}
              onSubmit={addPost}
              buttonLabel="Publicera"
            />
          </div>

          <div className="feed">
            {social.posts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        <aside className="social-rail">
          <section className="card">
            <h2 className="social-rail__title">Diskussioner</h2>
            <div className="area-list">
              {social.areas.map((area) => {
                const count = social.threads.filter((t) => t.areaId === area.id).length;
                return (
                  <Link key={area.id} to={`/social/d/${area.id}`} className="area-row">
                    <span className="area-row__emoji" aria-hidden="true">
                      {area.emoji}
                    </span>
                    <span className="area-row__text">
                      <span className="area-row__name">{area.name}</span>
                      <span className="area-row__desc">{area.description}</span>
                    </span>
                    <span className="area-row__count">{count}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2 className="social-rail__title">Live-chattar</h2>
            <div className="chat-list">
              {social.chatRooms.map((room) => (
                <Link key={room.id} to={`/social/chat/${room.id}`} className="chat-row">
                  <span className="chat-row__text">
                    <span className="chat-row__name">{room.name}</span>
                    <span className="chat-row__topic">{room.topic}</span>
                  </span>
                  <span className="chat-row__online">
                    <span className="online-dot" aria-hidden="true" />
                    <IconUsers size={13} /> {room.onlineCount}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function FeedPostCard({ post }: { post: FeedPost }) {
  const { profile } = useApp();
  const social = useSocial();
  const [showComment, setShowComment] = useState(false);
  const author = resolveUser(social, post.authorId, profile);

  return (
    <article className="card feed-post">
      <AuthorLine user={author} time={post.createdAt} />
      <p className="feed-post__body">{post.body}</p>

      <div className="feed-post__actions">
        <button
          type="button"
          className={`feed-action${post.likedByMe ? ' feed-action--liked' : ''}`}
          onClick={() => toggleLike(post.id)}
        >
          <IconHeart size={17} /> {post.likeCount}
        </button>
        <button type="button" className="feed-action" onClick={() => setShowComment((v) => !v)}>
          <IconComment size={17} /> {post.comments.length}
        </button>
      </div>

      {post.comments.length > 0 && (
        <div className="comment-list">
          {post.comments.map((c) => {
            const cu = resolveUser(social, c.authorId, profile);
            return (
              <div key={c.id} className="comment">
                <AuthorLine user={cu} time={c.createdAt} size={28} />
                <p className="comment__body">{c.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {showComment && (
        <div className="feed-post__composer">
          <Composer
            placeholder="Skriv en kommentar…"
            buttonLabel="Kommentera"
            rows={1}
            onSubmit={(text) => addPostComment(post.id, text)}
          />
        </div>
      )}
    </article>
  );
}
