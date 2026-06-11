import type { CategoryId, CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'XYZ',
    name: 'Matematisk problemlösning',
    description:
      'Testar din förmåga att lösa matematiska problem inom aritmetik, algebra, geometri, funktioner och statistik.',
    part: 'kvantitativ',
    secondsPerQuestion: 60,
    color: '#6366f1',
  },
  {
    id: 'KVA',
    name: 'Kvantitativa jämförelser',
    description:
      'Du jämför två kvantiteter och avgör vilken som är störst – eller om informationen inte räcker till.',
    part: 'kvantitativ',
    secondsPerQuestion: 60,
    color: '#06b6d4',
  },
  {
    id: 'NOG',
    name: 'Kvantitativa resonemang',
    description:
      'Testar om du kan avgöra vilken information som är tillräcklig för att lösa ett problem.',
    part: 'kvantitativ',
    secondsPerQuestion: 100,
    color: '#8b5cf6',
  },
  {
    id: 'DTK',
    name: 'Diagram, tabeller och kartor',
    description:
      'Testar din förmåga att hämta och tolka information ur diagram, tabeller och kartor.',
    part: 'kvantitativ',
    secondsPerQuestion: 115,
    color: '#14b8a6',
  },
  {
    id: 'ORD',
    name: 'Ordförståelse',
    description:
      'Testar ditt ordförråd – du väljer det ord eller uttryck som bäst motsvarar det givna ordet.',
    part: 'verbal',
    secondsPerQuestion: 18,
    color: '#f59e0b',
  },
  {
    id: 'LÄS',
    name: 'Svensk läsförståelse',
    description:
      'Du läser svenska texter och svarar på frågor som testar hur väl du har förstått innehållet.',
    part: 'verbal',
    secondsPerQuestion: 132,
    color: '#f43f5e',
  },
  {
    id: 'ELF',
    name: 'Engelsk läsförståelse',
    description:
      'Du läser engelska texter och svarar på frågor på engelska – precis som på provet.',
    part: 'verbal',
    secondsPerQuestion: 132,
    color: '#10b981',
  },
  {
    id: 'MEK',
    name: 'Meningskomplettering',
    description:
      'Du fyller i ord som saknas i meningar så att de blir korrekta och meningsfulla.',
    part: 'verbal',
    secondsPerQuestion: 48,
    color: '#f97316',
  },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>;

export const VERBAL_CATEGORIES: CategoryId[] = ['ORD', 'LÄS', 'MEK', 'ELF'];
export const KVANT_CATEGORIES: CategoryId[] = ['XYZ', 'KVA', 'NOG', 'DTK'];

/** Kategorier där svarsalternativens ordning är fast (standardalternativ). */
export const FIXED_OPTION_CATEGORIES: ReadonlySet<CategoryId> = new Set(['KVA', 'NOG']);
