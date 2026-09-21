import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  CheckCircle,
  Circle,
  Play,
  Layers,
  Sparkles,
  HelpCircle,
  BookOpen,
  Filter,
  CheckSquare,
  Square,
} from 'lucide-react';
import { DisciplineId, Temperature } from '../types';
import { DISCIPLINES, MESO_TOPICS, MICRO_TOPICS } from '../data/paretoData';

interface ParetoExplorerProps {
  completedMicroTopicIds: string[];
  onToggleMicroTopic: (microId: string) => void;
  onLaunchTopicTimer: (disciplineId: DisciplineId, microTopicId: string, topicTitle: string) => void;
}

export const ParetoExplorer: React.FC<ParetoExplorerProps> = ({
  completedMicroTopicIds,
  onToggleMicroTopic,
  onLaunchTopicTimer,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'camada1' | 'camada2' | 'camada3'>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemperature, setFilterTemperature] = useState<Temperature | 'all'>('all');

  // Filtered Camada 1 disciplines
  const filteredDisciplines = useMemo(() => {
    let list = DISCIPLINES;
    if (selectedDiscipline !== 'all') {
      list = list.filter((d) => d.id === selectedDiscipline);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedDiscipline, searchQuery]);

  // Filtered Camada 2 Meso topics
  const filteredMesoTopics = useMemo(() => {
    let list = MESO_TOPICS;
    if (selectedDiscipline !== 'all') {
      list = list.filter((m) => m.disciplineId === selectedDiscipline);
    }
    if (filterTemperature !== 'all') {
      list = list.filter((m) => m.temperature === filterTemperature);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.strategyTip && m.strategyTip.toLowerCase().includes(q)) ||
          m.phases.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedDiscipline, filterTemperature, searchQuery]);

  // Filtered Camada 3 Micro topics
  const filteredMicroTopics = useMemo(() => {
    let list = MICRO_TOPICS;
    if (selectedDiscipline !== 'all') {
      list = list.filter((m) => m.disciplineId === selectedDiscipline);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.keyConcepts.toLowerCase().includes(q) ||
          m.difficulty.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedDiscipline, searchQuery]);

  const getTemperatureBadge = (temp: Temperature) => {
    switch (temp) {
      case 'fervendo':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            🔥🔥 FERVENDO (Top 1)
          </span>
        );
      case 'quente':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            🔥 QUENTE
          </span>
        );
      case 'morno':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
            🌤️ MORNO
          </span>
        );
      case 'frio':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600 flex items-center gap-1">
            ❄️ FRIO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Methodology Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Metodologia Científica
              </span>
              <span className="text-xs text-slate-400">
                Princípio 80/20 Aplicado em 3 Camadas
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Mapa de Prioridades Pareto Recursivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Descubra os 20% dos conteúdos específicos que geram 80% das questões e pontos de classificação na prova da Cesgranrio.
            </p>
          </div>

          {/* Search bar: "Buscar tópico, artigo ou fórmula..." */}
          <div className="w-full lg:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="pareto-search-input"
              type="text"
              placeholder="Buscar tópico, artigo ou fórmula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Layer Tabs: Visão Completa, Camada 1, Camada 2, Camada 3 */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeLayer === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visão Completa
            </button>
            <button
              onClick={() => setActiveLayer('camada1')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeLayer === 'camada1'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Camada 1 (Macro)
            </button>
            <button
              onClick={() => setActiveLayer('camada2')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeLayer === 'camada2'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Camada 2 (Meso)
            </button>
            <button
              onClick={() => setActiveLayer('camada3')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeLayer === 'camada3'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Camada 3 (Micro)
            </button>
          </div>

          {/* Discipline Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 ml-auto">
            <span className="text-xs text-slate-400 mr-1">Disciplina:</span>
            <button
              onClick={() => setSelectedDiscipline('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDiscipline === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas (150h)
            </button>
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDiscipline(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDiscipline === d.id
                    ? `${d.bgColor} ${d.textColor} border ${d.borderColor}`
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.shortName} ({d.targetHours}h)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CAMADA 1 — Macro (Divisão do Tempo Total de 150h nos Específicos)     */}
      {/* ========================================================================= */}
      {(activeLayer === 'all' || activeLayer === 'camada1') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                CAMADA 1 — Macro (Divisão do Tempo Total de 150h nos Específicos)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              40 questões / 100% da Classificação
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisciplines.map((disc) => (
              <div
                key={disc.id}
                className={`rounded-2xl border p-5 ${disc.bgColor} ${disc.borderColor} relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        disc.priorityBadge === 'PRIORITÁRIA'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : disc.priorityBadge === 'COMPLEMENTAR'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      }`}
                    >
                      {disc.priorityBadge}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      ~{disc.questionsCount} questões
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mb-2">{disc.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {disc.description}
                  </p>
                </div>

                {/* Macro metrics strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-700/40 text-center text-xs">
                  <div className="bg-slate-950/40 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 uppercase">Tempo de Estudo</div>
                    <div className="font-extrabold text-white text-sm">
                      {disc.targetHours}h ({disc.examSharePercent}%)
                    </div>
                  </div>
                  <div className="bg-slate-950/40 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 uppercase">% da Prova</div>
                    <div className="font-extrabold text-white text-sm">
                      {disc.examSharePercent}%
                    </div>
                  </div>
                  <div className="bg-slate-950/40 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 uppercase">Fases</div>
                    <div className="font-extrabold text-white text-sm">Fases 1, 2 e 3</div>
                  </div>
                  <div className="bg-slate-950/40 rounded-xl p-2">
                    <div className="text-[10px] text-slate-400 uppercase">Retomadas</div>
                    <div className="font-extrabold text-amber-400 text-sm">
                      {disc.id === 'logistica'
                        ? '7 Retomadas'
                        : disc.id === 'financas'
                        ? '6 Retomadas'
                        : disc.id === 'processos_adm'
                        ? '5 Retomadas'
                        : '4 Retomadas'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CAMADA 2 — Meso (Tópicos por Frequência, Temperatura e Ordem Estratégica) */}
      {/* ========================================================================= */}
      {(activeLayer === 'all' || activeLayer === 'camada2') && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                CAMADA 2 — Meso (Tópicos por Frequência, Temperatura e Ordem Estratégica)
              </h3>
            </div>

            {/* Temperature filter buttons */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1">Temperatura:</span>
              <button
                onClick={() => setFilterTemperature('all')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  filterTemperature === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterTemperature('fervendo')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  filterTemperature === 'fervendo'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                🔥🔥 Fervendo
              </button>
              <button
                onClick={() => setFilterTemperature('quente')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  filterTemperature === 'quente'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                🔥 Quente
              </button>
              <button
                onClick={() => setFilterTemperature('morno')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  filterTemperature === 'morno'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                🌤️ Morno
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMesoTopics.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-slate-300 text-sm font-semibold">
                  {selectedDiscipline === 'portugues' || selectedDiscipline === 'matematica'
                    ? `${DISCIPLINES.find((d) => d.id === selectedDiscipline)?.name} é estudada no cronograma fixo das 18h às 19h (2x por semana) apenas pelo nome da matéria, sem divisão meso.`
                    : 'Nenhum tópico meso encontrado com os filtros atuais.'}
                </p>
              </div>
            ) : (
              filteredMesoTopics.map((meso) => {
                const disc = DISCIPLINES.find((d) => d.id === meso.disciplineId);
                return (
                  <div
                    key={meso.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          #{meso.order}º
                        </span>
                        {disc && (
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${disc.bgColor} ${disc.textColor} ${disc.borderColor}`}
                          >
                            {disc.shortName}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {meso.hours}h alocadas
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getTemperatureBadge(meso.temperature)}
                      </div>
                    </div>

                    <h4 className="text-base font-extrabold text-white mb-2">{meso.title}</h4>

                    {meso.strategyTip && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-slate-200 mb-3 leading-relaxed">
                        <strong className="text-amber-300">💡 Estratégia Cesgranrio:</strong>{' '}
                        {meso.strategyTip}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <span>🔄 {meso.retomadasCount}x retomado</span>
                      </span>
                      <span>•</span>
                      <span>{meso.phases}</span>
                      <span>•</span>
                      <span className="text-slate-300">Frequência: {meso.frequency}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CAMADA 3 — Micro (Subtópicos: Dificuldade, Custo-Benefício e Inclusão) */}
      {/* ========================================================================= */}
      {(activeLayer === 'all' || activeLayer === 'camada3') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                CAMADA 3 — Micro (Subtópicos: Dificuldade, Custo-Benefício e Inclusão)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Critério: Alta Frequência + Fácil/Médio = Prioridade Máxima
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMicroTopics.length === 0 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center col-span-full">
                <p className="text-slate-300 text-sm font-semibold">
                  {selectedDiscipline === 'portugues' || selectedDiscipline === 'matematica'
                    ? `${DISCIPLINES.find((d) => d.id === selectedDiscipline)?.name} é estudada no cronograma fixo das 18h às 19h (2x por semana) apenas pelo nome da matéria, sem subtópicos na Camada 3.`
                    : 'Nenhum subtópico encontrado para os filtros selecionados.'}
                </p>
              </div>
            )}
            {filteredMicroTopics.map((micro) => {
              const isChecked = completedMicroTopicIds.includes(micro.id);
              const disc = DISCIPLINES.find((d) => d.id === micro.disciplineId);

              return (
                <div
                  key={micro.id}
                  id={`micro-card-${micro.id}`}
                  className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                    isChecked
                      ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div>
                    {/* Top row: Checkbox ticker + Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          id={`micro-ticker-${micro.id}`}
                          onClick={() => onToggleMicroTopic(micro.id)}
                          className={`p-1 rounded-lg transition-transform active:scale-95 ${
                            isChecked
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-slate-500 hover:text-amber-400 bg-slate-800'
                          }`}
                          title={isChecked ? 'Marcar como pendente' : 'Marcar como dominado'}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isChecked
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isChecked ? '✅ Concluído' : '⏳ A Estudar'}
                        </span>

                        {disc && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${disc.bgColor} ${disc.textColor} ${disc.borderColor}`}
                          >
                            {disc.shortName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                          {micro.suggestedHours}h sugeridas
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            micro.difficulty === 'Fácil'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {micro.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Micro Title */}
                    <h5
                      className={`text-sm font-bold leading-tight mb-2 ${
                        isChecked ? 'text-slate-300 line-through decoration-emerald-500/60' : 'text-white'
                      }`}
                    >
                      {micro.title}
                    </h5>

                    {/* Key Concepts */}
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 leading-relaxed mb-3">
                      {micro.keyConcepts}
                    </p>
                  </div>

                  {/* Launch Timer Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Rodízio semanal incluso
                    </span>
                    <button
                      type="button"
                      onClick={() => onLaunchTopicTimer(micro.disciplineId, micro.id, micro.title)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Cronometrar estudo deste subtópico"
                    >
                      <Play className="w-3 h-3 fill-current text-amber-400" />
                      <span>Cronometrar</span>
                    </button>
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
