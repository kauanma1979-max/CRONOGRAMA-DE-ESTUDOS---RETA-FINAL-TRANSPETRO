import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Search,
  RotateCcw,
  CheckCheck,
  Plus,
  ExternalLink,
  Filter,
  Calendar,
  Layers,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Link2,
  Edit3,
  Trash2,
} from 'lucide-react';
import {
  DAILY_QUESTIONS_50_DAYS,
  TOTAL_SCHEDULE_DAYS,
  TOTAL_SCHEDULE_BLOCKS,
  DailyScheduleDay,
  DailyScheduleBlock,
} from '../data/dailyQuestionsScheduleData';
import { DailyQuestionsState, DisciplineLinks, DisciplineLink, DisciplineId } from '../types';
import { DisciplineLinkModal } from './DisciplineLinkModal';
import { getStoredNavigationState, saveStoredNavigationState } from '../utils/navigationState';

interface DailyQuestionsViewProps {
  dailyQuestionsState: DailyQuestionsState;
  onUpdateDailyQuestionsState: (newState: DailyQuestionsState) => void;
  disciplineLinks?: DisciplineLinks;
  onSaveDisciplineLink?: (topicKey: string, link: DisciplineLink) => void;
  onDeleteDisciplineLink?: (topicKey: string, linkId?: string) => void;
}

export const DailyQuestionsView: React.FC<DailyQuestionsViewProps> = ({
  dailyQuestionsState,
  onUpdateDailyQuestionsState,
  disciplineLinks = {},
  onSaveDisciplineLink,
  onDeleteDisciplineLink,
}) => {
  // Navigation & View Mode with persistent memory
  const savedNav = getStoredNavigationState();
  const [viewMode, setViewMode] = useState<'all' | 'single'>(
    () => savedNav.dailyQuestionsViewMode || 'all'
  );
  const [focusedDay, setFocusedDay] = useState<number>(() => {
    const d = savedNav.dailyQuestionsFocusedDay;
    return typeof d === 'number' && d >= 1 && d <= TOTAL_SCHEDULE_DAYS ? d : 1;
  });
  const [selectedDiscipline, setSelectedDiscipline] = useState<'all' | DisciplineId>(
    () => (savedNav.dailyQuestionsDiscipline as any) || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>(
    () => savedNav.dailyQuestionsStatusFilter || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Synchronize navigation changes to storage
  React.useEffect(() => {
    saveStoredNavigationState({
      dailyQuestionsViewMode: viewMode,
      dailyQuestionsFocusedDay: focusedDay,
      dailyQuestionsDiscipline: selectedDiscipline,
      dailyQuestionsStatusFilter: statusFilter,
    });
  }, [viewMode, focusedDay, selectedDiscipline, statusFilter]);

  // Link modal state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [modalTopicKey, setModalTopicKey] = useState('');
  const [modalTopicTitle, setModalTopicTitle] = useState('');
  const [modalDisciplineId, setModalDisciplineId] = useState<DisciplineId>('logistica');
  const [modalLinkToEdit, setModalLinkToEdit] = useState<DisciplineLink | null>(null);

  const handleOpenLinkModal = (topicKey: string, topicTitle: string, disciplineId: DisciplineId) => {
    setModalTopicKey(topicKey);
    setModalTopicTitle(topicTitle);
    setModalDisciplineId(disciplineId);
    setModalLinkToEdit(null);
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (
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

  const handleDeleteLink = (topicKey: string, linkId: string) => {
    if (onDeleteDisciplineLink) {
      onDeleteDisciplineLink(topicKey, linkId);
    }
  };

  // Toggle single block completed state
  const handleToggleBlock = (blockId: string) => {
    const current = dailyQuestionsState[blockId];
    const isCompleted = current?.completed || false;
    const nextCompleted = !isCompleted;

    const nextState: DailyQuestionsState = {
      ...dailyQuestionsState,
      [blockId]: {
        completed: nextCompleted,
        lastUpdatedAt: Date.now(),
      },
    };

    onUpdateDailyQuestionsState(nextState);
  };

  // Mark all blocks in a single day
  const handleMarkDay = (day: DailyScheduleDay, completed: boolean) => {
    const nextState: DailyQuestionsState = { ...dailyQuestionsState };
    day.blocks.forEach((block) => {
      nextState[block.id] = {
        completed,
        lastUpdatedAt: Date.now(),
      };
    });
    onUpdateDailyQuestionsState(nextState);
  };

  // Reset all
  const handleResetAll = () => {
    onUpdateDailyQuestionsState({});
    setConfirmResetOpen(false);
  };

  // Metrics
  const totalCompletedBlocks = useMemo(() => {
    let count = 0;
    for (const day of DAILY_QUESTIONS_50_DAYS) {
      for (const block of day.blocks) {
        if (dailyQuestionsState[block.id]?.completed) {
          count++;
        }
      }
    }
    return count;
  }, [dailyQuestionsState]);

  const totalCompletedDays = useMemo(() => {
    let count = 0;
    for (const day of DAILY_QUESTIONS_50_DAYS) {
      const isDayDone = day.blocks.every((b) => dailyQuestionsState[b.id]?.completed);
      if (isDayDone) {
        count++;
      }
    }
    return count;
  }, [dailyQuestionsState]);

  const overallProgressPercent = Math.round(
    (totalCompletedBlocks / (TOTAL_SCHEDULE_BLOCKS || 1)) * 100
  );

  const totalLiquidHours = useMemo(() => {
    return Math.round(totalCompletedBlocks * 0.75 * 10) / 10;
  }, [totalCompletedBlocks]);

  // Discipline styling helpers
  const getDisciplineTheme = (disciplineId: DisciplineId) => {
    switch (disciplineId) {
      case 'logistica':
        return {
          label: 'Logística',
          badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          dot: 'bg-sky-400',
        };
      case 'financas':
        return {
          label: 'Finanças',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'processos_adm':
        return {
          label: 'Processos Adm.',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'informatica':
        return {
          label: 'Informática',
          badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
          dot: 'bg-violet-400',
        };
      default:
        return {
          label: 'Geral',
          badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
        };
    }
  };

  // Filtered days list
  const filteredDays = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DAILY_QUESTIONS_50_DAYS.map((day) => {
      // If single day focus mode
      if (viewMode === 'single' && day.dayNumber !== focusedDay) {
        return null;
      }

      // Check blocks matching filters
      const matchingBlocks = day.blocks.filter((block) => {
        const isDone = Boolean(dailyQuestionsState[block.id]?.completed);

        // Status filter
        if (statusFilter === 'pending' && isDone) return false;
        if (statusFilter === 'completed' && !isDone) return false;

        // Discipline filter
        if (selectedDiscipline !== 'all' && block.disciplineId !== selectedDiscipline) {
          return false;
        }

        // Search query filter
        if (query) {
          const matchTitle = block.subtopicTitle.toLowerCase().includes(query);
          const matchDiscipline = block.disciplineName.toLowerCase().includes(query);
          const matchSummary = block.summary.toLowerCase().includes(query);
          return matchTitle || matchDiscipline || matchSummary;
        }

        return true;
      });

      // If search/discipline filtered out all blocks and user is searching, skip day
      if ((query || selectedDiscipline !== 'all' || statusFilter !== 'all') && matchingBlocks.length === 0) {
        return null;
      }

      return {
        ...day,
        blocksToDisplay: matchingBlocks,
      };
    }).filter((d): d is (DailyScheduleDay & { blocksToDisplay: DailyScheduleBlock[] }) => d !== null);
  }, [viewMode, focusedDay, statusFilter, selectedDiscipline, searchQuery, dailyQuestionsState]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Cronograma 50 Dias • Questões Diárias
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  4 Blocos de 45 min (3h/dia)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Cronograma de Questões
                <span className="text-sm sm:text-base font-normal text-slate-400">
                  (50 Dias • 200 Blocos)
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Cada dia é composto por 4 blocos de 45 minutos (3h diárias) com rotatividade equilibrada das matérias. Clique em qualquer card para ticar — ele ficará verde automaticamente ao ser concluído.
              </p>
            </div>

            {/* Overall Progress Gauge Box */}
            <div className="flex items-center gap-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-inner">
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Blocos Ticados
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {totalCompletedBlocks}
                  <span className="text-sm font-semibold text-slate-500">
                    /{TOTAL_SCHEDULE_BLOCKS}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-end gap-2 font-mono">
                  <span>{totalCompletedDays}/50 dias</span>
                  <span>•</span>
                  <span>{totalLiquidHours}h de 150h</span>
                </div>
              </div>

              {/* Circular Gauge Display */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-500 ease-out"
                    strokeDasharray={`${overallProgressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono font-black text-xs sm:text-sm text-white">
                  {overallProgressPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Progresso Total do Cronograma (200 blocos de estudo)</span>
              <span className="font-mono text-emerald-400 font-bold">
                {overallProgressPercent}% Concluído ({TOTAL_SCHEDULE_BLOCKS - totalCompletedBlocks} blocos restantes)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Mode Toggle, Day Jump, Filters and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5">
        {/* Top Control Line: View Mode & Day Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todos os 50 Dias</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'single'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Foco Dia a Dia</span>
            </button>
          </div>

          {/* Quick Day Selector / Stepper */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setFocusedDay((prev) => Math.max(1, prev - 1));
                if (viewMode === 'single') window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={focusedDay <= 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
              title="Dia Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <span className="text-slate-400 font-semibold">Ir para o:</span>
              <select
                value={focusedDay}
                onChange={(e) => {
                  const day = Number(e.target.value);
                  setFocusedDay(day);
                  if (viewMode === 'all') {
                    const el = document.getElementById(`dia_${day}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {DAILY_QUESTIONS_50_DAYS.map((d) => {
                  const doneBlocks = d.blocks.filter((b) => dailyQuestionsState[b.id]?.completed).length;
                  return (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Dia {d.dayNumber} ({doneBlocks}/4 {doneBlocks === 4 ? '✓' : ''})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => {
                setFocusedDay((prev) => Math.min(TOTAL_SCHEDULE_DAYS, prev + 1));
                if (viewMode === 'single') window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={focusedDay >= TOTAL_SCHEDULE_DAYS}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
              title="Próximo Dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Action */}
          <div>
            {confirmResetOpen ? (
              <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-600/50 p-1 rounded-xl text-xs">
                <span className="text-rose-300 px-2 font-medium">Zerar todos os 200 blocos?</span>
                <button
                  onClick={handleResetAll}
                  className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmResetOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                title="Limpar marcações de todo o cronograma"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zerar Cronograma</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Line: Disciplines, Status, Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          {/* Discipline Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 pr-1.5 border-r border-slate-800 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Matérias:
            </span>

            <button
              onClick={() => setSelectedDiscipline('all')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedDiscipline === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>

            <button
              onClick={() => setSelectedDiscipline('logistica')}
              className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedDiscipline === 'logistica'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-sky-300'
              }`}
            >
              Logística
            </button>

            <button
              onClick={() => setSelectedDiscipline('financas')}
              className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedDiscipline === 'financas'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-emerald-300'
              }`}
            >
              Finanças
            </button>

            <button
              onClick={() => setSelectedDiscipline('processos_adm')}
              className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedDiscipline === 'processos_adm'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-amber-300'
              }`}
            >
              Processos Adm.
            </button>

            <button
              onClick={() => setSelectedDiscipline('informatica')}
              className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedDiscipline === 'informatica'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-violet-300'
              }`}
            >
              Informática
            </button>
          </div>

          {/* Status & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Segmented Control */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ticados
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar no cronograma..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Days List / Schedule Grid */}
      <div className="space-y-8">
        {filteredDays.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Nenhum bloco encontrado</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tente alterar os filtros de status, a matéria selecionada ou limpar a busca.
            </p>
            <button
              onClick={() => {
                setViewMode('all');
                setSelectedDiscipline('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
            >
              Restaurar Filtros
            </button>
          </div>
        ) : (
          filteredDays.map((day) => {
            const completedInThisDay = day.blocks.filter(
              (b) => dailyQuestionsState[b.id]?.completed
            ).length;
            const isAllCompletedInDay = completedInThisDay === day.blocks.length;

            return (
              <section
                key={day.dayNumber}
                id={`dia_${day.dayNumber}`}
                className="space-y-3.5 scroll-mt-24"
              >
                {/* Day Header Bar */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3.5 sm:px-5 transition-all border ${
                    isAllCompletedInDay
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/95 border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 px-3 rounded-xl flex items-center justify-center font-black text-sm tracking-tight border ${
                        isAllCompletedInDay
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-amber-500 text-slate-950 border-amber-400'
                      }`}
                    >
                      DIA {day.dayNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                          Dia {day.dayNumber}
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {day.totalDaily} (4 blocos de 45 min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>
                          {completedInThisDay} de {day.blocks.length} blocos ticados
                        </span>
                        <span>•</span>
                        <span
                          className={`font-mono font-bold ${
                            isAllCompletedInDay ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {Math.round((completedInThisDay / day.blocks.length) * 100)}% do dia
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Day Quick Action Button */}
                  <div className="flex items-center gap-2">
                    {isAllCompletedInDay ? (
                      <button
                        onClick={() => handleMarkDay(day, false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Desmarcar Dia</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkDay(day, true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ticar Dia Todo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Blocks Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {day.blocksToDisplay.map((block) => {
                    const itemState = dailyQuestionsState[block.id];
                    const isCompleted = Boolean(itemState?.completed);

                    // Check if discipline links exist for this subtopic or block
                    const blockLinks = disciplineLinks[block.id] || [];
                    const microLinks = disciplineLinks[block.microTopicId] || [];

                    // Combine unique links
                    const seenLinks = new Set<string>();
                    const topicLinks: DisciplineLink[] = [];
                    [...blockLinks, ...microLinks].forEach((l) => {
                      const key = l.id || l.url;
                      if (!seenLinks.has(key)) {
                        seenLinks.add(key);
                        topicLinks.push(l);
                      }
                    });

                    const theme = getDisciplineTheme(block.disciplineId);

                    return (
                      <div
                        key={block.id}
                        onClick={() => handleToggleBlock(block.id)}
                        className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border flex flex-col justify-between cursor-pointer select-none ${
                          isCompleted
                            ? 'bg-emerald-900 border-2 border-emerald-400 text-white shadow-xl shadow-emerald-950/60 ring-1 ring-emerald-400/30'
                            : 'bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Card Top Row: Block & Discipline Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                              Bloco {block.blockIndex} • 45m
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${theme.badge}`}
                            >
                              {theme.label}
                            </span>
                          </div>

                          {/* Subtopic Title */}
                          <h4
                            className={`font-black text-sm leading-snug transition-colors ${
                              isCompleted
                                ? 'text-white'
                                : 'text-slate-100 group-hover:text-amber-300'
                            }`}
                          >
                            {block.subtopicTitle}
                          </h4>

                          {/* Key concepts / summary provided in prompt */}
                          {block.summary && (
                            <p
                              className={`text-xs mt-2.5 leading-relaxed line-clamp-3 ${
                                isCompleted
                                  ? 'text-emerald-100/90 font-medium'
                                  : 'text-slate-400'
                              }`}
                            >
                              {block.summary}
                            </p>
                          )}

                          {/* Links diretos cadastrados no card */}
                          {topicLinks.length > 0 ? (
                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                    isCompleted ? 'text-emerald-200' : 'text-slate-400'
                                  }`}
                                >
                                  <Link2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-300' : 'text-amber-400'}`} />
                                  <span>Links do Card ({topicLinks.length})</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenLinkModal(
                                      block.microTopicId,
                                      block.subtopicTitle,
                                      block.disciplineId
                                    );
                                  }}
                                  className={`text-[11px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                                    isCompleted
                                      ? 'text-emerald-200 hover:text-white'
                                      : 'text-amber-400 hover:text-amber-300'
                                  }`}
                                  title="Adicionar mais um link a este card"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Novo</span>
                                </button>
                              </div>

                              {/* Lista de Links Visíveis no Card */}
                              <div className="space-y-1.5">
                                {topicLinks.map((link) => {
                                  const targetUrl =
                                    link.url.startsWith('http://') || link.url.startsWith('https://')
                                      ? link.url
                                      : `https://${link.url}`;

                                  return (
                                    <div
                                      key={link.id}
                                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all shadow-sm ${
                                        isCompleted
                                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100 hover:border-emerald-400'
                                          : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 text-slate-200'
                                      }`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <a
                                        href={targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className={`flex items-center gap-1.5 text-xs font-bold truncate flex-1 hover:underline ${
                                          isCompleted
                                            ? 'text-emerald-200 hover:text-white'
                                            : 'text-amber-300 hover:text-amber-200'
                                        }`}
                                        title={`Abrir link: ${targetUrl}`}
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                        <span className="truncate">{link.title || link.url}</span>
                                      </a>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEditLink(
                                              block.microTopicId,
                                              block.subtopicTitle,
                                              block.disciplineId,
                                              link
                                            );
                                          }}
                                          className={`p-1 rounded-lg text-xs transition-colors ${
                                            isCompleted
                                              ? 'hover:bg-emerald-800 text-emerald-300 hover:text-white'
                                              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                          }`}
                                          title="Editar este link"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLink(block.microTopicId, link.id);
                                            if (block.id) handleDeleteLink(block.id, link.id);
                                          }}
                                          className={`p-1 rounded-lg text-xs transition-colors ${
                                            isCompleted
                                              ? 'hover:bg-rose-950/80 text-emerald-300 hover:text-rose-300'
                                              : 'hover:bg-rose-950/50 text-slate-400 hover:text-rose-400'
                                          }`}
                                          title="Excluir este link"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenLinkModal(
                                    block.microTopicId,
                                    block.subtopicTitle,
                                    block.disciplineId
                                  );
                                }}
                                className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold border border-dashed flex items-center justify-center gap-1.5 transition-all ${
                                  isCompleted
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 hover:text-white hover:border-emerald-400'
                                    : 'bg-slate-950/50 border-slate-700/80 text-slate-400 hover:text-amber-300 hover:border-amber-500/50 hover:bg-slate-950'
                                }`}
                                title="Inserir link para este tema"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Inserir Link no Card</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Card Bottom Action Row: Ticar Button & Link Status */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          {/* Check Action Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBlock(block.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                              isCompleted
                                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 hover:bg-emerald-300'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                            }`}
                            title={isCompleted ? 'Desmarcar bloco' : 'Ticar bloco concluído'}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400" />
                                <span>TICADO</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                                <span>TICAR</span>
                              </>
                            )}
                          </button>

                          {/* Quick link indicator / trigger */}
                          {topicLinks.length > 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLinkModal(
                                  block.microTopicId,
                                  block.subtopicTitle,
                                  block.disciplineId
                                );
                              }}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-950/90 hover:bg-emerald-950 text-emerald-200 border border-emerald-400/60 shadow-sm'
                                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                              title="Gerenciar links deste tema"
                            >
                              <Link2 className="w-3.5 h-3.5 text-current" />
                              <span>{topicLinks.length} {topicLinks.length === 1 ? 'Link' : 'Links'}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Sem links</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>

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
