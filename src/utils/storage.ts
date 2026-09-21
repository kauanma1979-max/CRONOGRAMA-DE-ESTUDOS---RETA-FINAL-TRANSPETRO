import { StudySession, SessionLog, AppBackupData } from '../types';
import { generateInitialSchedule } from './scheduleGenerator';

const STORAGE_KEY_SESSIONS = 'pareto_study_sessions_v3';
const STORAGE_KEY_LOGS = 'pareto_study_logs_v1';
const STORAGE_KEY_COMPLETED_TOPICS = 'pareto_study_completed_topics_v1';
const STORAGE_KEY_TOTAL_SECONDS = 'pareto_study_total_liquid_sec_v1';
const STORAGE_KEY_NOTES = 'pareto_study_topic_notes_v1';

export function getStoredSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hasRetiredTopics = Array.isArray(parsed) && parsed.some((s: StudySession) => 
        s.microTopicId && ['micro_fin_1', 'micro_fin_2', 'micro_fin_3', 'micro_fin_4'].includes(s.microTopicId)
      );
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.date === '2026-09-21' && !hasRetiredTopics) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading sessions from localStorage', err);
  }
  const initial = generateInitialSchedule();
  saveStoredSessions(initial);
  return initial;
}

export function saveStoredSessions(sessions: StudySession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions to localStorage', err);
  }
}

export function getStoredSessionLogs(): SessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading logs', err);
  }
  return [];
}

export function saveStoredSessionLogs(logs: SessionLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs', err);
  }
}

export function getStoredCompletedTopicIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_TOPICS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading completed topics', err);
  }
  return [];
}

export function saveStoredCompletedTopicIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED_TOPICS, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving completed topics', err);
  }
}

export function getStoredTotalLiquidSeconds(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOTAL_SECONDS);
    if (raw) return Number(raw) || 0;
  } catch (err) {
    console.error('Error loading total seconds', err);
  }
  return 0;
}

export function saveStoredTotalLiquidSeconds(seconds: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_TOTAL_SECONDS, String(seconds));
  } catch (err) {
    console.error('Error saving total seconds', err);
  }
}

export function getStoredTopicNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading notes', err);
  }
  return {};
}

export function saveStoredTopicNotes(notes: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving notes', err);
  }
}

export function exportBackupData(
  sessions: StudySession[],
  sessionLogs: SessionLog[],
  completedMicroTopicIds: string[],
  totalLiquidSeconds: number,
  notesByTopic: Record<string, string>
): void {
  const data: AppBackupData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    appName: 'Cronograma Pareto Transpetro 2026.3',
    sessions,
    sessionLogs,
    completedMicroTopicIds,
    totalLiquidSeconds,
    notesByTopic,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const dateTag = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `backup_pareto_transpetro_${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateAndParseBackup(fileContent: string): AppBackupData {
  const parsed = JSON.parse(fileContent);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Arquivo JSON inválido.');
  }
  if (!Array.isArray(parsed.sessions)) {
    throw new Error('Estrutura de sessões inválida no arquivo de backup.');
  }
  return {
    version: parsed.version || '1.0.0',
    exportDate: parsed.exportDate || new Date().toISOString(),
    appName: parsed.appName || 'Cronograma Pareto Transpetro 2026.3',
    sessions: parsed.sessions,
    sessionLogs: Array.isArray(parsed.sessionLogs) ? parsed.sessionLogs : [],
    completedMicroTopicIds: Array.isArray(parsed.completedMicroTopicIds)
      ? parsed.completedMicroTopicIds
      : [],
    totalLiquidSeconds: Number(parsed.totalLiquidSeconds) || 0,
    notesByTopic: parsed.notesByTopic && typeof parsed.notesByTopic === 'object' ? parsed.notesByTopic : {},
  };
}
