import React from 'react';
import {
  Clock,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Play,
  RotateCcw,
  Target,
  FileText,
} from 'lucide-react';
import { SessionLog, DisciplineId } from '../types';
import { DISCIPLINES } from '../data/paretoData';
import { formatSecondsToDigital, formatMinutes } from '../utils/scheduleGenerator';

interface MetricsAndTimerViewProps {
  totalLiquidSeconds: number;
  sessionLogs: SessionLog[];
  isTimerRunning: boolean;
  onOpenTimerModal: () => void;
  onQuickStartTimer: () => void;
  completedSessionsCount: number;
  totalSessionsCount: number;
}

export const MetricsAndTimerView: React.FC<MetricsAndTimerViewProps> = ({
  totalLiquidSeconds,
  sessionLogs,
  isTimerRunning,
  onOpenTimerModal,
  onQuickStartTimer,
  completedSessionsCount,
  totalSessionsCount,
}) => {
  const totalTargetHoursSpecific = 150; // 54 + 39 + 36 + 21
  const totalTargetHoursAll = 150 + 44; // Including Port and Mat = 194h
  const studiedHours = totalLiquidSeconds / 3600;
  const generalProgressPercent = Math.min(
    100,
    Math.round((studiedHours / totalTargetHoursSpecific) * 100)
  );

  // Compute stats per discipline from logs
  const disciplineStats = DISCIPLINES.map((disc) => {
    const logsForDisc = sessionLogs.filter((log) => log.disciplineId === disc.id);
    const discSeconds = logsForDisc.reduce((acc, l) => acc + l.durationSeconds, 0);
    const discHours = discSeconds / 3600;
    const percent = Math.min(100, Math.round((discHours / disc.targetHours) * 100));

    const totalQuestions = logsForDisc.reduce((acc, l) => acc + (l.questionsCount || 0), 0);
    const totalCorrect = logsForDisc.reduce((acc, l) => acc + (l.correctCount || 0), 0);
    const accuracy =
      totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null;

    return {
      discipline: disc,
      studiedHours,
      discHours,
      discSeconds,
      percent,
      totalQuestions,
      totalCorrect,
      accuracy,
      sessionCount: logsForDisc.length,
    };
  });

  const totalQuestionsAll = sessionLogs.reduce((acc, l) => acc + (l.questionsCount || 0), 0);
  const totalCorrectAll = sessionLogs.reduce((acc, l) => acc + (l.correctCount || 0), 0);
  const generalAccuracy =
    totalQuestionsAll > 0 ? Math.round((totalCorrectAll / totalQuestionsAll) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Contador de Horas Líquidas
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Foco 100% Produtivo
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Desempenho & Horas Líquidas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Acompanhe o total acumulado do seu cronômetro de estudo líquido em relação à meta de 150h específicas e taxa de acertos Cesgranrio.
          </p>
        </div>

        {/* Stopwatch Launcher Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {isTimerRunning ? '🟢 Cronômetro Ativo' : 'Total Líquido Registrado'}
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-white">
              {formatSecondsToDigital(totalLiquidSeconds)}
            </span>
          </div>

          <button
            onClick={onOpenTimerModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 whitespace-nowrap"
          >
            <Clock className="w-4 h-4" />
            <span>{isTimerRunning ? 'Ver Cronômetro' : 'Abrir Cronômetro'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Horas Estudadas</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {studiedHours.toFixed(1)}h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Meta específica: <strong className="text-slate-300">150.0h</strong> ({generalProgressPercent}%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Sessões do Cronograma</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {completedSessionsCount} / {totalSessionsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalSessionsCount > 0
              ? Math.round((completedSessionsCount / totalSessionsCount) * 100)
              : 0}
            % do plano concluído
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Questões Feitas</span>
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {totalQuestionsAll}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Acertos: <strong className="text-emerald-400">{totalCorrectAll}</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Aproveitamento Cesgranrio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-emerald-400">
            {generalAccuracy !== null ? `${generalAccuracy}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Taxa média de acertos
          </div>
        </div>
      </div>

      {/* Breakdown per Discipline Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Distribuição de Horas Líquidas por Disciplina</span>
        </h3>

        <div className="space-y-4">
          {disciplineStats.map((stat) => (
            <div key={stat.discipline.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold border text-[11px] ${stat.discipline.bgColor} ${stat.discipline.textColor} ${stat.discipline.borderColor}`}
                  >
                    {stat.discipline.shortName}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {stat.discHours.toFixed(1)}h estudadas / {stat.discipline.targetHours}h meta
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  {stat.totalQuestions > 0 && (
                    <span>
                      {stat.totalCorrect}/{stat.totalQuestions} questões ({stat.accuracy}%)
                    </span>
                  )}
                  <span className="font-bold text-white">{stat.percent}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stat.percent}%`,
                    backgroundColor: stat.discipline.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Ledger of Study Sessions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Histórico de Sessões Registradas ({sessionLogs.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Registros salvos localmente
          </span>
        </div>

        {sessionLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
            Nenhuma sessão registrada com o cronômetro de horas líquidas ainda.
            <br />
            Clique em "Iniciar Cronômetro" no cronograma ou no topo para registrar seu primeiro bloco de estudo!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Data</th>
                  <th className="pb-3 px-3">Disciplina</th>
                  <th className="pb-3 px-3">Tópico Estudado</th>
                  <th className="pb-3 px-3">Tempo Líquido</th>
                  <th className="pb-3 px-3">Questões / Acertos</th>
                  <th className="pb-3 px-3">Anotações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sessionLogs
                  .slice()
                  .reverse()
                  .map((log) => {
                    const disc = DISCIPLINES.find((d) => d.id === log.disciplineId);
                    return (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 text-slate-300 font-mono whitespace-nowrap">
                          {log.date}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {disc && (
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${disc.bgColor} ${disc.textColor} ${disc.borderColor}`}
                            >
                              {disc.shortName}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-white font-medium max-w-xs truncate">
                          {log.topicTitle}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {formatSecondsToDigital(log.durationSeconds)}
                        </td>
                        <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                          {log.questionsCount ? (
                            <span>
                              {log.correctCount || 0} / {log.questionsCount}
                              {log.questionsCount > 0 && (
                                <span className="ml-1 text-slate-400 font-mono">
                                  ({Math.round(((log.correctCount || 0) / log.questionsCount) * 100)}%)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-400 max-w-sm truncate">
                          {log.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
