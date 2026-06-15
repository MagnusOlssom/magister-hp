export type CategoryId =
  | 'XYZ'
  | 'KVA'
  | 'NOG'
  | 'DTK'
  | 'ORD'
  | 'LÄS'
  | 'ELF'
  | 'MEK';

export type Difficulty = 'Bas' | 'Medel' | 'Svår';

export type TestPart = 'kvantitativ' | 'verbal';

export type Tempo = 'standard' | 'lugn';

export interface Question {
  id: string;
  category: CategoryId;
  /** Kort text/diagrambeskrivning som visas före frågan (LÄS, ELF, DTK). */
  passage?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
  part: TestPart;
  /** Rekommenderad tid per fråga i sekunder (standardtempo på provet). */
  secondsPerQuestion: number;
  color: string;
}

export interface AnsweredQuestion {
  questionId: string;
  category: CategoryId;
  /** null = obesvarad (t.ex. när tiden tog slut). */
  selected: string | null;
  correct: boolean;
  timeSpentSec: number;
}

export interface SessionRecord {
  id: string;
  category: CategoryId;
  startedAt: string; // ISO-datum
  /** Planerat antal frågor i sessionen. */
  questionCount: number;
  answered: AnsweredQuestion[];
  correctCount: number;
  timed: boolean;
  tempo: Tempo;
  timeLimitSec: number | null;
  /** Aktiv svarstid i sekunder (pausas medan förklaringar läses). */
  totalTimeSec: number;
  timedOut: boolean;
  /** True om alla frågor besvarades. */
  completed: boolean;
}

export interface SessionConfig {
  category: CategoryId;
  questionCount: number;
  timed: boolean;
  tempo: Tempo;
}

export type FacultyId =
  | 'medicin'
  | 'juridik'
  | 'ekonomi'
  | 'teknik'
  | 'naturvetenskap'
  | 'humaniora'
  | 'samhallsvetenskap'
  | 'lararutbildning'
  | 'psykologi'
  | 'konst'
  | 'annan';

export interface FacultyMeta {
  id: FacultyId;
  name: string;
  /** Kort namn för trånga ytor, t.ex. "Medicin". */
  shortName: string;
  emoji: string;
  color: string;
  /** Kaxigt motto som visas vid invigningen och på profilen. */
  motto: string;
  description: string;
}

export interface Profile {
  name: string;
  avatar?: string; // dataURL
  goalScore: number; // 0.0–2.0
  faculty?: FacultyId;
  /** True när välkomstflödet är genomfört (eller överhoppat). */
  onboarded?: boolean;
  /** Valfritt måldatum för provet (ISO yyyy-mm-dd) – används av Coach Jens. */
  examDate?: string;
  /** Egen vald pluggtid per vecka i minuter. Saknas = använd rekommenderad. */
  weeklyStudyMinutes?: number;
  /** Vilodagar (0 = måndag … 6 = söndag) då inga uppgifter schemaläggs. */
  restDays?: number[];
}

export type Theme = 'light' | 'dark';

// ---------------------------------------------------------------- Social

export interface SocialUser {
  id: string;
  name: string;
  faculty?: FacultyId;
  /** dataURL om satt (annars visas initialer). */
  avatar?: string;
}

export interface SocialComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string; // ISO
}

export interface FeedPost {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  comments: SocialComment[];
}

export interface DiscussionArea {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface DiscussionThread {
  id: string;
  areaId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  views: number;
  comments: SocialComment[];
  lastActivityAt: string;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  onlineCount: number;
  messages: ChatMessage[];
}

export interface SocialState {
  version: number;
  users: Record<string, SocialUser>;
  posts: FeedPost[]; // nyast först
  areas: DiscussionArea[];
  threads: DiscussionThread[];
  chatRooms: ChatRoom[];
}
