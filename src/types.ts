export type DisciplineId =
  | 'logistica'
  | 'financas'
  | 'processos_adm'
  | 'informatica'
  | 'portugues'
  | 'matematica';

export type Temperature = 'fervendo' | 'quente' | 'morno' | 'frio';
export type Difficulty = 'Fácil' | 'Médio' | 'Médio-Difícil' | 'Difícil';

export interface DisciplineInfo {
  id: DisciplineId;
  name: string;
  shortName: string;
  targetHours: number;
  questionsCount?: number;
  examSharePercent?: number;
  priorityBadge: 'PRIORITÁRIA' | 'COMPLEMENTAR' | 'BÁSICA';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export interface MesoTopic {
  id: string;
  disciplineId: DisciplineId;
  order: number;
  title: string;
  strategyTip?: string;
  retomadasCount: number;
  phases: string;
  frequency: string;
  temperature: Temperature;
  hours: number;
}

export interface MicroTopic {
  id: string;
  mesoTopicId: string;
  disciplineId: DisciplineId;
  title: string;
  keyConcepts: string;
  difficulty: Difficulty;
  suggestedHours: number;
  isCorePareto: boolean;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  timeSlot: string; // "18:00 - 19:00" | "20:00 - 21:30" | "21:30 - 23:00" | "09:00 - 10:00" etc.
  type: 'regular' | 'basic' | 'sunday_review' | 'reta_final';
  shift?: 'manha' | 'tarde' | 'noite';
  disciplineId: DisciplineId;
  microTopicId?: string;
  title: string;
  subtitle?: string;
  targetMinutes: number;
  studiedMinutes: number;
  completed: boolean;
  notes?: string;
  questionsCount?: number;
  correctCount?: number;
}

export interface LiquidTimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  activeSessionId?: string;
  activeDisciplineId?: DisciplineId;
  activeMicroTopicId?: string;
  mode: 'stopwatch' | 'timer';
  targetSeconds: number; // e.g. 5400 for 90m, 3600 for 60m
}

export interface SessionLog {
  id: string;
  sessionId?: string;
  timestamp: number;
  date: string;
  disciplineId: DisciplineId;
  microTopicId?: string;
  topicTitle: string;
  durationSeconds: number;
  notes?: string;
  questionsCount?: number;
  correctCount?: number;
}

export interface DisciplineLink {
  id: string;
  url: string;
  title?: string;
  updatedAt?: number;
}

export type DisciplineLinks = Partial<Record<DisciplineId, DisciplineLink[]>>;

export interface AppBackupData {
  version: string;
  exportDate: string;
  appName: string;
  completedMicroTopicIds: string[];
  sessions: StudySession[];
  sessionLogs: SessionLog[];
  totalLiquidSeconds: number;
  notesByTopic: Record<string, string>;
  disciplineLinks?: DisciplineLinks;
}
