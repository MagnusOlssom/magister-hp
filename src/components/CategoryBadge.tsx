import { CATEGORY_MAP } from '../data/categories';
import type { CategoryId } from '../types';

interface Props {
  category: CategoryId;
  size?: 'sm' | 'md' | 'lg';
}

/** Färgad kategorisymbol, t.ex. en chip med "XYZ". */
export default function CategoryBadge({ category, size = 'md' }: Props) {
  const meta = CATEGORY_MAP[category];
  return (
    <span
      className={`cat-badge cat-badge--${size}`}
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      {category}
    </span>
  );
}
