import { StudySession, SessionLog, AppBackupData, DisciplineLinks, DisciplineId } from '../types';
import { generateInitialSchedule } from './scheduleGenerator';

const STORAGE_KEY_SESSIONS = 'pareto_study_sessions_v7';
const STORAGE_KEY_LOGS = 'pareto_study_logs_v1';
const STORAGE_KEY_COMPLETED_TOPICS = 'pareto_study_completed_topics_v1';
const STORAGE_KEY_TOTAL_SECONDS = 'pareto_study_total_liquid_sec_v1';
const STORAGE_KEY_NOTES = 'pareto_study_topic_notes_v1';
const STORAGE_KEY_DISCIPLINE_LINKS = 'pareto_study_discipline_links_v1';

export function getStoredSessions(): StudySession[] {
  const initial = generateInitialSchedule();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hasPreOctTopics = Array.isArray(parsed) && parsed.some((s: StudySession) => 
        s.date < '2026-10-05' && (s.microTopicId === 'micro_log_16' || s.microTopicId === 'micro_log_17' || s.microTopicId === 'micro_log_18' || s.microTopicId === 'micro_log_19')
      );
      const hasOctTopics = Array.isArray(parsed) && parsed.some((s: StudySession) => 
        s.date >= '2026-10-05' && (s.microTopicId === 'micro_log_16' || s.microTopicId === 'micro_log_18')
      );
      const hasRetaFinalNoBasic = Array.isArray(parsed) && 
        parsed.some((s: StudySession) => s.type === 'reta_final') &&
        !parsed.some((s: StudySession) => s.type === 'reta_final' && (s.disciplineId === 'portugues' || s.disciplineId === 'matematica'));

      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.date === '2026-09-21' && !hasPreOctTopics && hasOctTopics && hasRetaFinalNoBasic) {
        return parsed;
      }
    }

    // Attempt migration from v6 or older to preserve user progress
    const olderRaw = localStorage.getItem('pareto_study_sessions_v6') || localStorage.getItem('pareto_study_sessions_v5') || localStorage.getItem('pareto_study_sessions_v4') || localStorage.getItem('pareto_study_sessions_v3') || localStorage.getItem('pareto_study_sessions_v2') || localStorage.getItem('pareto_study_sessions_v1');
    if (olderRaw) {
      const olderParsed = JSON.parse(olderRaw);
      if (Array.isArray(olderParsed)) {
        const completedIds = new Set(olderParsed.filter((s: StudySession) => s.completed).map((s: StudySession) => s.id));
        const studiedMap = new Map(olderParsed.map((s: StudySession) => [s.id, s.studiedMinutes]));
        const merged = initial.map((s) => {
          if (completedIds.has(s.id)) {
            return {
              ...s,
              completed: true,
              studiedMinutes: studiedMap.get(s.id) || s.targetMinutes,
            };
          }
          return s;
        });
        saveStoredSessions(merged);
        return merged;
      }
    }
  } catch (err) {
    console.error('Error loading sessions from localStorage', err);
  }
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

export function normalizeDisciplineLinks(raw: any): DisciplineLinks {
  if (!raw || typeof raw !== 'object') return {};
  const normalized: DisciplineLinks = {};
  for (const [key, val] of Object.entries(raw)) {
    const discKey = key as DisciplineId;
    if (Array.isArray(val)) {
      normalized[discKey] = val
        .map((item: any, idx: number) => ({
          id: item?.id ? String(item.id) : `link_${discKey}_${Date.now()}_${idx}`,
          url: typeof item?.url === 'string' ? item.url.trim() : '',
          title: item?.title ? String(item.title).trim() : undefined,
          updatedAt: typeof item?.updatedAt === 'number' ? item.updatedAt : Date.now(),
        }))
        .filter((item) => !!item.url);
    } else if (val && typeof val === 'object' && (val as any).url) {
      normalized[discKey] = [
        {
          id: (val as any).id ? String((val as any).id) : `link_${discKey}_0_${Date.now()}`,
          url: String((val as any).url).trim(),
          title: (val as any).title ? String((val as any).title).trim() : undefined,
          updatedAt: (val as any).updatedAt || Date.now(),
        },
      ];
    }
  }
  return normalized;
}

export function getStoredDisciplineLinks(): DisciplineLinks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISCIPLINE_LINKS);
    if (raw) {
      return normalizeDisciplineLinks(JSON.parse(raw));
    }
  } catch (err) {
    console.error('Error loading discipline links', err);
  }
  return {};
}

export function saveStoredDisciplineLinks(links: DisciplineLinks): void {
  try {
    localStorage.setItem(STORAGE_KEY_DISCIPLINE_LINKS, JSON.stringify(links));
  } catch (err) {
    console.error('Error saving discipline links', err);
  }
}

export function exportBackupData(
  sessions: StudySession[],
  sessionLogs: SessionLog[],
  completedMicroTopicIds: string[],
  totalLiquidSeconds: number,
  notesByTopic: Record<string, string>,
  disciplineLinks?: DisciplineLinks
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
    disciplineLinks,
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
    disciplineLinks: parsed.disciplineLinks ? normalizeDisciplineLinks(parsed.disciplineLinks) : {},
  };
}
