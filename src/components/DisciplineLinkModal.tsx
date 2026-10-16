import React, { useState, useEffect } from 'react';
import {
  X,
  Link2,
  ExternalLink,
  Trash2,
  Check,
  AlertCircle,
  Globe,
  Tag,
  Info,
} from 'lucide-react';
import { DisciplineId, DisciplineLink } from '../types';
import { DISCIPLINES } from '../data/paretoData';

interface DisciplineLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplineId: DisciplineId | null;
  existingLink?: DisciplineLink;
  onSave: (disciplineId: DisciplineId, link: DisciplineLink) => void;
  onDelete: (disciplineId: DisciplineId) => void;
}

export const DisciplineLinkModal: React.FC<DisciplineLinkModalProps> = ({
  isOpen,
  onClose,
  disciplineId,
  existingLink,
  onSave,
  onDelete,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const discipline = DISCIPLINES.find((d) => d.id === disciplineId);

  // Sync state when modal opens or existingLink changes
  useEffect(() => {
    if (isOpen) {
      setUrl(existingLink?.url || '');
      setTitle(existingLink?.title || '');
      setError(null);
      setIsConfirmingDelete(false);
    }
  }, [isOpen, existingLink, disciplineId]);

  if (!isOpen || !disciplineId || !discipline) return null;

  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = normalizeUrl(url);

    if (!cleanUrl) {
      setError('Por favor, informe a URL do link.');
      return;
    }

    try {
      new URL(cleanUrl);
    } catch {
      setError('URL inválida. Verifique o endereço digitado (ex: https://meusite.com).');
      return;
    }

    onSave(disciplineId, {
      url: cleanUrl,
      title: title.trim() || undefined,
      updatedAt: Date.now(),
    });
    onClose();
  };

  const handleDelete = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    onDelete(disciplineId);
    onClose();
  };

  const previewNormalizedUrl = normalizeUrl(url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${discipline.bgColor} ${discipline.borderColor} ${discipline.textColor}`}
            >
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${discipline.bgColor} ${discipline.borderColor} ${discipline.textColor}`}
                >
                  {discipline.shortName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {existingLink ? 'Editar Link' : 'Novo Link'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Link da Matéria: {discipline.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Propagation Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Sincronização Automática:</strong> Este link acompanhará todas as sessões em que{' '}
            <strong className="text-amber-300">{discipline.name}</strong> aparecer ao longo de todo o
            cronograma — tanto nos dias anteriores quanto nos próximos dias.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Endereço do Link (URL) *</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: drive.google.com/drive/folders/... ou notion.so/..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Title / Label Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Título / Rótulo do Link (Opcional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pasta Google Drive de Questões, Caderno de Resumos, Vídeos..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-500">
              Se deixar em branco, o link exibirá a própria URL ou o nome da matéria.
            </p>
          </div>

          {/* Test Link Preview Button */}
          {previewNormalizedUrl && (
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-[280px]">
                Destino: <span className="text-slate-300 font-mono">{previewNormalizedUrl}</span>
              </span>
              <a
                href={previewNormalizedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Testar Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              {existingLink && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isConfirmingDelete
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                  title="Remover link desta matéria em todo o cronograma"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isConfirmingDelete ? 'Confirmar Exclusão?' : 'Excluir Link'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{existingLink ? 'Salvar Alterações' : 'Salvar Link'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
