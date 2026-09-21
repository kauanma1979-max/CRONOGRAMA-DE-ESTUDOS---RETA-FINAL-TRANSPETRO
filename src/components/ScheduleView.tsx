import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  Play,
  Flame,
  BookOpen,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { StudySession, DisciplineId } from '../types';
import { DISCIPLINES, MICRO_TOPICS } from '../data/paretoData';
import {
  formatDateBrExtended,
  WEEKDAY_NAMES_PT,
  formatMinutes,
} from '../utils/scheduleGenerator';

interface ScheduleViewProps {
  sessions: StudySession[];
  onToggleSessionCompleted: (sessionId: string) => void;
  onStartSessionTimer: (session: StudySession) => void;
  completedTopicIds: string[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  sessions,
  onToggleSessionCompleted,
  onStartSessionTimer,
  completedTopicIds,
}) => {
  // Get all unique dates
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(sessions.map((s) => s.date))).sort();
    return dates;
  }, [sessions]);

  // Selected date state (defaults to first date: 2026-09-21)
  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0] || '2026-09-21');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [filterDiscipline, setFilterDiscipline] = useState<DisciplineId | 'all'>('all');

  // Keep selectedDate in sync if uniqueDates updates
  useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDate)) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  // Find index of selected date
  const selectedDateIdx = uniqueDates.indexOf(selectedDate);

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const map: Record<string, StudySession[]> = {};
    sessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [sessions]);

  // Current day's sessions
  const currentDaySessions = useMemo(() => {
    const daySessions = sessionsByDate[selectedDate] || [];
    if (filterDiscipline === 'all') return daySessions;
    return daySessions.filter((s) => s.disciplineId === filterDiscipline);
  }, [sessionsByDate, selectedDate, filterDiscipline]);

  // Current week's 7 days (Monday to Sunday containing the selected date)
  const currentWeekDays = useMemo(() => {
    if (!selectedDate) return [];
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay(); // 0 is Sun, 1 is Mon...
    // Calculate distance to Monday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const weekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const wDate = new Date(monday);
      wDate.setDate(monday.getDate() + i);
      const str = `${wDate.getFullYear()}-${String(wDate.getMonth() + 1).padStart(2, '0')}-${String(wDate.getDate()).padStart(2, '0')}`;
      if (uniqueDates.includes(str)) {
        weekDays.push(str);
      }
    }
    return weekDays;
  }, [selectedDate, uniqueDates]);

  // Navigation handlers
  const handlePrevDay = () => {
    if (selectedDateIdx > 0) {
      setSelectedDate(uniqueDates[selectedDateIdx - 1]);
    }
  };

  const handleNextDay = () => {
    if (selectedDateIdx < uniqueDates.length - 1) {
      setSelectedDate(uniqueDates[selectedDateIdx + 1]);
    }
  };

  const handleJumpToNextPending = () => {
    const nextPending = sessions.find((s) => !s.completed);
    if (nextPending && uniqueDates.includes(nextPending.date)) {
      setSelectedDate(nextPending.date);
    }
  };

  // Day stats
  const totalTargetMin = currentDaySessions.reduce((acc, s) => acc + s.targetMinutes, 0);
  const completedTargetMin = currentDaySessions
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + s.targetMinutes, 0);
  const isSunday = new Date(selectedDate.replace(/-/g, '/')).getDay() === 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Schedule Rules & Highlights */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Regra 80/20 Cesgranrio
              </span>
              <span className="text-xs text-slate-400 font-mono">
                21/09/2026 a 05/12/2026 (76 dias)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cronograma de Rodízio Semanal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-amber-400">Todos os dias (20:00 às 23:00):</strong> 3 horas de estudo (2 matérias de 1h30 com os subtópicos do Pareto).{' '}
              <strong className="text-emerald-400">Domingos:</strong> Cronograma normal de subtópicos das 20:00 às 23:00 (com disponibilidade de mais horas).{' '}
              <strong className="text-pink-400">Português e Matemática:</strong> 2x por semana cada (18:00 às 19:00), em dias alternados.
            </p>
          </div>

          {/* Jump Buttons & View Mode Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={handleJumpToNextPending}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Próxima Sessão Pendente</span>
            </button>

            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'daily'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visão Diária
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visão Semanal (7 Dias)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            disabled={selectedDateIdx <= 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-colors"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
              {formatDateBrExtended(selectedDate)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Dia {selectedDateIdx + 1} de {uniqueDates.length} ({selectedDate})
              {isSunday && (
                <span className="ml-2 px-1.5 py-0.2 text-[10px] bg-sky-500/20 text-sky-300 rounded font-semibold">
                  Domingo (Subtópicos)
                </span>
              )}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            disabled={selectedDateIdx >= uniqueDates.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-colors"
            title="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Discipline filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          <button
            onClick={() => setFilterDiscipline('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterDiscipline === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas
          </button>
          {DISCIPLINES.map((d) => (
            <button
              key={d.id}
              onClick={() => setFilterDiscipline(d.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterDiscipline === d.id
                  ? `${d.bgColor} ${d.textColor} border ${d.borderColor}`
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE: DAILY */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Day Progress Strip */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Progresso do Dia:</span>
              <strong className="text-white">
                {formatMinutes(completedTargetMin)} / {formatMinutes(totalTargetMin)}
              </strong>
            </div>
            <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${totalTargetMin > 0 ? (completedTargetMin / totalTargetMin) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Session Cards for the Day */}
          <div className="space-y-3">
            {currentDaySessions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-sm">
                Nenhuma sessão encontrada para este filtro no dia selecionado.
              </div>
            ) : (
              currentDaySessions.map((session) => {
                const disc = DISCIPLINES.find((d) => d.id === session.disciplineId);
                const micro = MICRO_TOPICS.find((m) => m.id === session.microTopicId);
                const isBasic = session.type === 'basic';
                const isSundayRev = session.type === 'sunday_review';

                return (
                  <div
                    key={session.id}
                    id={`session-card-${session.id}`}
                    className={`relative rounded-2xl border transition-all duration-200 p-5 ${
                      session.completed
                        ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Ticker checkbox + Time Slot + Title */}
                      <div className="flex items-start gap-3.5">
                        {/* Ticker Checkbox Button */}
                        <button
                          type="button"
                          id={`ticker-check-${session.id}`}
                          onClick={() => onToggleSessionCompleted(session.id)}
                          className={`mt-0.5 p-1 rounded-xl transition-transform active:scale-90 ${
                            session.completed
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-slate-500 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800'
                          }`}
                          title={session.completed ? 'Marcar como não estudada' : 'Marcar como estudada'}
                        >
                          {session.completed ? (
                            <CheckSquare className="w-6 h-6" />
                          ) : (
                            <Square className="w-6 h-6" />
                          )}
                        </button>

                        <div>
                          {/* Badges: Time + Type + Discipline */}
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 ${
                                isBasic
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                  : isSundayRev
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {session.timeSlot}
                            </span>

                            {disc && (
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${disc.bgColor} ${disc.textColor} ${disc.borderColor}`}
                              >
                                {disc.shortName}
                              </span>
                            )}

                            {isBasic && (
                              <span className="text-[11px] font-medium text-slate-400">
                                (2x/semana • 1h)
                              </span>
                            )}

                            {isSundayRev && (
                              <span className="text-[11px] font-bold text-emerald-400">
                                [Revisão de Domingo]
                              </span>
                            )}

                            {micro && (
                              <span className="text-[11px] font-medium text-slate-400">
                                Dificuldade: {micro.difficulty}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3
                            className={`text-base sm:text-lg font-bold leading-tight ${
                              session.completed
                                ? 'text-slate-300 line-through decoration-emerald-500/60'
                                : 'text-white'
                            }`}
                          >
                            {session.title}
                          </h3>

                          {/* Subtitle / Key Concepts */}
                          {session.subtitle && (
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                              💡 <strong>Foco Cesgranrio:</strong> {session.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Stopwatch Trigger & Status */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          id={`start-timer-btn-${session.id}`}
                          type="button"
                          onClick={() => onStartSessionTimer(session)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-amber-500 font-bold text-xs flex items-center gap-2 transition-all shadow-md group"
                          title="Abrir no cronômetro de horas líquidas"
                        >
                          <Play className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950 fill-current" />
                          <span>Iniciar Cronômetro</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE: WEEKLY */}
      {viewMode === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentWeekDays.map((dateStr) => {
              const [y, m, d] = dateStr.split('-').map(Number);
              const dateObj = new Date(y, m - 1, d);
              const dayOfWeek = dateObj.getDay();
              const isCurrentSelected = dateStr === selectedDate;
              const daySessions = sessionsByDate[dateStr] || [];
              const isSun = dayOfWeek === 0;

              const completedInDay = daySessions.filter((s) => s.completed).length;
              const totalInDay = daySessions.length;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                    isCurrentSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Day Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {WEEKDAY_NAMES_PT[dayOfWeek]}
                        </div>
                        <div className="text-sm font-extrabold text-white">
                          {d} / {m}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${
                          completedInDay === totalInDay && totalInDay > 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {completedInDay}/{totalInDay}
                      </span>
                    </div>

                    {/* Slots List in Week Card */}
                    <div className="space-y-2">
                      {daySessions.map((s) => {
                        const disc = DISCIPLINES.find((item) => item.id === s.disciplineId);
                        return (
                          <div
                            key={s.id}
                            className={`p-2 rounded-xl text-xs border ${
                              s.completed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                                : 'bg-slate-950/80 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-mono text-[10px] font-bold text-amber-400">
                                {s.timeSlot}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleSessionCompleted(s.id);
                                }}
                                className="text-slate-400 hover:text-emerald-400"
                                title="Alternar conclusão"
                              >
                                {s.completed ? (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="font-semibold truncate">{s.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{daySessions.length > 2 ? '4h (1h Básica + 3h Subtópicos)' : '3h de Subtópicos'}</span>
                    <span className="text-amber-400 font-semibold">Ver detalhes &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
