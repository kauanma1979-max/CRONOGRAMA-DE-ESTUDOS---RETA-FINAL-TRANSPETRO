/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ScheduleView } from './components/ScheduleView';
import { ParetoExplorer } from './components/ParetoExplorer';
import { MetricsAndTimerView } from './components/MetricsAndTimerView';
import { BackupView } from './components/BackupView';
import { LiquidTimerModal } from './components/LiquidTimerModal';
import { StudySession, SessionLog, AppBackupData, DisciplineId } from './types';
import {
  getStoredSessions,
  saveStoredSessions,
  getStoredSessionLogs,
  saveStoredSessionLogs,
  getStoredCompletedTopicIds,
  saveStoredCompletedTopicIds,
  getStoredTotalLiquidSeconds,
  saveStoredTotalLiquidSeconds,
  exportBackupData,
} from './utils/storage';
import { generateInitialSchedule } from './utils/scheduleGenerator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'schedule' | 'reta_final' | 'pareto' | 'timer' | 'backup'>('schedule');

  // Persistence States
  const [sessions, setSessions] = useState<StudySession[]>(() => getStoredSessions());
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => getStoredSessionLogs());
  const [completedMicroTopicIds, setCompletedMicroTopicIds] = useState<string[]>(() =>
    getStoredCompletedTopicIds()
  );
  const [totalLiquidSeconds, setTotalLiquidSeconds] = useState<number>(() =>
    getStoredTotalLiquidSeconds()
  );

  // Timer States
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(0);
  const [activeTimerSession, setActiveTimerSession] = useState<StudySession | null>(null);

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

      setIsTimerRunning(false);
      setTimerElapsedSeconds(0);
      setActiveTimerSession(null);
    },
    []
  );

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
            {}
          )
        }
        onQuickRestoreClick={() => setCurrentTab('backup')}
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
            onViewModeChange={(mode) => {
              if (mode === 'reta_final' && currentTab !== 'reta_final') {
                setCurrentTab('reta_final');
              } else if (mode !== 'reta_final' && currentTab === 'reta_final') {
                setCurrentTab('schedule');
              }
            }}
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
