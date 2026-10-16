import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { StudySession, SessionLog, AppBackupData, DisciplineLinks } from '../types';
import { exportBackupData, validateAndParseBackup } from '../utils/storage';
import { formatSecondsToDigital } from '../utils/scheduleGenerator';

interface BackupViewProps {
  sessions: StudySession[];
  sessionLogs: SessionLog[];
  completedMicroTopicIds: string[];
  totalLiquidSeconds: number;
  disciplineLinks?: DisciplineLinks;
  onRestoreBackup: (backup: AppBackupData) => void;
  onResetToDefaults: () => void;
}

export const BackupView: React.FC<BackupViewProps> = ({
  sessions,
  sessionLogs,
  completedMicroTopicIds,
  totalLiquidSeconds,
  disciplineLinks,
  onRestoreBackup,
  onResetToDefaults,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleDownloadBackup = () => {
    exportBackupData(
      sessions,
      sessionLogs,
      completedMicroTopicIds,
      totalLiquidSeconds,
      {},
      disciplineLinks
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const backup = validateAndParseBackup(text);
        onRestoreBackup(backup);
        setRestoreStatus({
          type: 'success',
          message: `Backup restaurado com sucesso! ${backup.sessions.length} sessões e ${backup.sessionLogs.length} logs importados.`,
        });
      } catch (err: any) {
        setRestoreStatus({
          type: 'error',
          message: `Erro ao restaurar arquivo: ${err.message || 'Formato JSON inválido.'}`,
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const completedSessionsCount = sessions.filter((s) => s.completed).length;

  const currentSummaryJson = JSON.stringify(
    {
      app: 'Cronograma Pareto Transpetro 2026.3',
      exportDate: new Date().toISOString(),
      totalSessions: sessions.length,
      completedSessions: completedSessionsCount,
      completedMicroTopics: completedMicroTopicIds.length,
      totalLiquidSeconds,
      totalLiquidFormatted: formatSecondsToDigital(totalLiquidSeconds),
      totalLogs: sessionLogs.length,
    },
    null,
    2
  );

  const handleCopySummary = () => {
    navigator.clipboard.writeText(currentSummaryJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Segurança de Dados
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Backup Local Offline
          </span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Backup & Restauração JSON
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Salve todos os seus dados de estudo (tickers marcados, horas líquidas cronometradas, notas e progresso) em um arquivo JSON leve. Você pode restaurá-lo a qualquer momento ou em outro dispositivo.
        </p>
      </div>

      {/* Feedback Alert */}
      {restoreStatus.type && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            restoreStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {restoreStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{restoreStatus.message}</span>
        </div>
      )}

      {/* Backup and Restore Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Salvar Backup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Salvar Backup JSON</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Exporta um arquivo <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">.json</code> completo contendo as {sessions.length} sessões planejadas, matérias estudadas e o ledger de horas líquidas.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-5 font-mono">
              <div className="flex justify-between">
                <span>Sessões concluídas:</span>
                <strong className="text-white">{completedSessionsCount}/{sessions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Horas líquidas acumuladas:</span>
                <strong className="text-amber-400">{formatSecondsToDigital(totalLiquidSeconds)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Subtópicos dominados:</span>
                <strong className="text-emerald-400">{completedMicroTopicIds.length}</strong>
              </div>
            </div>
          </div>

          <button
            id="btn-download-backup-view"
            type="button"
            onClick={handleDownloadBackup}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Salvar Backup JSON (.json)</span>
          </button>
        </div>

        {/* Card 2: Restaurar Backup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Restaurar Backup JSON</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Carregue um arquivo JSON gerado anteriormente para recuperar todo o seu histórico de estudo e configurações.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-colors mb-5"
            >
              <FileJson className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-white">
                Clique para selecionar o arquivo .json
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Compatível com os backups deste aplicativo
              </p>
            </div>

            <input
              ref={fileInputRef}
              id="file-input-backup"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <button
            id="btn-restore-file-trigger"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-transform active:scale-98"
          >
            <Upload className="w-4 h-4" />
            <span>Selecionar e Restaurar Backup</span>
          </button>
        </div>
      </div>

      {/* Raw State Diagnostic Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Resumo do Estado em Memória</h4>
          </div>
          <button
            onClick={handleCopySummary}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
          </button>
        </div>
        <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
          {currentSummaryJson}
        </pre>
      </div>

      {/* Danger Zone: Reset to Initial Schedule */}
      <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-rose-400">Reiniciar Cronograma Padrão</h4>
          <p className="text-[11px] text-slate-400">
            Regera a grade de 22/09 a 05/12/2026 com o rodízio inicial de Pareto. Recomendamos salvar um backup antes.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Tem certeza de que deseja reiniciar o cronograma para o padrão de 22/09 a 05/12/2026?')) {
              onResetToDefaults();
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors whitespace-nowrap"
        >
          Reiniciar Grade
        </button>
      </div>
    </div>
  );
};
