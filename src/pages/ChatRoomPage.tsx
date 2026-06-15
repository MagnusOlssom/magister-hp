import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { IconArrowLeft, IconSend, IconUsers } from '../components/icons';
import { useApp } from '../context/AppContext';
import { formatRelative } from '../utils/format';
import { addChatMessage, resolveUser, useSocial } from '../utils/socialStore';

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const { profile } = useApp();
  const social = useSocial();
  const [text, setText] = useState('');

  const room = social.chatRooms.find((r) => r.id === roomId);
  if (!room) {
    return (
      <div className="page page--narrow">
        <p>Chatten hittades inte.</p>
        <Link to="/social" className="inline-link">
          Tillbaka till Social
        </Link>
      </div>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    addChatMessage(room.id, text);
    setText('');
  };

  return (
    <div className="page page--narrow chat-page">
      <Link to="/social" className="inline-link back-link">
        <IconArrowLeft size={15} /> Social
      </Link>

      <header className="chat-header">
        <div>
          <h1>{room.name}</h1>
          <p className="page-header__sub">{room.topic}</p>
        </div>
        <span className="chat-header__online">
          <span className="online-dot" aria-hidden="true" /> <IconUsers size={14} /> {room.onlineCount} online
        </span>
      </header>

      <div className="chat-preview-banner">
        Förhandsvisning – realtidschatt aktiveras när communityn kopplas till en server. Dina
        meddelanden syns bara här så länge.
      </div>

      <div className="chat-window">
        {room.messages.map((m) => {
          const u = resolveUser(social, m.authorId, profile);
          return (
            <div key={m.id} className="chat-msg">
              <Avatar name={u.name} src={u.avatar} size={36} />
              <div className="chat-msg__body">
                <div className="chat-msg__head">
                  <span className="chat-msg__name">{u.name}</span>
                  <span className="chat-msg__time">{formatRelative(m.createdAt)}</span>
                </div>
                <p className="chat-msg__text">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="field__input"
          placeholder={`Meddelande till ${room.name}…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
        />
        <button
          type="button"
          className="btn btn--primary chat-input__send"
          disabled={!text.trim()}
          onClick={send}
          aria-label="Skicka"
        >
          <IconSend size={18} />
        </button>
      </div>
    </div>
  );
}
