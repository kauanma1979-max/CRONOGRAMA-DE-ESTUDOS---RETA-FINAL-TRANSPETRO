import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { StudySession, DisciplineId, SessionLog } from '../types';
import { DISCIPLINES, MICRO_TOPICS } from '../data/paretoData';
import { formatSecondsToDigital } from '../utils/scheduleGenerator';

interface LiquidTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTimerRunning: boolean;
  elapsedSeconds: number;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onLogCompletedSession: (logData: {
    durationSeconds: number;
    disciplineId: DisciplineId;
    microTopicId?: string;
    topicTitle: string;
    notes?: string;
    questionsCount?: number;
    correctCount?: number;
    sessionId?: string;
  }) => void;
  activeSession?: StudySession | null;
  onSelectSessionToStudy?: (session: StudySession) => void;
  availableSessions: StudySession[];
}

export const LiquidTimerModal: React.FC<LiquidTimerModalProps> = ({
  isOpen,
  onClose,
  isTimerRunning,
  elapsedSeconds,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onLogCompletedSession,
  activeSession,
  onSelectSessionToStudy,
  availableSessions,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId>('logistica');
  const [selectedMicroTopicId, setSelectedMicroTopicId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [questionsCount, setQuestionsCount] = useState<number | ''>('');
  const [correctCount, setCorrectCount] = useState<number | ''>('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  // Sync state with activeSession if provided
  useEffect(() => {
    if (activeSession) {
      setSelectedDiscipline(activeSession.disciplineId);
      if (activeSession.microTopicId) {
        setSelectedMicroTopicId(activeSession.microTopicId);
      }
      setCustomTitle(activeSession.title);
    }
  }, [activeSession]);

  if (!isOpen) return null;

  const currentDisciplineInfo = DISCIPLINES.find((d) => d.id === selectedDiscipline) || DISCIPLINES[0];
  const microTopicsForDisc = MICRO_TOPICS.filter((m) => m.disciplineId === selectedDiscipline);
  const currentMicroTopic = MICRO_TOPICS.find((m) => m.id === selectedMicroTopicId);

  // Calculate target seconds based on active session targetMinutes (default 5400s = 90 min)
  const targetMinutes = activeSession ? activeSession.targetMinutes : 90;
  const targetSeconds = targetMinutes * 60;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  const handleFinishAndSave = () => {
    const finalTitle =
      customTitle ||
      (currentMicroTopic ? currentMicroTopic.title : `${currentDisciplineInfo.name} - Estudo Livre`);

    onLogCompletedSession({
      durationSeconds: elapsedSeconds,
      disciplineId: selectedDiscipline,
      microTopicId: selectedMicroTopicId || undefined,
      topicTitle: finalTitle,
      notes: notes || undefined,
      questionsCount: questionsCount !== '' ? Number(questionsCount) : undefined,
      correctCount: correctCount !== '' ? Number(correctCount) : undefined,
      sessionId: activeSession?.id,
    });

    setShowCompletionForm(false);
    setNotes('');
    setQuestionsCount('');
    setCorrectCount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        id="liquid-timer-modal"
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Contador de Horas Líquidas
                {isTimerRunning && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Acione ao começar sua sessão de 1:30h ou 1:00h
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Digital Stopwatch Display */}
          <div className="relative overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center shadow-inner">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
              <span>Tempo Líquido Estudado</span>
              <span>•</span>
              <span className="text-amber-400">Meta: {targetMinutes} min</span>
            </div>

            <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white select-none my-2">
              {formatSecondsToDigital(elapsedSeconds)}
            </div>

            {/* Target Progress Bar */}
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span>00:00</span>
                <span>{progressPercent}% da meta do bloco</span>
                <span>{formatSecondsToDigital(targetSeconds)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Controls: Play / Pause / Reset / Log */}
          <div className="flex items-center justify-center gap-3">
            {!isTimerRunning ? (
              <button
                id="timer-start-btn"
                type="button"
                onClick={onStartTimer}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{elapsedSeconds > 0 ? 'Retomar Estudo' : 'Iniciar Estudo Líquido'}</span>
              </button>
            ) : (
              <button
                id="timer-pause-btn"
                type="button"
                onClick={onPauseTimer}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar (Pausa / Intervalo)</span>
              </button>
            )}

            <button
              id="timer-reset-btn"
              type="button"
              onClick={onResetTimer}
              disabled={elapsedSeconds === 0}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 font-semibold text-sm flex items-center gap-2 border border-slate-700 transition-colors"
              title="Zerar cronômetro"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Zerar</span>
            </button>

            <button
              id="timer-finish-open-btn"
              type="button"
              onClick={() => setShowCompletionForm(true)}
              disabled={elapsedSeconds < 10}
              className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 disabled:opacity-40 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir & Registrar</span>
            </button>
          </div>

          {/* Active Session & Topic Selection */}
          {!showCompletionForm ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Matéria & Tópico Vinculado</span>
                {activeSession && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Sessão: {activeSession.timeSlot}
                  </span>
                )}
              </div>

              {/* Discipline Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DISCIPLINES.map((disc) => {
                  const isSelected = selectedDiscipline === disc.id;
                  return (
                    <button
                      key={disc.id}
                      type="button"
                      onClick={() => {
                        setSelectedDiscipline(disc.id);
                        const firstTopic = MICRO_TOPICS.find((m) => m.disciplineId === disc.id);
                        if (firstTopic) setSelectedMicroTopicId(firstTopic.id);
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                        isSelected
                          ? `${disc.bgColor} ${disc.borderColor} ${disc.textColor} border-2 shadow-sm`
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="truncate">{disc.shortName}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        {disc.targetHours}h • {disc.priorityBadge}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Micro-topic selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subtópico Camada 3 (Pareto):
                </label>
                <select
                  value={selectedMicroTopicId}
                  onChange={(e) => {
                    setSelectedMicroTopicId(e.target.value);
                    const found = MICRO_TOPICS.find((m) => m.id === e.target.value);
                    if (found) setCustomTitle(found.title);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecione o subtópico...</option>
                  {microTopicsForDisc.map((micro) => (
                    <option key={micro.id} value={micro.id}>
                      [{micro.difficulty}] {micro.title}
                    </option>
                  ))}
                </select>
                {currentMicroTopic && (
                  <p className="mt-1.5 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    💡 <strong>Conceito-Chave Cesgranrio:</strong> {currentMicroTopic.keyConcepts}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Completion & Feedback Form */
            <div className="space-y-4 pt-2 border-t border-slate-800 animate-fadeIn">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-300">
                    Registrar {formatSecondsToDigital(elapsedSeconds)} horas líquidas!
                  </p>
                  <p className="text-slate-300">
                    Isso atualizará seu ticker de matérias estudadas e salvará no histórico.
                  </p>
                </div>
              </div>

              {/* Questions count / Strike rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Questões Feitas:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 20"
                    value={questionsCount}
                    onChange={(e) =>
                      setQuestionsCount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Acertos:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 17"
                    value={correctCount}
                    onChange={(e) =>
                      setCorrectCount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Anotações da sessão / Pontos de atenção:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Revisar regra de juros compostos com taxas equivalentes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompletionForm(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Voltar ao Cronômetro
                </button>
                <button
                  id="timer-save-log-btn"
                  type="button"
                  onClick={handleFinishAndSave}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Confirmar e Salvar Registro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
