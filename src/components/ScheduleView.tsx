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
  Search,
  X,
  Sunrise,
  Sun,
  Moon,
  Zap,
  Target,
  Link2,
  ExternalLink,
  Edit3,
  Trash2,
  Plus,
} from 'lucide-react';
import { StudySession, DisciplineId, DisciplineLinks, DisciplineLink } from '../types';
import { DISCIPLINES, MICRO_TOPICS } from '../data/paretoData';
import {
  formatDateBrExtended,
  WEEKDAY_NAMES_PT,
  formatMinutes,
  RETA_FINAL_DATES,
  RETA_FINAL_CONFIG,
} from '../utils/scheduleGenerator';
import { DisciplineLinkModal } from './DisciplineLinkModal';

interface ScheduleViewProps {
  sessions: StudySession[];
  onToggleSessionCompleted: (sessionId: string) => void;
  onStartSessionTimer: (session: StudySession) => void;
  completedTopicIds: string[];
  initialViewMode?: 'daily' | 'weekly' | 'reta_final';
  onViewModeChange?: (mode: 'daily' | 'weekly' | 'reta_final') => void;
  disciplineLinks?: DisciplineLinks;
  onSaveDisciplineLink?: (topicKey: string, link: DisciplineLink) => void;
  onDeleteDisciplineLink?: (topicKey: string, linkId?: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  sessions,
  onToggleSessionCompleted,
  onStartSessionTimer,
  completedTopicIds,
  initialViewMode,
  onViewModeChange,
  disciplineLinks,
  onSaveDisciplineLink,
  onDeleteDisciplineLink,
}) => {
  // Get all unique dates
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(sessions.map((s) => s.date))).sort();
    return dates;
  }, [sessions]);

  // Helper to get today's date in YYYY-MM-DD
  const getTodayDateStr = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = useMemo(() => getTodayDateStr(), []);

  // Selected date state (defaults to today if in range, otherwise first date: 2026-09-21)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (initialViewMode === 'reta_final') return '2026-11-28';
    const today = getTodayDateStr();
    if (uniqueDates.includes(today)) return today;
    return uniqueDates[0] || '2026-09-21';
  });
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'reta_final'>(
    initialViewMode || 'daily'
  );
  const [filterDiscipline, setFilterDiscipline] = useState<DisciplineId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [retaFinalLayout, setRetaFinalLayout] = useState<'single_day' | 'all_days'>('single_day');
  const [modalTopicKey, setModalTopicKey] = useState<string | null>(null);
  const [modalTopicTitle, setModalTopicTitle] = useState<string>('');
  const [modalDisciplineId, setModalDisciplineId] = useState<DisciplineId | null>(null);
  const [modalLinkToEdit, setModalLinkToEdit] = useState<DisciplineLink | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleOpenAddLinkModal = (
    topicKey: string,
    topicTitle: string,
    disciplineId: DisciplineId
  ) => {
    setModalTopicKey(topicKey);
    setModalTopicTitle(topicTitle);
    setModalDisciplineId(disciplineId);
    setModalLinkToEdit(null);
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLinkModal = (
    topicKey: string,
    topicTitle: string,
    disciplineId: DisciplineId,
    link: DisciplineLink
  ) => {
    setModalTopicKey(topicKey);
    setModalTopicTitle(topicTitle);
    setModalDisciplineId(disciplineId);
    setModalLinkToEdit(link);
    setIsLinkModalOpen(true);
  };

  // Sync viewMode with initialViewMode prop when it changes
  useEffect(() => {
    if (initialViewMode && initialViewMode !== viewMode) {
      setViewMode(initialViewMode);
      if (initialViewMode === 'reta_final' && !RETA_FINAL_DATES.includes(selectedDate)) {
        setSelectedDate('2026-11-28');
      }
    }
  }, [initialViewMode]);

  const switchViewMode = (mode: 'daily' | 'weekly' | 'reta_final') => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  // Keep selectedDate in sync if uniqueDates updates
  useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDate)) {
      const today = getTodayDateStr();
      if (uniqueDates.includes(today)) {
        setSelectedDate(today);
      } else {
        setSelectedDate(uniqueDates[0]);
      }
    }
  }, [uniqueDates, selectedDate]);

  // Handler to switch to Daily view and automatically jump to the current day
  const handleSelectDailyView = () => {
    switchViewMode('daily');
    const today = getTodayDateStr();
    if (uniqueDates.includes(today)) {
      setSelectedDate(today);
    } else {
      const nextPending = sessions.find((s) => !s.completed);
      if (nextPending && uniqueDates.includes(nextPending.date)) {
        setSelectedDate(nextPending.date);
      } else if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }
    }
  };

  // Handler to jump directly to today
  const handleGoToToday = () => {
    const today = getTodayDateStr();
    if (uniqueDates.includes(today)) {
      setSelectedDate(today);
    }
  };

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

  // Reta Final sessions (28/11/2026 to 04/12/2026: 42 hours)
  const retaFinalSessions = useMemo(() => {
    return sessions.filter((s) => s.type === 'reta_final' || RETA_FINAL_DATES.includes(s.date));
  }, [sessions]);

  const retaFinalActiveDate = useMemo(() => {
    if (RETA_FINAL_DATES.includes(selectedDate)) return selectedDate;
    return '2026-11-28';
  }, [selectedDate]);

  const retaFinalDaySessions = useMemo(() => {
    return sessionsByDate[retaFinalActiveDate] || [];
  }, [sessionsByDate, retaFinalActiveDate]);

  const morningSessions = useMemo(() => {
    return retaFinalDaySessions.filter(
      (s) => s.shift === 'manha' || s.timeSlot.startsWith('09') || s.timeSlot.startsWith('10')
    );
  }, [retaFinalDaySessions]);

  const afternoonSessions = useMemo(() => {
    return retaFinalDaySessions.filter(
      (s) => s.shift === 'tarde' || s.timeSlot.startsWith('14') || s.timeSlot.startsWith('15')
    );
  }, [retaFinalDaySessions]);

  const nightSessions = useMemo(() => {
    return retaFinalDaySessions.filter(
      (s) => s.shift === 'noite' || s.timeSlot.startsWith('20') || s.timeSlot.startsWith('21')
    );
  }, [retaFinalDaySessions]);

  const totalRetaFinalCompleted = useMemo(() => {
    return retaFinalSessions.filter((s) => s.completed).length;
  }, [retaFinalSessions]);

  // Global search matches across the whole 76-day calendar
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchSub = s.subtitle ? s.subtitle.toLowerCase().includes(q) : false;
      const disc = DISCIPLINES.find((d) => d.id === s.disciplineId);
      const matchDisc = disc ? disc.name.toLowerCase().includes(q) || disc.shortName.toLowerCase().includes(q) : false;
      return matchTitle || matchSub || matchDisc;
    });
  }, [sessions, searchQuery]);

  const matchDates = useMemo(() => {
    return Array.from(new Set(searchMatches.map((s) => s.date))).sort();
  }, [searchMatches]);

  // Current day's sessions filtered by discipline and search query
  const currentDaySessions = useMemo(() => {
    let daySessions = sessionsByDate[selectedDate] || [];
    if (filterDiscipline !== 'all') {
      daySessions = daySessions.filter((s) => s.disciplineId === filterDiscipline);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      daySessions = daySessions.filter((s) => {
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchSub = s.subtitle ? s.subtitle.toLowerCase().includes(q) : false;
        const disc = DISCIPLINES.find((d) => d.id === s.disciplineId);
        const matchDisc = disc ? disc.name.toLowerCase().includes(q) || disc.shortName.toLowerCase().includes(q) : false;
        return matchTitle || matchSub || matchDisc;
      });
    }
    return daySessions;
  }, [sessionsByDate, selectedDate, filterDiscipline, searchQuery]);

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

  const getSessionTopicInfo = (session: StudySession) => {
    const topicKey = session.microTopicId || session.disciplineId;
    const disc = DISCIPLINES.find((d) => d.id === session.disciplineId);
    const micro = session.microTopicId
      ? MICRO_TOPICS.find((m) => m.id === session.microTopicId)
      : undefined;
    const topicTitle = micro?.title || session.title;
    return { topicKey, topicTitle, disc };
  };

  const renderDisciplineLinkSection = (session: StudySession) => {
    const { topicKey, topicTitle, disc } = getSessionTopicInfo(session);
    const links = disciplineLinks?.[topicKey] || [];

    if (links.length === 0) {
      return (
        <div className="mt-2 flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenAddLinkModal(topicKey, topicTitle, session.disciplineId);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-dashed border-slate-700/80 hover:border-amber-500/50 transition-all group active:scale-95 shadow-sm"
            title={`Inserir link para o subtópico: ${topicTitle}`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>+ Inserir Link do Subtópico</span>
          </button>
        </div>
      );
    }

    return (
      <div className="mt-2.5 space-y-1.5">
        {/* Lista de Links do Subtópico */}
        <div className="space-y-1.5">
          {links.map((link, idx) => {
            const targetUrl =
              link.url.startsWith('http://') || link.url.startsWith('https://')
                ? link.url
                : `https://${link.url}`;
            return (
              <div
                key={link.id || idx}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700/80 transition-all flex flex-wrap items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <Link2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 hover:underline inline-flex items-center gap-1 max-w-full"
                      title={`Abrir link: ${targetUrl}`}
                    >
                      <span className="truncate">{link.title || link.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                    </a>
                    {link.title && (
                      <span className="text-[10px] text-slate-400 block truncate font-mono">
                        {targetUrl}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditLinkModal(topicKey, topicTitle, session.disciplineId, link);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1"
                    title="Editar este link"
                  >
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px]">Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteDisciplineLink) {
                        onDeleteDisciplineLink(topicKey, link.id);
                      }
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors text-xs"
                    title="Excluir este link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão para inserir quantos links forem necessários no subtópico */}
        <div className="pt-0.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenAddLinkModal(topicKey, topicTitle, session.disciplineId);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-dashed border-amber-500/30 hover:border-amber-500/60 transition-all active:scale-95 group shadow-sm"
            title={`Inserir mais um link para este subtópico`}
          >
            <Plus className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>+ Adicionar outro Link</span>
          </button>

          <span className="text-[10px] text-slate-400">
            {links.length} {links.length === 1 ? 'link sincronizado' : 'links sincronizados'} neste subtópico
          </span>
        </div>
      </div>
    );
  };

  const renderRetaFinalCard = (session: StudySession) => {
    const disc = DISCIPLINES.find((d) => d.id === session.disciplineId);
    return (
      <div
        key={session.id}
        id={`rf-session-${session.id}`}
        className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
          session.completed
            ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
        }`}
      >
        <div className="space-y-2.5">
          {/* Header with Checkbox + Time + Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id={`rf-check-${session.id}`}
                onClick={() => onToggleSessionCompleted(session.id)}
                className={`p-1 rounded-xl transition-transform active:scale-90 ${
                  session.completed
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-500 hover:text-amber-400 bg-slate-800'
                }`}
                title={session.completed ? 'Marcar como não estudada' : 'Marcar como estudada'}
              >
                {session.completed ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {session.timeSlot}
              </span>

              <span className="text-[11px] font-bold text-slate-400 font-mono">
                1 hora
              </span>
            </div>

            {disc && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${disc.bgColor} ${disc.textColor} ${disc.borderColor}`}
              >
                {disc.shortName}
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className={`text-sm sm:text-base font-bold leading-snug ${
              session.completed
                ? 'text-slate-300 line-through decoration-emerald-500/60'
                : 'text-white'
            }`}
          >
            {session.title}
          </h4>

          {/* Subtitle / Focus */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
            💡 <strong>Foco Cesgranrio:</strong> {session.subtitle || 'Revisão intensiva de questões estilo Cesgranrio.'}
          </p>

          {/* Link do Subtópico / Tema (Logo abaixo de Foco Cesgranrio) */}
          {renderDisciplineLinkSection(session)}
        </div>

        {/* Footer with Timer Launch Button */}
        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            Meta: 60 minutos
          </span>

          <button
            type="button"
            id={`rf-timer-${session.id}`}
            onClick={() => onStartSessionTimer(session)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-amber-500 font-bold text-xs flex items-center gap-1.5 transition-all shadow group"
            title="Iniciar cronômetro de 60 minutos"
          >
            <Play className="w-3 h-3 text-amber-400 group-hover:text-slate-950 fill-current" />
            <span>Cronômetro (60min)</span>
          </button>
        </div>
      </div>
    );
  };

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

            <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs gap-1">
              <button
                id="btn-view-mode-daily"
                type="button"
                onClick={handleSelectDailyView}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'daily'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Abrir Visão Diária no dia atual"
              >
                <span>Visão Diária</span>
                {selectedDate === todayStr && viewMode === 'daily' && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-slate-950 text-amber-300 rounded">
                    Hoje
                  </span>
                )}
              </button>

              <button
                id="btn-view-mode-weekly"
                type="button"
                onClick={() => switchViewMode('weekly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visão Semanal (7 Dias)
              </button>

              <button
                id="btn-view-mode-reta-final"
                type="button"
                onClick={() => {
                  switchViewMode('reta_final');
                  if (!RETA_FINAL_DATES.includes(selectedDate)) {
                    setSelectedDate('2026-11-28');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'reta_final'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                }`}
                title="Aba específica de estudos: 28/11 até 04/12 (6 matérias/dia • 1h cada)"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Reta Final (28/11 a 04/12)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-950/70 text-amber-300 font-mono font-black">
                  6h/dia
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigator Bar & Search Bar (Daily & Weekly Views) */}
      {viewMode !== 'reta_final' && (
        <>
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
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                    {formatDateBrExtended(selectedDate)}
                  </span>
                  {selectedDate === todayStr && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-full shadow-sm">
                      Hoje
                    </span>
                  )}
                </div>
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

              {/* Quick jump to Today button */}
              <button
                type="button"
                onClick={handleGoToToday}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ml-1 ${
                  selectedDate === todayStr
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Ir para o dia atual (Hoje)"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoje</span>
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

          {/* Search Bar & Date Match Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 px-4 space-y-2.5">
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar no cronograma (ex: Transporte, Armazenagem, WMS, ANTT, Curva ABC, Licitações)..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title="Limpar pesquisa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Global Search Results Navigation Strip */}
            {searchQuery.trim() && (
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-300">
                  {matchDates.length > 0 ? (
                    <>
                      Encontradas <strong className="text-amber-400">{searchMatches.length} sessões</strong> em{' '}
                      <strong className="text-white">{matchDates.length} dias</strong> para &ldquo;{searchQuery}&rdquo;:
                    </>
                  ) : (
                    <span className="text-slate-400">Nenhuma sessão encontrada para &ldquo;{searchQuery}&rdquo;.</span>
                  )}
                </div>
                {matchDates.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Pular para:</span>
                    {matchDates.slice(0, 10).map((dStr) => {
                      const [y, m, d] = dStr.split('-').map(Number);
                      const isSel = dStr === selectedDate;
                      return (
                        <button
                          key={dStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dStr);
                            switchViewMode('daily');
                          }}
                          className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
                            isSel
                              ? 'bg-amber-500 text-slate-950 font-black ring-1 ring-amber-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                          title={`Ver cronograma do dia ${d}/${m}`}
                        >
                          <span>{d}/{m}</span>
                          {dStr === todayStr && <span className="text-[8px] bg-emerald-500 text-slate-950 px-1 rounded font-black">HOJE</span>}
                        </button>
                      );
                    })}
                    {matchDates.length > 10 && (
                      <span className="text-slate-500 text-[11px] self-center">+{matchDates.length - 10} dias</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

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
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-sm space-y-3">
                <p>Nenhuma sessão encontrada para este filtro no dia selecionado ({selectedDate}).</p>
                {searchQuery.trim() && matchDates.length > 0 && (
                  <div className="text-xs pt-1">
                    O assunto <strong className="text-amber-400">&ldquo;{searchQuery}&rdquo;</strong> está programado nos seguintes dias:
                    <div className="flex justify-center flex-wrap gap-2 mt-2">
                      {matchDates.slice(0, 6).map((dStr) => {
                        const [y, m, d] = dStr.split('-').map(Number);
                        return (
                          <button
                            key={dStr}
                            type="button"
                            onClick={() => setSelectedDate(dStr)}
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>Ir para {d}/{m} &rarr;</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                            💡 <strong>Foco Cesgranrio:</strong>{' '}
                            {session.subtitle ||
                              (session.disciplineId === 'portugues'
                                ? 'Gramática aplicada, interpretação de texto e estilo da banca Cesgranrio.'
                                : session.disciplineId === 'matematica'
                                ? 'Raciocínio lógico, porcentagem, matemática financeira e questões Cesgranrio.'
                                : 'Revisão direcionada e resolução de questões Cesgranrio.')}
                          </p>

                          {/* Link do Subtópico / Tema (Logo abaixo de Foco Cesgranrio) */}
                          {renderDisciplineLinkSection(session)}
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

      {/* VIEW MODE: RETA FINAL (28/11/2026 a 04/12/2026) */}
      {viewMode === 'reta_final' && (
        <div className="space-y-6">
          {/* Hero Banner for Reta Final */}
          <div className="bg-gradient-to-br from-rose-950/70 via-slate-900 to-amber-950/40 border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Semana de Reta Final Transpetro
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                    28/11 a 04/12/2026 (7 Dias)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    42 Horas Líquidas
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  Revisão Intensiva 80/20: 6 Matérias por Dia (1h cada)
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Cronograma estruturado em 3 blocos diários com foco total nas matérias específicas do edital (Logística, Finanças, Processos Adm. e Informática — sem Português e Matemática):
                  <br />
                  🌅 <strong className="text-amber-300">Manhã (09:00 às 11:00)</strong>: 2 horas de estudo intensivo •{' '}
                  ☀️ <strong className="text-sky-300">Tarde (14:00 às 16:00)</strong>: 2 horas de estudo intensivo •{' '}
                  🌙 <strong className="text-indigo-300">Noite (20:00 às 22:00)</strong>: 2 horas de estudo e questões.
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-4 min-w-[240px] text-center space-y-2 shrink-0 shadow-lg">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Progresso da Reta Final
                </span>
                <div className="text-3xl font-black text-white font-mono flex items-center justify-center gap-1.5">
                  <span className="text-emerald-400">{totalRetaFinalCompleted}</span>
                  <span className="text-slate-500 text-xl font-normal">/</span>
                  <span>{retaFinalSessions.length || 42}</span>
                  <span className="text-xs text-slate-400 font-sans font-semibold">sessões (h)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${retaFinalSessions.length > 0 ? (totalRetaFinalCompleted / retaFinalSessions.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  {Math.round(retaFinalSessions.length > 0 ? (totalRetaFinalCompleted / retaFinalSessions.length) * 100 : 0)}% das 42h concluídas
                </div>
              </div>
            </div>

            {/* Pareto Distribution Chips */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Distribuição Pareto de Horas na Reta Final (42h):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 font-bold">
                  Logística: 18h (43%) • Top 1
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  Finanças: 9h (21%)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  Processos Adm.: 9h (21%)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/30 font-medium">
                  Informática: 6h (14%)
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Day Switcher Strip & Layout Toggle */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-400" /> Selecione o dia da Reta Final:
              </span>

              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setRetaFinalLayout('single_day')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    retaFinalLayout === 'single_day'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Foco no Dia
                </button>
                <button
                  type="button"
                  onClick={() => setRetaFinalLayout('all_days')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    retaFinalLayout === 'all_days'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Grade dos 7 Dias
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {RETA_FINAL_DATES.map((dStr, idx) => {
                const [y, m, d] = dStr.split('-').map(Number);
                const dateObj = new Date(y, m - 1, d);
                const dayOfWeek = dateObj.getDay();
                const isSelected = dStr === retaFinalActiveDate && retaFinalLayout === 'single_day';
                const daySessions = sessionsByDate[dStr] || [];
                const dayCompleted = daySessions.filter((s) => s.completed).length;
                const isToday = dStr === todayStr;

                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dStr);
                      setRetaFinalLayout('single_day');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Dia {idx + 1} • {WEEKDAY_NAMES_PT[dayOfWeek].slice(0, 3)}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-emerald-500 text-slate-950 rounded">
                          Hoje
                        </span>
                      )}
                    </div>
                    <div className="text-base font-black text-white mb-2">
                      {d}/{m}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">6h</span>
                      <span
                        className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          dayCompleted === 6
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : dayCompleted > 0
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {dayCompleted}/6
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LAYOUT 1: SINGLE DAY FOCUS */}
          {retaFinalLayout === 'single_day' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {formatDateBrExtended(retaFinalActiveDate)}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Dia {RETA_FINAL_DATES.indexOf(retaFinalActiveDate) + 1} de 7
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      6 matérias de 1 hora cada (total de 6 horas líquidas hoje)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Progresso do dia:</span>
                  <strong className="text-white font-mono text-sm">
                    {retaFinalDaySessions.filter((s) => s.completed).length} / 6 matérias concluídas
                  </strong>
                </div>
              </div>

              {/* Shift 1: MANHÃ (09:00 às 11:00) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sunrise className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                    Bloco da Manhã (09:00 às 11:00) • 2 Horas de Estudo
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {morningSessions.map((session) => renderRetaFinalCard(session))}
                </div>
              </div>

              {/* Shift 2: TARDE (14:00 às 16:00) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    <Sun className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                    Bloco da Tarde (14:00 às 16:00) • 2 Horas de Estudo
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {afternoonSessions.map((session) => renderRetaFinalCard(session))}
                </div>
              </div>

              {/* Shift 3: NOITE (20:00 às 22:00) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Moon className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Bloco da Noite (20:00 às 22:00) • 2 Horas de Estudo & Questões
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nightSessions.map((session) => renderRetaFinalCard(session))}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT 2: ALL 7 DAYS FULL GRID */}
          {retaFinalLayout === 'all_days' && (
            <div className="space-y-6">
              {RETA_FINAL_DATES.map((dStr, idx) => {
                const daySessions = sessionsByDate[dStr] || [];
                const mSessions = daySessions.filter(
                  (s) => s.shift === 'manha' || s.timeSlot.startsWith('09') || s.timeSlot.startsWith('10')
                );
                const aSessions = daySessions.filter(
                  (s) => s.shift === 'tarde' || s.timeSlot.startsWith('14') || s.timeSlot.startsWith('15')
                );
                const nSessions = daySessions.filter(
                  (s) => s.shift === 'noite' || s.timeSlot.startsWith('20') || s.timeSlot.startsWith('21')
                );
                const completedInDay = daySessions.filter((s) => s.completed).length;

                return (
                  <div
                    key={dStr}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase">
                          Dia {idx + 1}
                        </span>
                        <h3 className="text-lg font-black text-white">
                          {formatDateBrExtended(dStr)}
                        </h3>
                        {dStr === todayStr && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-500 text-slate-950 rounded">
                            Hoje
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-amber-300">
                        {completedInDay}/6 matérias estudadas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Manhã */}
                      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        <div className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-2">
                          <Sunrise className="w-3.5 h-3.5" /> Manhã (09:00 - 11:00)
                        </div>
                        {mSessions.map((s) => renderRetaFinalCard(s))}
                      </div>

                      {/* Tarde */}
                      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        <div className="text-xs font-bold text-sky-300 flex items-center gap-1 mb-2">
                          <Sun className="w-3.5 h-3.5" /> Tarde (14:00 - 16:00)
                        </div>
                        {aSessions.map((s) => renderRetaFinalCard(s))}
                      </div>

                      {/* Noite */}
                      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        <div className="text-xs font-bold text-indigo-300 flex items-center gap-1 mb-2">
                          <Moon className="w-3.5 h-3.5" /> Noite (20:00 - 22:00)
                        </div>
                        {nSessions.map((s) => renderRetaFinalCard(s))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal para Inserção, Edição e Exclusão de Links do Subtópico / Tema */}
      <DisciplineLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setModalLinkToEdit(null);
        }}
        topicKey={modalTopicKey}
        topicTitle={modalTopicTitle}
        disciplineId={modalDisciplineId}
        linkToEdit={modalLinkToEdit}
        existingLinks={modalTopicKey && disciplineLinks ? disciplineLinks[modalTopicKey] || [] : []}
        onSave={(key, link) => {
          if (onSaveDisciplineLink) {
            onSaveDisciplineLink(key, link);
          }
        }}
        onDelete={(key, linkId) => {
          if (onDeleteDisciplineLink) {
            onDeleteDisciplineLink(key, linkId);
          }
        }}
        onSelectLinkToEdit={(link) => setModalLinkToEdit(link)}
      />
    </div>
  );
};
