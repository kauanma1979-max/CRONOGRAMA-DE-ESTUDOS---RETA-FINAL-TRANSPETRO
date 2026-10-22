import { AppBackupData, StudySession, SessionLog, DisciplineLinks, DailyQuestionsState } from '../types';
import { validateAndParseBackup, normalizeDisciplineLinks } from './storage';

export const STORAGE_KEY_DRIVE_ENDPOINT = 'google_drive_sync_endpoint_v1';
export const STORAGE_KEY_DRIVE_AUTO_SYNC = 'google_drive_auto_sync_v1';
export const STORAGE_KEY_DRIVE_VALIDATED = 'google_drive_sync_validated_v1';
export const STORAGE_KEY_DRIVE_LAST_SYNC = 'google_drive_last_sync_date_v1';
export const STORAGE_KEY_DRIVE_SAFETY_BACKUP = 'pareto_pre_drive_sync_backup_v1';

export interface DriveSyncStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  lastSync?: string;
}

export function getDriveEndpoint(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_DRIVE_ENDPOINT) || '';
  } catch {
    return '';
  }
}

export function setDriveEndpoint(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVE_ENDPOINT, url.trim());
  } catch (err) {
    console.error('Error saving drive endpoint', err);
  }
}

export function getDriveAutoSync(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_DRIVE_AUTO_SYNC) === 'true';
  } catch {
    return false;
  }
}

export function setDriveAutoSync(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVE_AUTO_SYNC, enabled ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving auto-sync preference', err);
  }
}

export function getDriveSyncValidated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_DRIVE_VALIDATED) === 'true';
  } catch {
    return false;
  }
}

export function setDriveSyncValidated(valid: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVE_VALIDATED, valid ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving sync validated state', err);
  }
}

export function getLastDriveSyncDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_DRIVE_LAST_SYNC);
  } catch {
    return null;
  }
}

export function setLastDriveSyncDate(dateStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVE_LAST_SYNC, dateStr);
  } catch (err) {
    console.error('Error saving last sync date', err);
  }
}

export function savePreSyncSafetyBackup(backup: AppBackupData): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVE_SAFETY_BACKUP, JSON.stringify(backup));
  } catch (err) {
    console.error('Error saving safety backup', err);
  }
}

export function getPreSyncSafetyBackup(): AppBackupData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRIVE_SAFETY_BACKUP);
    if (raw) {
      return validateAndParseBackup(raw);
    }
  } catch (err) {
    console.error('Error loading safety backup', err);
  }
  return null;
}

/**
 * Regra de Mesclagem Segura: Combina os dados locais com os dados do Google Drive
 * sem sobrescrever ou perder o progresso do usuário.
 */
export function mergeBackupData(local: AppBackupData, remote: AppBackupData): AppBackupData {
  // 1. Sessões de Estudo: se a sessão estiver concluída em local OU remoto, permanece concluída.
  // Mantém o maior tempo estudado e preserva anotações locais.
  const remoteSessionMap = new Map<string, StudySession>(
    (remote.sessions || []).map((s) => [s.id, s])
  );

  const mergedSessions: StudySession[] = (local.sessions || []).map((localSession) => {
    const remoteSession = remoteSessionMap.get(localSession.id);
    if (!remoteSession) return localSession;

    const isCompleted = localSession.completed || remoteSession.completed;
    const studiedMinutes = Math.max(
      localSession.studiedMinutes || 0,
      remoteSession.studiedMinutes || 0,
      isCompleted ? localSession.targetMinutes : 0
    );

    return {
      ...localSession,
      completed: isCompleted,
      studiedMinutes,
      notes: localSession.notes || remoteSession.notes,
      questionsCount: Math.max(
        localSession.questionsCount || 0,
        remoteSession.questionsCount || 0
      ),
      correctCount: Math.max(
        localSession.correctCount || 0,
        remoteSession.correctCount || 0
      ),
    };
  });

  // Se o remoto possuir sessões novas que o local não tem, adiciona-as
  const localSessionIds = new Set(local.sessions.map((s) => s.id));
  (remote.sessions || []).forEach((rem) => {
    if (!localSessionIds.has(rem.id)) {
      mergedSessions.push(rem);
    }
  });

  // 2. Microtópicos concluídos: união de conjuntos sem duplicatas
  const mergedCompletedTopics = Array.from(
    new Set([
      ...(local.completedMicroTopicIds || []),
      ...(remote.completedMicroTopicIds || []),
    ])
  );

  // 3. Horas Líquidas Totais: o maior valor entre local e remoto
  const mergedTotalLiquid = Math.max(
    local.totalLiquidSeconds || 0,
    remote.totalLiquidSeconds || 0
  );

  // 4. Logs de Sessões: combinação sem duplicatas de id
  const logMap = new Map<string, SessionLog>();
  (remote.sessionLogs || []).forEach((log) => {
    if (log && log.id) logMap.set(log.id, log);
  });
  (local.sessionLogs || []).forEach((log) => {
    if (log && log.id) logMap.set(log.id, log); // Local sobrescreve em caso de mesmo id
  });
  const mergedSessionLogs = Array.from(logMap.values()).sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );

  // 5. Anotações por tópico: união, priorizando local se houver
  const mergedNotes: Record<string, string> = {
    ...(remote.notesByTopic || {}),
    ...(local.notesByTopic || {}),
  };

  // 6. Links de disciplinas e subtópicos: união de listas por chave
  const mergedLinks: DisciplineLinks = { ...(local.disciplineLinks || {}) };
  if (remote.disciplineLinks) {
    const normRemote = normalizeDisciplineLinks(remote.disciplineLinks);
    for (const [key, remLinks] of Object.entries(normRemote)) {
      const current = mergedLinks[key] || [];
      const seen = new Set(current.map((l) => l.url));
      const additions = remLinks.filter((l) => !seen.has(l.url));
      mergedLinks[key] = [...current, ...additions];
    }
  }

  // 7. Questões Diárias (Cronograma 50 Dias / Tickers):
  // Se concluído em um deles, marca como concluído.
  const mergedDailyQuestions: DailyQuestionsState = {
    ...(remote.dailyQuestionsProgress || {}),
    ...(local.dailyQuestionsProgress || {}),
  };

  const allDailyKeys = new Set([
    ...Object.keys(local.dailyQuestionsProgress || {}),
    ...Object.keys(remote.dailyQuestionsProgress || {}),
  ]);

  allDailyKeys.forEach((key) => {
    const loc = local.dailyQuestionsProgress?.[key];
    const rem = remote.dailyQuestionsProgress?.[key];
    const isDone = Boolean(loc?.completed || rem?.completed);
    const lastUpdate = Math.max(loc?.lastUpdatedAt || 0, rem?.lastUpdatedAt || 0, Date.now());

    mergedDailyQuestions[key] = {
      completed: isDone,
      lastUpdatedAt: lastUpdate,
    };
  });

  return {
    version: remote.version || local.version || '1.0.0',
    exportDate: new Date().toISOString(),
    appName: local.appName || remote.appName || 'Cronograma Pareto Transpetro 2026.3',
    sessions: mergedSessions,
    sessionLogs: mergedSessionLogs,
    completedMicroTopicIds: mergedCompletedTopics,
    totalLiquidSeconds: mergedTotalLiquid,
    notesByTopic: mergedNotes,
    disciplineLinks: mergedLinks,
    dailyQuestionsProgress: mergedDailyQuestions,
  };
}

/**
 * Normaliza e limpa a URL do Google Apps Script, convertendo /edit ou /dev para /exec
 */
export function cleanAppsScriptEndpoint(url: string): {
  cleanedUrl: string;
  isDriveLink: boolean;
  wasFixed: boolean;
  fixReason?: string;
} {
  let cleaned = (url || '').trim();
  const isDriveLink = cleaned.includes('drive.google.com');

  let wasFixed = false;
  let fixReason = '';

  if (cleaned.includes('/edit')) {
    cleaned = cleaned.replace(/\/edit(#.*)?$/, '/exec').replace(/\/edit\?/, '/exec?');
    wasFixed = true;
    fixReason = 'A URL informada terminava com /edit (editor do script). Foi convertida automaticamente para /exec.';
  } else if (cleaned.includes('/dev')) {
    cleaned = cleaned.replace(/\/dev(#.*)?$/, '/exec').replace(/\/dev\?/, '/exec?');
    wasFixed = true;
    fixReason = 'A URL informada era de teste (/dev), que exige login no Google. Foi convertida para /exec.';
  }

  return { cleanedUrl: cleaned, isDriveLink, wasFixed, fixReason };
}

/**
 * Executa a requisição JSONP ao Google Apps Script conforme especificação do usuário.
 * Dispara o CustomEvent 'drive-json-loaded' no objeto window ao obter os dados.
 */
export function fetchGoogleDriveDataViaJsonp(
  endpoint: string,
  onStatusChange?: (statusText: string) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const { cleanedUrl, isDriveLink, wasFixed, fixReason } = cleanAppsScriptEndpoint(endpoint);

    if (isDriveLink) {
      const err = 'Você inseriu o link do Google Drive (drive.google.com). Use a URL do Web App do Apps Script (/exec).';
      if (onStatusChange) onStatusChange(err);
      return reject(new Error(err));
    }

    if (!cleanedUrl || !cleanedUrl.startsWith('https://script.google.com/')) {
      const err = 'Configure a URL do Apps Script.';
      if (onStatusChange) onStatusChange(err);
      return reject(new Error(err));
    }

    if (wasFixed && fixReason) {
      console.info(fixReason);
    }

    if (onStatusChange) onStatusChange('Buscando dados...');

    let scriptAtual: HTMLScriptElement | null = null;
    let timeoutAtual: any = null;
    let callbackAtual: string | null = null;

    const limpar = () => {
      if (timeoutAtual) clearTimeout(timeoutAtual);
      if (scriptAtual && scriptAtual.parentNode) {
        scriptAtual.parentNode.removeChild(scriptAtual);
      }
      if (callbackAtual && (window as any)[callbackAtual]) {
        delete (window as any)[callbackAtual];
      }
      scriptAtual = null;
      callbackAtual = null;
    };

    callbackAtual =
      'receberDrive_' + Date.now() + '_' + Math.random().toString(36).slice(2);

    const nomeCallback = callbackAtual;
    const script = document.createElement('script');
    scriptAtual = script;

    (window as any)[nomeCallback] = (dados: any) => {
      limpar();

      if (!dados || typeof dados !== 'object') {
        const msg = 'O JSON recebido é inválido.';
        if (onStatusChange) onStatusChange(msg);
        return reject(new Error(msg));
      }

      if (onStatusChange) onStatusChange('Dados recebidos. Integrando...');

      // Dispara o evento CustomEvent exatamente conforme o anexo do usuário
      window.dispatchEvent(
        new CustomEvent('drive-json-loaded', {
          detail: dados,
        })
      );

      if (onStatusChange) {
        onStatusChange('Dados recebidos. Verifique a sincronização do app.');
      }

      resolve(dados);
    };

    script.onerror = async () => {
      limpar();

      // Fallback: tenta buscar diretamente via fetch com CORS caso o script retorne JSON direto
      try {
        const directResp = await fetch(cleanedUrl, {
          method: 'GET',
          redirect: 'follow',
        });
        if (directResp.ok) {
          const text = await directResp.text();
          let parsed: any = null;
          if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            parsed = JSON.parse(text);
          } else {
            const match = text.match(/^[a-zA-Z0-9_$]+\((.*)\);?\s*$/s);
            if (match && match[1]) {
              parsed = JSON.parse(match[1]);
            }
          }

          if (parsed && typeof parsed === 'object') {
            window.dispatchEvent(
              new CustomEvent('drive-json-loaded', {
                detail: parsed,
              })
            );
            if (onStatusChange) {
              onStatusChange('Dados recebidos. Verifique a sincronização do app.');
            }
            return resolve(parsed);
          }
        }
      } catch (err) {
        // Fallback fetch also failed
      }

      const msg = 'Falha no acesso. Confira a URL e as permissões.';
      if (onStatusChange) onStatusChange(msg);
      reject(new Error(msg));
    };

    timeoutAtual = setTimeout(() => {
      limpar();
      const msg = 'Tempo esgotado. Tente novamente.';
      if (onStatusChange) onStatusChange(msg);
      reject(new Error(msg));
    }, 15000);

    const separador = cleanedUrl.includes('?') ? '&' : '?';
    script.src =
      cleanedUrl +
      separador +
      'callback=' +
      encodeURIComponent(nomeCallback) +
      '&_=' +
      Date.now();

    document.head.appendChild(script);
  });
}
