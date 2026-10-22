import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Database,
  Lock,
} from 'lucide-react';
import { AppBackupData } from '../types';
import {
  getDriveEndpoint,
  setDriveEndpoint,
  getDriveAutoSync,
  setDriveAutoSync,
  getDriveSyncValidated,
  setDriveSyncValidated,
  getLastDriveSyncDate,
  setLastDriveSyncDate,
  savePreSyncSafetyBackup,
  getPreSyncSafetyBackup,
  mergeBackupData,
  fetchGoogleDriveDataViaJsonp,
  cleanAppsScriptEndpoint,
} from '../utils/driveSync';
import { validateAndParseBackup } from '../utils/storage';

interface DriveSyncPanelProps {
  currentBackupData: AppBackupData;
  onApplySyncData: (data: AppBackupData, summaryMessage: string) => void;
  className?: string;
}

export const DriveSyncPanel: React.FC<DriveSyncPanelProps> = ({
  currentBackupData,
  onApplySyncData,
  className = '',
}) => {
  const [endpoint, setEndpointState] = useState<string>(() => getDriveEndpoint());
  const [autoSync, setAutoSyncState] = useState<boolean>(() => getDriveAutoSync());
  const [isValidated, setIsValidated] = useState<boolean>(() => getDriveSyncValidated());
  const [lastSync, setLastSyncState] = useState<string | null>(() => getLastDriveSyncDate());
  const [syncMode, setSyncMode] = useState<'merge' | 'replace'>('merge');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Pronto para sincronizar');
  const [statusType, setStatusType] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(!getDriveEndpoint());
  const [isScriptCodeOpen, setIsScriptCodeOpen] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [hasSafetyBackup, setHasSafetyBackup] = useState<boolean>(() => !!getPreSyncSafetyBackup());

  // Google Apps Script template: busca arquivos pelo prefixo 'backup_pareto_transpetro'
  // ignorando o restante do nome (datas, horários, extensões) e selecionando o mais recente
  const appsScriptTemplate = `// Google Apps Script — Busca por prefixo "backup_pareto_transpetro" (qualquer data)
// Seleciona automaticamente o arquivo mais recente para evitar inconsistência!
// Publicar como: Aplicativo da Web (Acesso: "Qualquer pessoa", Executar como: "Eu")
function doGet(e) {
  var prefix = "backup_pareto_transpetro";
  
  // 1. Busca todos os arquivos que contenham o prefixo no nome e não estejam na lixeira
  var files = DriveApp.searchFiles("title contains '" + prefix + "' and trashed = false");
  var matchingFiles = [];
  
  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    // Confirma correspondência com o prefixo (insensível a maiúsculas/minúsculas)
    if (name.toLowerCase().indexOf(prefix.toLowerCase()) !== -1) {
      matchingFiles.push({
        file: file,
        name: name,
        updated: file.getLastUpdated().getTime()
      });
    }
  }
  
  // Fallback: se a busca direta ainda estiver indexando, varre os arquivos recentes
  if (matchingFiles.length === 0) {
    var allFiles = DriveApp.getFiles();
    var count = 0;
    while (allFiles.hasNext() && count < 150) {
      var f = allFiles.next();
      count++;
      if (!f.isTrashed() && f.getName().toLowerCase().indexOf(prefix.toLowerCase()) !== -1) {
        matchingFiles.push({
          file: f,
          name: f.getName(),
          updated: f.getLastUpdated().getTime()
        });
      }
    }
  }
  
  if (matchingFiles.length === 0) {
    return outputResponse(e, {
      error: "Nenhum arquivo iniciando com '" + prefix + "' foi encontrado no seu Google Drive. Salve o arquivo no Drive com nome como backup_pareto_transpetro_2026-10-22.json."
    });
  }
  
  // 2. Ordena do mais recente para o mais antigo (última data de modificação)
  matchingFiles.sort(function(a, b) {
    return b.updated - a.updated;
  });
  
  var latestFile = matchingFiles[0].file;
  var content = latestFile.getBlob().getDataAsString();
  var parsed = JSON.parse(content);
  
  return outputResponse(e, parsed);
}

function outputResponse(e, data) {
  var callback = (e && e.parameter && e.parameter.callback) || "";
  if (callback) {
    var output = callback + "(" + JSON.stringify(data) + ");";
    return ContentService.createTextOutput(output)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  // Keep window.sincronizarGoogleDrive in sync
  useEffect(() => {
    (window as any).sincronizarGoogleDrive = () => {
      handleSync();
    };
    return () => {
      delete (window as any).sincronizarGoogleDrive;
    };
  });

  // Handle saving endpoint
  const handleSaveEndpoint = (newUrl: string) => {
    setEndpointState(newUrl);
    setDriveEndpoint(newUrl);
  };

  // Handle toggling auto-sync
  const handleToggleAutoSync = (checked: boolean) => {
    if (checked && !isValidated) {
      setStatusType('error');
      setStatusMessage('Valide a integração sincronizando com sucesso pelo menos uma vez antes de ativar.');
      return;
    }
    setAutoSyncState(checked);
    setDriveAutoSync(checked);
  };

  // Perform Synchronization
  const handleSync = useCallback(async () => {
    const rawUrl = getDriveEndpoint().trim();
    const { cleanedUrl, isDriveLink, wasFixed, fixReason } = cleanAppsScriptEndpoint(rawUrl);

    if (wasFixed && cleanedUrl !== rawUrl) {
      setEndpointState(cleanedUrl);
      setDriveEndpoint(cleanedUrl);
    }

    if (isDriveLink) {
      setStatusType('error');
      setStatusMessage('Você inseriu o link do Google Drive (drive.google.com). Use a URL do Web App do Apps Script (/exec).');
      setIsConfigOpen(true);
      return;
    }

    if (!cleanedUrl || !cleanedUrl.startsWith('https://script.google.com/')) {
      setStatusType('error');
      setStatusMessage('Configure a URL do Apps Script.');
      setIsConfigOpen(true);
      return;
    }

    setIsLoading(true);
    setStatusType('loading');
    setStatusMessage('Buscando dados...');

    try {
      // 1. Fetch data via JSONP (with automatic REST fallback)
      const rawData = await fetchGoogleDriveDataViaJsonp(cleanedUrl, (msg) => {
        setStatusMessage(msg);
      });

      // 2. Validate data format
      let parsedRemote: AppBackupData;
      if (typeof rawData === 'string') {
        parsedRemote = validateAndParseBackup(rawData);
      } else if (rawData && typeof rawData === 'object') {
        // If Google Apps Script returned error payload
        if (rawData.error) {
          throw new Error(rawData.error);
        }
        // Normalize as AppBackupData
        parsedRemote = validateAndParseBackup(JSON.stringify(rawData));
      } else {
        throw new Error('O JSON recebido do Google Drive é inválido ou vazio.');
      }

      setStatusMessage('Dados recebidos. Integrando com segurança...');

      // 3. Save pre-sync safety backup in localStorage before modifying state
      savePreSyncSafetyBackup(currentBackupData);
      setHasSafetyBackup(true);

      // 4. Apply chosen sync rule (Safe Merge vs Replace)
      let finalData: AppBackupData;
      let summaryText = '';

      if (syncMode === 'merge') {
        finalData = mergeBackupData(currentBackupData, parsedRemote);
        const totalCompleted = finalData.sessions.filter((s) => s.completed).length;
        const totalDailyQ = Object.values(finalData.dailyQuestionsProgress || {}).filter(
          (v) => v.completed
        ).length;
        summaryText = `Sincronização mesclada com sucesso! (${totalCompleted} sessões concluídas, ${totalDailyQ} blocos de questões).`;
      } else {
        finalData = parsedRemote;
        const totalCompleted = finalData.sessions.filter((s) => s.completed).length;
        summaryText = `Substituído com sucesso pelo arquivo do Google Drive (${totalCompleted} sessões).`;
      }

      // 5. Update app state & localStorage
      onApplySyncData(finalData, summaryText);

      // 6. Mark integration as validated and update timestamp
      setDriveSyncValidated(true);
      setIsValidated(true);
      const nowStr = new Date().toLocaleString('pt-BR');
      setLastDriveSyncDate(nowStr);
      setLastSyncState(nowStr);

      setStatusType('success');
      setStatusMessage(summaryText);
    } catch (err: any) {
      console.error('Drive Sync Error', err);
      setStatusType('error');
      setStatusMessage(err.message || 'Falha no acesso. Confira a URL e as permissões.');
    } finally {
      setIsLoading(false);
    }
  }, [currentBackupData, syncMode, onApplySyncData]);

  // Restore previous safety backup
  const handleUndoSync = () => {
    const safety = getPreSyncSafetyBackup();
    if (!safety) {
      setStatusType('error');
      setStatusMessage('Nenhum backup pré-sincronização encontrado.');
      return;
    }
    onApplySyncData(safety, 'Sincronização desfeita com sucesso! Estado anterior restaurado.');
    setStatusType('idle');
    setStatusMessage('Estado pré-sincronização restaurado.');
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptTemplate);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Sincronização Google Drive
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                JSON Público
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Busca automática: <span className="font-mono text-blue-300 font-semibold">backup_pareto_transpetro*</span> (ignora data, pega o mais recente)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfigOpen((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Configurar Endpoint</span>
            {isConfigOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Required DOM Element Block for the User Prompt */}
      {/* id="drive-sync", button id="drive-sync-btn", span id="drive-sync-status" */}
      <div
        id="drive-sync"
        className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner"
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="drive-sync-btn"
            type="button"
            onClick={handleSync}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isLoading
                ? 'bg-blue-600/70 text-blue-200'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar dados do Google Drive</span>
          </button>

          <span
            id="drive-sync-status"
            role="status"
            className={`text-xs font-medium flex items-center gap-1.5 ${
              statusType === 'loading'
                ? 'text-blue-300'
                : statusType === 'success'
                ? 'text-emerald-400 font-bold'
                : statusType === 'error'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400'
            }`}
          >
            {statusType === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {statusType === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            {statusMessage}
          </span>
        </div>

        {lastSync && (
          <span className="text-[11px] text-slate-500 font-mono">
            Último sync: {lastSync}
          </span>
        )}
      </div>

      {/* Box de Solução para Falha no Acesso */}
      {statusType === 'error' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Diagnóstico & Solução da "Falha no acesso":</span>
            </div>
            <span className="text-[11px] text-rose-400/80 font-mono font-semibold">Google Apps Script</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Este erro ocorre quando o Google bloqueia a requisição externa. Corrija em <b>3 passos rápidos</b> no seu projeto do Apps Script:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-900/50 space-y-1.5">
              <span className="font-bold text-rose-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs font-black">1</span>
                Permissão "Qualquer pessoa"
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Vá em <b>Implantar &gt; Gerenciar implantações</b>, clique no lápis ✏️ (Editar) e em <b>Quem tem acesso</b> selecione <b>Qualquer pessoa (Anyone)</b>. <i>(O Google define 'Somente eu' por padrão, o que causa o erro).</i>
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-900/50 space-y-1.5">
              <span className="font-bold text-rose-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs font-black">2</span>
                Autorizar função doGet
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                No editor do código, selecione a função <b>doGet</b> e clique em <b>▶ Executar (Run)</b> uma vez. Autorize a conta Google (<i>Avançado &gt; Acessar (não seguro)</i>).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-900/50 space-y-1.5">
              <span className="font-bold text-rose-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-xs font-black">3</span>
                Salvar Nova Versão & /exec
              </span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Em <b>Versão</b> selecione <b>Nova versão</b> e clique em <b>Implantar</b>. Use sempre a URL que termina com <b>/exec</b> (e nunca /edit).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sync Rule & Protection Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Regra de Sincronização Segura */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Regra de Sincronização (Segurança dos Dados)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
              <input
                type="radio"
                name="syncMode"
                value="merge"
                checked={syncMode === 'merge'}
                onChange={() => setSyncMode('merge')}
                className="mt-0.5 text-blue-500 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-200">
                  Mesclagem Segura Inteligente (Recomendado)
                </span>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Combina sessões e questões marcadas na nuvem e no dispositivo local. Nenhum ticker ou hora líquida é apagada.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
              <input
                type="radio"
                name="syncMode"
                value="replace"
                checked={syncMode === 'replace'}
                onChange={() => setSyncMode('replace')}
                className="mt-0.5 text-blue-500 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-amber-300">
                  Substituir pelo Google Drive
                </span>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Usa rigorosamente o arquivo do Drive (cria backup local de segurança antes).
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Auto Sync & Safety Backup */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                Atualização Automática ao Iniciar
              </span>
              {isValidated ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Validado
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                  Pendente de Teste
                </span>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={autoSync}
                disabled={!isValidated}
                onChange={(e) => handleToggleAutoSync(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 disabled:opacity-40"
              />
              <span className={isValidated ? '' : 'text-slate-500'}>
                Sincronizar dados automaticamente ao abrir o app
              </span>
            </label>

            {!isValidated && (
              <p className="text-[11px] text-amber-400/80 mt-1 leading-snug">
                * Conforme a regra de segurança, a sincronização automática só é liberada após um teste manual com sucesso.
              </p>
            )}
          </div>

          {/* Botão de Desfazer Sincronização */}
          {hasSafetyBackup && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Backup de segurança salvo</span>
              <button
                type="button"
                onClick={handleUndoSync}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors text-xs font-medium"
                title="Restaura o estado do aplicativo imediatamente anterior ao último sync"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Desfazer Sincronização</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Configuração do Endpoint & Script de Publicação */}
      {isConfigOpen && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              URL do Web App do Google Apps Script (/exec)
            </span>
            <button
              type="button"
              onClick={() => setIsScriptCodeOpen((prev) => !prev)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ver código do Apps Script</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={endpoint}
              onChange={(e) => handleSaveEndpoint(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleSync}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Testar e Sincronizar</span>
            </button>
          </div>

          {endpoint.includes('/edit') && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span>⚠️ Sua URL termina com <b>/edit</b> (editor). Para funcionar, deve terminar com <b>/exec</b>.</span>
              <button
                type="button"
                onClick={() => handleSaveEndpoint(endpoint.replace(/\/edit(#.*)?$/, '/exec'))}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Corrigir para /exec
              </button>
            </div>
          )}

          {endpoint.includes('/dev') && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span>⚠️ Sua URL termina com <b>/dev</b> (ambiente de teste privado). Para acesso público, deve terminar com <b>/exec</b>.</span>
              <button
                type="button"
                onClick={() => handleSaveEndpoint(endpoint.replace(/\/dev(#.*)?$/, '/exec'))}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Corrigir para /exec
              </button>
            </div>
          )}

          {endpoint.includes('drive.google.com') && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Link direto do Google Drive detectado
              </span>
              <p className="text-[11px] text-slate-300">
                O navegador não consegue acessar links do tipo <code>drive.google.com</code> diretamente devido à restrição de segurança CORS do Google. Você deve implantar o Google Apps Script (veja o código abaixo) e colar a URL pública do Web App gerada terminando com <code>/exec</code>.
              </p>
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nenhuma credencial ou token é exposto. A comunicação é realizada com o seu Google Apps Script público publicado como Web App, que localiza automaticamente o backup mais recente iniciado por <span className="text-blue-300 font-mono font-semibold">backup_pareto_transpetro</span> (independente da data no nome do arquivo).
          </p>

          {/* Código do Google Apps Script para o usuário colar no Drive */}
          {isScriptCodeOpen && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-300">
                  Script no Google Drive (script.google.com):
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800/80 leading-snug">
                {appsScriptTemplate}
              </pre>

              <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-0.5">
                <li>Acesse <b>script.google.com</b> e crie um novo projeto.</li>
                <li>Cole o código acima e clique em <b>Implantar &gt; Nova implantação</b>.</li>
                <li>Selecione <b>Aplicativo da Web</b>, defina Acesso como <b>Qualquer pessoa</b> e copie a URL <span className="font-mono">/exec</span>.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
