/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BookmarkCheck } from 'lucide-react';
import { Header } from './components/Header';
import { ScheduleView } from './components/ScheduleView';
import { DailyQuestionsView } from './components/DailyQuestionsView';
import { ParetoExplorer } from './components/ParetoExplorer';
import { MetricsAndTimerView } from './components/MetricsAndTimerView';
import { BackupView } from './components/BackupView';
import { LiquidTimerModal } from './components/LiquidTimerModal';
import { StudySession, SessionLog, AppBackupData, DisciplineId, DisciplineLinks, DisciplineLink, DailyQuestionsState } from './types';
import {
  getStoredSessions,
  saveStoredSessions,
  getStoredSessionLogs,
  saveStoredSessionLogs,
  getStoredCompletedTopicIds,
  saveStoredCompletedTopicIds,
  getStoredTotalLiquidSeconds,
  saveStoredTotalLiquidSeconds,
  getStoredDisciplineLinks,
  saveStoredDisciplineLinks,
  getStoredDailyQuestions,
  saveStoredDailyQuestions,
  exportBackupData,
  validateAndParseBackup,
} from './utils/storage';
import {
  getDriveEndpoint,
  getDriveAutoSync,
  getDriveSyncValidated,
  setDriveSyncValidated,
  setLastDriveSyncDate,
  savePreSyncSafetyBackup,
  mergeBackupData,
  fetchGoogleDriveDataViaJsonp,
} from './utils/driveSync';
import { generateInitialSchedule } from './utils/scheduleGenerator';
import {
  AppTab,
  getStoredNavigationState,
  saveStoredNavigationState,
  saveTabScrollPosition,
  getTabScrollPosition,
} from './utils/navigationState';

export default function App() {
  // Navigation memory: loads the exact tab and state from last session
  const initialNav = useMemo(() => getStoredNavigationState(), []);
  const [currentTab, setCurrentTab] = useState<AppTab>(() => initialNav.currentTab || 'schedule');
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);

  // Persistence States
  const [sessions, setSessions] = useState<StudySession[]>(() => getStoredSessions());
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => getStoredSessionLogs());
  const [completedMicroTopicIds, setCompletedMicroTopicIds] = useState<string[]>(() =>
    getStoredCompletedTopicIds()
  );
  const [totalLiquidSeconds, setTotalLiquidSeconds] = useState<number>(() =>
    getStoredTotalLiquidSeconds()
  );
  const [disciplineLinks, setDisciplineLinks] = useState<DisciplineLinks>(() =>
    getStoredDisciplineLinks()
  );
  const [dailyQuestionsState, setDailyQuestionsState] = useState<DailyQuestionsState>(() =>
    getStoredDailyQuestions()
  );

  // Timer States with persistent recovery (maintains active session and elapsed stopwatch)
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(() => Boolean(initialNav.isTimerModalOpen));
  const [isTimerRunning, setIsTimerRunning] = useState(() => Boolean(initialNav.isTimerRunning));
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(() => {
    if (!initialNav.timerElapsedSeconds) return 0;
    if (initialNav.isTimerRunning && initialNav.timerSavedAtTimestamp) {
      const awaySeconds = Math.floor((Date.now() - initialNav.timerSavedAtTimestamp) / 1000);
      return initialNav.timerElapsedSeconds + Math.min(Math.max(awaySeconds, 0), 4 * 3600);
    }
    return initialNav.timerElapsedSeconds;
  });
  const [activeTimerSession, setActiveTimerSession] = useState<StudySession | null>(() => {
    if (initialNav.activeTimerSessionId) {
      const stored = getStoredSessions();
      const found = stored.find((s) => s.id === initialNav.activeTimerSessionId);
      if (found) return found;
    }
    return null;
  });

  // Interval ref for timer
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Live timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Show discreet toast when resuming previous session position
  useEffect(() => {
    if (initialNav.lastSavedAt) {
      const tabNames: Record<AppTab, string> = {
        schedule: 'Cronograma Geral',
        reta_final: 'Reta Final',
        questoes_diarias: 'Questões Diárias',
        pareto: 'Camadas 80/20',
        timer: 'Métricas & Timer',
        backup: 'Backup & Google Drive',
      };
      const name = tabNames[initialNav.currentTab] || 'sua última sessão';
      setResumeNotification(`Você voltou exatamente onde parou (${name})`);
      const timer = setTimeout(() => setResumeNotification(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [initialNav]);

  // Persist current tab whenever it changes
  useEffect(() => {
    saveStoredNavigationState({ currentTab });
  }, [currentTab]);

  // Persist timer state
  useEffect(() => {
    saveStoredNavigationState({
      isTimerModalOpen,
      isTimerRunning,
      timerElapsedSeconds,
      activeTimerSessionId: activeTimerSession?.id || null,
      timerSavedAtTimestamp: Date.now(),
    });
  }, [isTimerModalOpen, isTimerRunning, timerElapsedSeconds, activeTimerSession]);

  // Track and save scroll position throttled
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        saveTabScrollPosition(currentTab, window.scrollY);
        scrollTimeout = null;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentTab]);

  // Restore scroll position when tab changes
  useEffect(() => {
    const targetScroll = getTabScrollPosition(currentTab);
    if (targetScroll > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: targetScroll, behavior: 'instant' as ScrollBehavior });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [currentTab]);

  // Save current navigation and scroll state on page exit / visibility change
  useEffect(() => {
    const handleSaveOnExit = () => {
      saveTabScrollPosition(currentTab, window.scrollY);
      saveStoredNavigationState({
        currentTab,
        isTimerModalOpen,
        isTimerRunning,
        timerElapsedSeconds,
        activeTimerSessionId: activeTimerSession?.id || null,
        timerSavedAtTimestamp: Date.now(),
      });
    };

    window.addEventListener('beforeunload', handleSaveOnExit);
    window.addEventListener('pagehide', handleSaveOnExit);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleSaveOnExit();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleSaveOnExit);
      window.removeEventListener('pagehide', handleSaveOnExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentTab, isTimerModalOpen, isTimerRunning, timerElapsedSeconds, activeTimerSession]);

  // Synchronize storage whenever sessions change
  const handleUpdateSessions = useCallback((newSessions: StudySession[]) => {
    setSessions(newSessions);
    saveStoredSessions(newSessions);
  }, []);

  // Synchronize completed topics
  const handleUpdateCompletedTopics = useCallback((newTopics: string[]) => {
    setCompletedMicroTopicIds(newTopics);
    saveStoredCompletedTopicIds(newTopics);
  }, []);

  // Synchronize total seconds & logs
  const handleUpdateLogsAndSeconds = useCallback(
    (newLogs: SessionLog[], newTotalSeconds: number) => {
      setSessionLogs(newLogs);
      saveStoredSessionLogs(newLogs);
      setTotalLiquidSeconds(newTotalSeconds);
      saveStoredTotalLiquidSeconds(newTotalSeconds);
    },
    []
  );

  // Toggle Session completed checkbox
  const handleToggleSessionCompleted = useCallback(
    (sessionId: string) => {
      const updated = sessions.map((s) => {
        if (s.id === sessionId) {
          const nextCompleted = !s.completed;
          // If completing and has microTopicId, add to completed micro topics
          if (nextCompleted && s.microTopicId) {
            if (!completedMicroTopicIds.includes(s.microTopicId)) {
              handleUpdateCompletedTopics([...completedMicroTopicIds, s.microTopicId]);
            }
          }
          return {
            ...s,
            completed: nextCompleted,
            studiedMinutes: nextCompleted && s.studiedMinutes === 0 ? s.targetMinutes : s.studiedMinutes,
          };
        }
        return s;
      });
      handleUpdateSessions(updated);
    },
    [sessions, completedMicroTopicIds, handleUpdateCompletedTopics, handleUpdateSessions]
  );

  // Toggle Micro Topic ticker in Pareto Explorer
  const handleToggleMicroTopic = useCallback(
    (microId: string) => {
      if (completedMicroTopicIds.includes(microId)) {
        handleUpdateCompletedTopics(completedMicroTopicIds.filter((id) => id !== microId));
      } else {
        handleUpdateCompletedTopics([...completedMicroTopicIds, microId]);
      }
    },
    [completedMicroTopicIds, handleUpdateCompletedTopics]
  );

  // Launch timer for a session
  const handleStartSessionTimer = useCallback((session: StudySession) => {
    setActiveTimerSession(session);
    setIsTimerModalOpen(true);
    setIsTimerRunning(true);
  }, []);

  // Launch timer for a specific micro-topic from Pareto Explorer
  const handleLaunchTopicTimer = useCallback(
    (disciplineId: DisciplineId, microTopicId: string, topicTitle: string) => {
      // Find or create synthetic session representation
      setActiveTimerSession({
        id: `adhoc_${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        dayOfWeek: new Date().getDay(),
        timeSlot: '20:00 - 21:30',
        type: 'regular',
        disciplineId,
        microTopicId,
        title: topicTitle,
        targetMinutes: 90,
        studiedMinutes: 0,
        completed: false,
      });
      setIsTimerModalOpen(true);
      setIsTimerRunning(true);
    },
    []
  );

  // Timer controls
  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerElapsedSeconds(0);
  };

  const handleToggleTimerFromHeader = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      if (timerElapsedSeconds === 0 && !activeTimerSession) {
        setIsTimerModalOpen(true);
      }
      setIsTimerRunning(true);
    }
  };

  // Log completed session from timer
  const handleLogCompletedSession = useCallback(
    (logData: {
      durationSeconds: number;
      disciplineId: DisciplineId;
      microTopicId?: string;
      topicTitle: string;
      notes?: string;
      questionsCount?: number;
      correctCount?: number;
      sessionId?: string;
    }) => {
      const newLog: SessionLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        sessionId: logData.sessionId,
        timestamp: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        disciplineId: logData.disciplineId,
        microTopicId: logData.microTopicId,
        topicTitle: logData.topicTitle,
        durationSeconds: logData.durationSeconds,
        notes: logData.notes,
        questionsCount: logData.questionsCount,
        correctCount: logData.correctCount,
      };

      const updatedLogs = [...sessionLogs, newLog];
      const newTotalSeconds = totalLiquidSeconds + logData.durationSeconds;
      handleUpdateLogsAndSeconds(updatedLogs, newTotalSeconds);

      // If linked to an active session, mark session as completed and add studiedMinutes
      if (logData.sessionId) {
        const addMinutes = Math.max(1, Math.round(logData.durationSeconds / 60));
        const updatedSessions = sessions.map((s) => {
          if (s.id === logData.sessionId) {
            return {
              ...s,
              completed: true,
              studiedMinutes: s.studiedMinutes + addMinutes,
              notes: logData.notes || s.notes,
              questionsCount: (s.questionsCount || 0) + (logData.questionsCount || 0),
              correctCount: (s.correctCount || 0) + (logData.correctCount || 0),
            };
          }
          return s;
        });
        handleUpdateSessions(updatedSessions);
      }

      // If microTopicId, add to completed tickers
      if (logData.microTopicId && !completedMicroTopicIds.includes(logData.microTopicId)) {
        handleUpdateCompletedTopics([...completedMicroTopicIds, logData.microTopicId]);
      }

      // Reset timer state
      setIsTimerRunning(false);
      setTimerElapsedSeconds(0);
      setActiveTimerSession(null);
    },
    [
      sessionLogs,
      totalLiquidSeconds,
      sessions,
      completedMicroTopicIds,
      handleUpdateLogsAndSeconds,
      handleUpdateSessions,
      handleUpdateCompletedTopics,
    ]
  );

  // Save or update topic/subtopic link (appends new or updates existing)
  const handleSaveDisciplineLink = useCallback((topicKey: string, link: DisciplineLink) => {
    setDisciplineLinks((prev) => {
      const currentList = prev[topicKey] || [];
      const index = currentList.findIndex((item) => item.id === link.id);
      let updatedList: DisciplineLink[];
      if (index >= 0) {
        updatedList = [...currentList];
        updatedList[index] = link;
      } else {
        updatedList = [...currentList, link];
      }
      const updated = { ...prev, [topicKey]: updatedList };
      saveStoredDisciplineLinks(updated);
      return updated;
    });
  }, []);

  // Delete a specific link by id for a topicKey (or clear all if no linkId)
  const handleDeleteDisciplineLink = useCallback((topicKey: string, linkId?: string) => {
    setDisciplineLinks((prev) => {
      const currentList = prev[topicKey] || [];
      let updatedList: DisciplineLink[];
      if (linkId) {
        updatedList = currentList.filter((item) => item.id !== linkId);
      } else {
        updatedList = [];
      }
      const updated = { ...prev, [topicKey]: updatedList };
      saveStoredDisciplineLinks(updated);
      return updated;
    });
  }, []);

  // Update daily questions state
  const handleUpdateDailyQuestionsState = useCallback((newState: DailyQuestionsState) => {
    setDailyQuestionsState(newState);
    saveStoredDailyQuestions(newState);
  }, []);

  // Restore backup
  const handleRestoreBackup = useCallback(
    (backup: AppBackupData) => {
      setSessions(backup.sessions);
      saveStoredSessions(backup.sessions);

      setSessionLogs(backup.sessionLogs);
      saveStoredSessionLogs(backup.sessionLogs);

      setCompletedMicroTopicIds(backup.completedMicroTopicIds);
      saveStoredCompletedTopicIds(backup.completedMicroTopicIds);

      setTotalLiquidSeconds(backup.totalLiquidSeconds);
      saveStoredTotalLiquidSeconds(backup.totalLiquidSeconds);

      if (backup.disciplineLinks) {
        setDisciplineLinks(backup.disciplineLinks);
        saveStoredDisciplineLinks(backup.disciplineLinks);
      }

      if (backup.dailyQuestionsProgress) {
        setDailyQuestionsState(backup.dailyQuestionsProgress);
        saveStoredDailyQuestions(backup.dailyQuestionsProgress);
      }

      setIsTimerRunning(false);
      setTimerElapsedSeconds(0);
      setActiveTimerSession(null);
    },
    []
  );

  // Helper to build current full AppBackupData snapshot
  const getCurrentBackupData = useCallback((): AppBackupData => {
    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'Cronograma Pareto Transpetro 2026.3',
      sessions,
      sessionLogs,
      completedMicroTopicIds,
      totalLiquidSeconds,
      notesByTopic: {},
      disciplineLinks,
      dailyQuestionsProgress: dailyQuestionsState,
    };
  }, [
    sessions,
    sessionLogs,
    completedMicroTopicIds,
    totalLiquidSeconds,
    disciplineLinks,
    dailyQuestionsState,
  ]);

  // Listen for the custom 'drive-json-loaded' event as specified in the prompt integration point
  useEffect(() => {
    const handleDriveJsonLoaded = (e: Event) => {
      const customEvent = e as CustomEvent;
      const remoteData = customEvent.detail;
      if (!remoteData || typeof remoteData !== 'object') {
        console.warn('drive-json-loaded: payload recebido é inválido', remoteData);
        return;
      }

      try {
        const parsedRemote = validateAndParseBackup(
          typeof remoteData === 'string' ? remoteData : JSON.stringify(remoteData)
        );

        // Pre-sync safety snapshot
        const current = getCurrentBackupData();
        savePreSyncSafetyBackup(current);

        // Safe merge rule: preserves existing progress and merges remote additions
        const merged = mergeBackupData(current, parsedRemote);
        handleRestoreBackup(merged);
        setDriveSyncValidated(true);
        setLastDriveSyncDate(new Date().toLocaleString('pt-BR'));
        console.info('Google Drive JSON integrado com sucesso via evento drive-json-loaded.');
      } catch (err) {
        console.error('Falha ao processar dados do evento drive-json-loaded:', err);
      }
    };

    window.addEventListener('drive-json-loaded', handleDriveJsonLoaded);
    return () => {
      window.removeEventListener('drive-json-loaded', handleDriveJsonLoaded);
    };
  }, [getCurrentBackupData, handleRestoreBackup]);

  // Expose window.sincronizarGoogleDrive global caller
  useEffect(() => {
    (window as any).sincronizarGoogleDrive = () => {
      const endpoint = getDriveEndpoint();
      if (!endpoint || !endpoint.startsWith('https://script.google.com/')) {
        console.warn('Google Drive Sync: Endpoint não configurado.');
        return Promise.reject(new Error('Configure a URL do Apps Script.'));
      }
      return fetchGoogleDriveDataViaJsonp(endpoint);
    };
    return () => {
      delete (window as any).sincronizarGoogleDrive;
    };
  }, []);

  // Automatic sync on app startup ONLY if user validated the integration beforehand
  useEffect(() => {
    if (getDriveAutoSync() && getDriveSyncValidated()) {
      const endpoint = getDriveEndpoint();
      if (endpoint && endpoint.startsWith('https://script.google.com/')) {
        const timer = setTimeout(() => {
          fetchGoogleDriveDataViaJsonp(endpoint).catch((err) => {
            console.warn('Auto-sync ao iniciar o aplicativo foi ignorado ou falhou:', err);
          });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Reset to default schedule
  const handleResetToDefaults = useCallback(() => {
    const fresh = generateInitialSchedule();
    setSessions(fresh);
    saveStoredSessions(fresh);
    setSessionLogs([]);
    saveStoredSessionLogs([]);
    setCompletedMicroTopicIds([]);
    saveStoredCompletedTopicIds([]);
    setTotalLiquidSeconds(0);
    saveStoredTotalLiquidSeconds(0);
    setDisciplineLinks({});
    saveStoredDisciplineLinks({});
    setDailyQuestionsState({});
    saveStoredDailyQuestions({});
    setIsTimerRunning(false);
    setTimerElapsedSeconds(0);
    setActiveTimerSession(null);
  }, []);

  const completedSessionsCount = sessions.filter((s) => s.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header with Navigation & Live Stopwatch Badge */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalLiquidSeconds={totalLiquidSeconds + (isTimerRunning ? timerElapsedSeconds : 0)}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimerFromHeader}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        activeSessionTitle={activeTimerSession?.title}
        completedSessionsCount={completedSessionsCount}
        totalSessionsCount={sessions.length}
        onQuickBackup={() =>
          exportBackupData(
            sessions,
            sessionLogs,
            completedMicroTopicIds,
            totalLiquidSeconds,
            {},
            disciplineLinks,
            dailyQuestionsState
          )
        }
        onQuickRestoreClick={() => setCurrentTab('backup')}
        onQuickDriveSync={() => {
          const endpoint = getDriveEndpoint();
          if (endpoint && endpoint.startsWith('https://script.google.com/')) {
            fetchGoogleDriveDataViaJsonp(endpoint).catch(() => {
              setCurrentTab('backup');
            });
          } else {
            setCurrentTab('backup');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(currentTab === 'schedule' || currentTab === 'reta_final') && (
          <ScheduleView
            sessions={sessions}
            onToggleSessionCompleted={handleToggleSessionCompleted}
            onStartSessionTimer={handleStartSessionTimer}
            completedTopicIds={completedMicroTopicIds}
            initialViewMode={currentTab === 'reta_final' ? 'reta_final' : 'daily'}
            disciplineLinks={disciplineLinks}
            onSaveDisciplineLink={handleSaveDisciplineLink}
            onDeleteDisciplineLink={handleDeleteDisciplineLink}
            onViewModeChange={(mode) => {
              if (mode === 'reta_final' && currentTab !== 'reta_final') {
                setCurrentTab('reta_final');
              } else if (mode !== 'reta_final' && currentTab === 'reta_final') {
                setCurrentTab('schedule');
              }
            }}
          />
        )}

        {currentTab === 'questoes_diarias' && (
          <DailyQuestionsView
            dailyQuestionsState={dailyQuestionsState}
            onUpdateDailyQuestionsState={handleUpdateDailyQuestionsState}
            disciplineLinks={disciplineLinks}
            onSaveDisciplineLink={handleSaveDisciplineLink}
            onDeleteDisciplineLink={handleDeleteDisciplineLink}
          />
        )}

        {currentTab === 'pareto' && (
          <ParetoExplorer
            completedMicroTopicIds={completedMicroTopicIds}
            onToggleMicroTopic={handleToggleMicroTopic}
            onLaunchTopicTimer={handleLaunchTopicTimer}
          />
        )}

        {currentTab === 'timer' && (
          <MetricsAndTimerView
            totalLiquidSeconds={totalLiquidSeconds}
            sessionLogs={sessionLogs}
            isTimerRunning={isTimerRunning}
            onOpenTimerModal={() => setIsTimerModalOpen(true)}
            onQuickStartTimer={() => {
              setIsTimerModalOpen(true);
              setIsTimerRunning(true);
            }}
            completedSessionsCount={completedSessionsCount}
            totalSessionsCount={sessions.length}
          />
        )}

        {currentTab === 'backup' && (
          <BackupView
            sessions={sessions}
            sessionLogs={sessionLogs}
            completedMicroTopicIds={completedMicroTopicIds}
            totalLiquidSeconds={totalLiquidSeconds}
            disciplineLinks={disciplineLinks}
            dailyQuestionsProgress={dailyQuestionsState}
            onRestoreBackup={handleRestoreBackup}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
      </main>

      {/* Floating Active Timer Modal */}
      <LiquidTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        isTimerRunning={isTimerRunning}
        elapsedSeconds={timerElapsedSeconds}
        onStartTimer={handleStartTimer}
        onPauseTimer={handlePauseTimer}
        onResetTimer={handleResetTimer}
        onLogCompletedSession={handleLogCompletedSession}
        activeSession={activeTimerSession}
        availableSessions={sessions}
      />

      {/* Toast Informativo de Retomada de Sessão */}
      {resumeNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300">Posição Restaurada</p>
            <p className="text-[11px] text-slate-300">{resumeNotification}</p>
          </div>
          <button
            onClick={() => setResumeNotification(null)}
            className="text-slate-400 hover:text-white text-xs p-1 ml-2 cursor-pointer transition-colors"
            title="Fechar"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            TRANSPETRO 2026.3 • Ênfase 1: Administração e Controle • Banca Cesgranrio
          </span>
          <span>
            Princípio 80/20 Aplicado em 3 Camadas • Horas Líquidas & Backup JSON
          </span>
        </div>
      </footer>
    </div>
  );
}
