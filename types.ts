
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  sourceCount: number;
  lastEdited: string; // ISO date or relative string
  emoji: string;
  isPinned: boolean;
  colorGradient: string;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WORKSPACE = 'WORKSPACE',
}

export type ThemeMode = 'light' | 'dark';

export interface CreateProjectFormData {
  title: string;
  emoji: string;
}

// --- Workspace Types ---

export type SourceType = 'pdf' | 'doc' | 'web' | 'youtube';
export type SourceStatus = 'processing' | 'ready' | 'error';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  isSelected: boolean;
  tokensUsed: number;
  totalTokens: number;
}

export interface Citation {
  id: string;
  sourceId: string;
  page: number;
  text: string;
  snippet: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citations?: Citation[];
  timestamp: number;
}

// --- Study Mode Types ---

export type WorkspaceTab = 'chat' | 'study';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status?: 'forgot' | 'familiar' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface KeyConcept {
  id: string;
  title: string;
  points: string[];
  citation: string;
}

export interface TimelineEvent {
  id: string;
  step: string;
  description: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}
