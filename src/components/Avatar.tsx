interface Props {
  name: string;
  src?: string;
  size?: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, src, size = 40 }: Props) {
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (src) {
    return <img className="avatar" style={style} src={src} alt={name || 'Profilbild'} />;
  }
  return (
    <span className="avatar avatar--initials" style={style} aria-hidden>
      {initials(name)}
    </span>
  );
}
