import type { FacultyId, FacultyMeta } from '../types';

/**
 * Fakulteterna man kan representera i appen. Fast lista – håller dörren öppen
 * för framtida fakultetstävlingar där alla måste gå att gruppera.
 */
export const FACULTIES: FacultyMeta[] = [
  {
    id: 'medicin',
    name: 'Medicinska fakulteten',
    shortName: 'Medicin',
    emoji: '🩺',
    color: '#e11d48',
    motto: 'Vi hittar botemedlet.',
    description: 'Läkare, sjuksköterska, tandläkare och andra vårdyrken.',
  },
  {
    id: 'juridik',
    name: 'Juridiska fakulteten',
    shortName: 'Juridik',
    emoji: '⚖️',
    color: '#b45309',
    motto: 'Vi läser det finstilta.',
    description: 'Juristprogrammet och rättsvetenskap.',
  },
  {
    id: 'ekonomi',
    name: 'Ekonomihögskolan',
    shortName: 'Ekonomi',
    emoji: '📈',
    color: '#059669',
    motto: 'Allt är en investering.',
    description: 'Civilekonom, nationalekonomi och företagsekonomi.',
  },
  {
    id: 'teknik',
    name: 'Tekniska högskolan',
    shortName: 'Teknik',
    emoji: '⚙️',
    color: '#2563eb',
    motto: 'Vi bygger framtiden.',
    description: 'Civilingenjör, högskoleingenjör och datavetenskap.',
  },
  {
    id: 'naturvetenskap',
    name: 'Naturvetenskapliga fakulteten',
    shortName: 'Naturvetenskap',
    emoji: '🔬',
    color: '#0d9488',
    motto: 'Hypotes. Test. Upprepa.',
    description: 'Fysik, kemi, biologi och matematik.',
  },
  {
    id: 'humaniora',
    name: 'Humanistiska fakulteten',
    shortName: 'Humaniora',
    emoji: '📚',
    color: '#7c3aed',
    motto: 'Orden är vår hemmaplan.',
    description: 'Språk, historia, filosofi och litteratur.',
  },
  {
    id: 'samhallsvetenskap',
    name: 'Samhällsvetenskapliga fakulteten',
    shortName: 'Samhällsvetenskap',
    emoji: '🌍',
    color: '#ea580c',
    motto: 'Vi förstår världen.',
    description: 'Statsvetenskap, sociologi och medier.',
  },
  {
    id: 'lararutbildning',
    name: 'Lärarhögskolan',
    shortName: 'Lärare',
    emoji: '🍎',
    color: '#c026d3',
    motto: 'Kunskap ska delas.',
    description: 'Grundlärare, ämneslärare och förskollärare.',
  },
  {
    id: 'psykologi',
    name: 'Psykologiska fakulteten',
    shortName: 'Psykologi',
    emoji: '🧠',
    color: '#db2777',
    motto: 'Vi vet vad du tänker.',
    description: 'Psykologprogrammet och beteendevetenskap.',
  },
  {
    id: 'konst',
    name: 'Konstnärliga fakulteten',
    shortName: 'Konst & design',
    emoji: '🎨',
    color: '#9333ea',
    motto: 'Vi färglägger statistiken.',
    description: 'Arkitektur, design, musik och konst.',
  },
  {
    id: 'annan',
    name: 'Fria fakulteten',
    shortName: 'Övrigt',
    emoji: '✨',
    color: '#64748b',
    motto: 'Alla vägar är öppna.',
    description: 'Annat mål – eller inte bestämt dig än. Helt okej!',
  },
];

export const FACULTY_MAP: Record<FacultyId, FacultyMeta> = Object.fromEntries(
  FACULTIES.map((f) => [f.id, f]),
) as Record<FacultyId, FacultyMeta>;
