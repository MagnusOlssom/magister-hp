import { CATEGORIES } from '../data/categories';
import { poolSize } from '../data/questions';
import type { CategoryId } from '../types';
import { IconArrowRight } from './icons';

interface Props {
  onSelect: (category: CategoryId) => void;
}

const PART_LABEL = { kvantitativ: 'Kvantitativ del', verbal: 'Verbal del' } as const;

export default function CategorySelector({ onSelect }: Props) {
  const kvantitativa = CATEGORIES.filter((c) => c.part === 'kvantitativ');
  const verbala = CATEGORIES.filter((c) => c.part === 'verbal');

  return (
    <div className="category-selector">
      {[kvantitativa, verbala].map((group) => (
        <section key={group[0].part} className="category-group">
          <h2 className="section-title">{PART_LABEL[group[0].part]}</h2>
          <div className="category-grid">
            {group.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="category-card"
                onClick={() => onSelect(cat.id)}
              >
                <div className="category-card__top">
                  <span
                    className="category-card__chip"
                    style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                  >
                    {cat.id}
                  </span>
                  <span className="category-card__count">{poolSize(cat.id)} frågor</span>
                </div>
                <h3 className="category-card__name">{cat.name}</h3>
                <p className="category-card__desc">{cat.description}</p>
                <span className="category-card__cta">
                  Välj <IconArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
