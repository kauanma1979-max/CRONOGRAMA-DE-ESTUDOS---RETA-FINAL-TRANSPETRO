import React from 'react';
import {
  Calendar,
  Layers,
  Clock,
  Download,
  Upload,
  Play,
  Pause,
  Award,
  Flame,
} from 'lucide-react';
import { formatSecondsToDigital } from '../utils/scheduleGenerator';

interface HeaderProps {
  currentTab: 'schedule' | 'reta_final' | 'pareto' | 'timer' | 'backup';
  setCurrentTab: (tab: 'schedule' | 'reta_final' | 'pareto' | 'timer' | 'backup') => void;
  totalLiquidSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onOpenTimerModal: () => void;
  activeSessionTitle?: string;
  completedSessionsCount: number;
  totalSessionsCount: number;
  onQuickBackup: () => void;
  onQuickRestoreClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  totalLiquidSeconds,
  isTimerRunning,
  onToggleTimer,
  onOpenTimerModal,
  activeSessionTitle,
  completedSessionsCount,
  totalSessionsCount,
  onQuickBackup,
  onQuickRestoreClick,
}) => {
  const percentDone =
    totalSessionsCount > 0
      ? Math.round((completedSessionsCount / totalSessionsCount) * 100)
      : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              80/20
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  TRANSPETRO 2026.3
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ênfase 1: Adm. & Controle
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cesgranrio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Princípio de Pareto em 3 Camadas • 22/09 a 05/12/2026 • 20h às 23h
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Stopwatch Ticker */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Live Liquid Hours Counter Widget */}
            <div
              id="header-liquid-timer"
              onClick={onOpenTimerModal}
              className={`cursor-pointer px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${
                isTimerRunning
                  ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
              }`}
              title="Clique para abrir o cronômetro de horas líquidas"
            >
              <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {isTimerRunning ? 'Gravando Horas Líquidas' : 'Total Horas Líquidas'}
                </span>
                <span className="font-mono font-bold text-sm text-white">
                  {formatSecondsToDigital(totalLiquidSeconds)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTimer();
                }}
                className={`ml-1 p-1 rounded-lg ${
                  isTimerRunning
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
                title={isTimerRunning ? 'Pausar' : 'Iniciar'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick backup button */}
            <button
              id="header-quick-backup-btn"
              onClick={onQuickBackup}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Salvar Backup JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            {/* Quick restore button */}
            <button
              id="header-quick-restore-btn"
              onClick={onQuickRestoreClick}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Restaurar Backup JSON"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          </div>
        </div>

        {/* Bottom Nav Tabs */}
        <div className="flex items-center justify-between overflow-x-auto py-2">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-tab-schedule"
              onClick={() => setCurrentTab('schedule')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                currentTab === 'schedule'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Cronograma Geral (20h-23h)</span>
            </button>

            <button
              id="nav-tab-reta-final"
              onClick={() => setCurrentTab('reta_final')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                currentTab === 'reta_final'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black shadow-md shadow-rose-500/20'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Flame className="w-4 h-4 fill-current text-rose-400" />
              <span>Reta Final (28/11 a 04/12)</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono font-bold text-amber-300">
                6h/dia
              </span>
            </button>

            <button
              id="nav-tab-pareto"
              onClick={() => setCurrentTab('pareto')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                currentTab === 'pareto'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mapa 80/20 (3 Camadas)</span>
            </button>

            <button
              id="nav-tab-timer"
              onClick={() => setCurrentTab('timer')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                currentTab === 'timer'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Horas Líquidas & Desempenho</span>
            </button>

            <button
              id="nav-tab-backup"
              onClick={() => setCurrentTab('backup')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                currentTab === 'backup'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Backup & Configurações</span>
            </button>
          </nav>

          {/* Mini progress tracker */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sessões:</span>
              <strong className="text-white">
                {completedSessionsCount}/{totalSessionsCount}
              </strong>
            </div>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentDone}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-amber-400">{percentDone}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
