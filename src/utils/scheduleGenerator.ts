import { StudySession, DisciplineId } from '../types';
import { MICRO_TOPICS, DISCIPLINES } from '../data/paretoData';

export const START_DATE = '2026-09-21';
export const END_DATE = '2026-12-05';

// Helper to format date YYYY-MM-DD
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const RETA_FINAL_DATES = [
  '2026-11-28',
  '2026-11-29',
  '2026-11-30',
  '2026-12-01',
  '2026-12-02',
  '2026-12-03',
  '2026-12-04',
];

export interface RetaFinalSlotConfig {
  timeSlot: string;
  shift: 'manha' | 'tarde' | 'noite';
  disciplineId: DisciplineId;
  microTopicId?: string;
  title: string;
  subtitle: string;
}

export const RETA_FINAL_CONFIG: Record<string, RetaFinalSlotConfig[]> = {
  '2026-11-28': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_1',
      title: 'Logística: Lei 14.133/2021 — Princípios fundamentais e definições (arts. 5º e 6º)',
      subtitle: 'Conceito de ETP, matriz de riscos, princípios expressos e segregação de funções.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_5',
      title: 'Finanças: Estrutura do Balanço Patrimonial (Ativo, Passivo, PL e Liquidez)',
      subtitle: 'Ordem decrescente de liquidez no Ativo e exigibilidade no Passivo.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_1',
      title: 'Processos Adm.: Recrutamento Interno × Externo × Misto e Modelo CHA',
      subtitle: 'Vantagens e desvantagens de cada modalidade e dimensões do CHA (Saber, Fazer, Querer).',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_8',
      title: 'Logística: Curva ABC e Classificação de Materiais por Valor e Criticidade (XYZ/PQR)',
      subtitle: 'Classes A (80% valor / 20% itens), B e C. Gestão seletiva e criticidade.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_1',
      title: 'Informática: LGPD (Lei 13.709/2018) — Conceitos, Agentes, Dados Sensíveis e Bases Legais',
      subtitle: 'Dado pessoal x sensível, controlador x operador, ANPD e bases legais de tratamento.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_16',
      title: 'Logística: Modalidades de Transporte (Intermodalidade e Multimodalidade, ANTT/ANTAQ) — Modais e Matriz',
      subtitle: 'Características dos modais (rodoviário, ferroviário, aquaviário, dutoviário) e matriz brasileira de cargas.',
    },
  ],
  '2026-11-29': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_5',
      title: 'Logística: Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
      subtitle: 'Regras específicas para estatais (Transpetro/Petrobras), limites e hipóteses de dispensa.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_6',
      title: 'Finanças: Estrutura da DRE (Da Receita Bruta ao Lucro Líquido)',
      subtitle: 'Receita Líquida, CMV, Lucro Bruto, Despesas Operacionais, EBITDA/LAJIR e Lucro Líquido.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_7',
      title: 'Processos Adm.: Indicadores de Desempenho (Eficiência, Eficácia, Efetividade e BSC)',
      subtitle: 'Diferenciação conceitual dos 3Es e as 4 perspectivas do Balanced Scorecard.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_18',
      title: 'Logística: Armazenagem (Tipos de armazéns, layout, organização e WMS) — Armazéns e Layout',
      subtitle: 'Armazém próprio x terceirizado x alfandegado (CLIA), layouts (I, U, L) e endereçamento fixo vs caótico.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_3',
      title: 'Informática: Microsoft Excel 2024 — Fórmulas SE, SOMASE, CONT.SE e Referências com $',
      subtitle: 'Travamento de referências absolutas e mistas ($A$1) e condições aninhadas em questões de prova.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_7',
      title: 'Finanças: Demonstração dos Fluxos de Caixa (DFC) Método Direto × Indireto',
      subtitle: 'Fluxos operacionais, de investimento e financiamento; reconciliação do lucro com o caixa.',
    },
  ],
  '2026-11-30': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_17',
      title: 'Logística: Modalidades de Transporte (Intermodalidade e Multimodalidade, ANTT/ANTAQ) — Regulação',
      subtitle: 'Intermodalidade (múltiplos CT-e) vs Multimodalidade (OTM e conhecimento único). Papel da ANTT e ANTAQ.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_8',
      title: 'Finanças: Contabilidade Prática: Débito e Crédito, Partidas Dobradas e Plano de Contas',
      subtitle: 'Mecanismo de débitos e créditos (Ativo/Despesa vs Passivo/PL/Receita) e fatos contábeis.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_5',
      title: 'Processos Adm.: Sistema de Gestão Integrado (SGI: ISO 9001, ISO 14001 e ISO 45001)',
      subtitle: 'Qualidade, Meio Ambiente e SST. Estrutura de alto nível compartilhada e ciclo PDCA.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_9',
      title: 'Logística: Ponto de Pedido, Estoque de Segurança e Tempo de Reposição (Lead Time)',
      subtitle: 'Fórmulas: PP = (Consumo Diário x Lead Time) + Estoque de Segurança. Ruptura de estoque.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_2',
      title: 'Informática: Segurança da Informação: Princípios CID, Ransomware, Phishing e Backup',
      subtitle: 'Confidencialidade, Integridade, Disponibilidade. Diferenciação de malwares e regras de backup 3-2-1.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_3',
      title: 'Processos Adm.: Avaliação de Desempenho (90º, 180º, 360º) e Erros de Avaliação',
      subtitle: 'Efeito Halo/Horn, tendência central, leniência e instrumentos de avaliação de pessoal.',
    },
  ],
  '2026-12-01': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_7',
      title: 'Logística: Lei 13.303/2016 arts. 68–91 — Contratos nas Estatais, Fiscalização e Sanções',
      subtitle: 'Formalização contratual, garantias, atribuições do fiscal técnico e administrativo e rescisão.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_8',
      title: 'Finanças: Regime de Competência × Regime de Caixa e Fatos Contábeis',
      subtitle: 'Reconhecimento de receitas e despesas no fato gerador independentemente de recebimento/pagamento.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_8',
      title: 'Processos Adm.: Indicadores ESG (Environmental, Social, Governance) e Sustentabilidade',
      subtitle: 'Os 3 pilares ESG em estatais como Transpetro, governança corporativa e integridade.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_19',
      title: 'Logística: Armazenagem (Tipos de armazéns, layout, organização e WMS) — WMS e Cross-docking',
      subtitle: 'Funcionalidades do sistema WMS, métodos de picking (pedido, lote, zona, onda) e fluxo de cross-docking.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_4',
      title: 'Informática: Microsoft Excel 2024 — PROCV e PROCX (Busca Exata vs Aproximada)',
      subtitle: 'Sintaxe completa, quarto argumento falso/0, busca à esquerda com PROCX e erros comuns (#N/D).',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_14',
      title: 'Logística: Aditivos Contratuais (Limites de 25% e 50%) e Apostilamento',
      subtitle: 'Diferença entre alteração unilateral qualitativa/quantitativa por aditivo vs mero apostilamento.',
    },
  ],
  '2026-12-02': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_11',
      title: 'Logística: Custos de Estoque e Lote Econômico de Compra (LEC / EOQ)',
      subtitle: 'Custo de armazenagem (posse) x custo de pedido. Ponto ótimo onde os custos se igualam.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_5',
      title: 'Finanças: Revisão Integrada: Balanço Patrimonial + DRE + DFC (Pegadinhas Cesgranrio)',
      subtitle: 'Inter-relação entre demonstrações contábeis e identificação de armadilhas da banca.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_10',
      title: 'Processos Adm.: Gestão de Manutenção (Confiabilidade, MTBF, MTTR e Tipos de Manutenção)',
      subtitle: 'Fórmulas de confiabilidade e disponibilidade operacional, manutenção preventiva, corretiva e preditiva.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_12',
      title: 'Logística: Métodos de Valoração de Estoques (PEPS/FIFO, Custo Médio e Vedação do UEPS)',
      subtitle: 'Efeito inflacionário no lucro e estoque final; vedação do UEPS na legislação brasileira.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_3',
      title: 'Informática: Microsoft Excel 2024 — Tabelas Dinâmicas, Filtros Avançados e Validação de Dados',
      subtitle: 'Agrupamento em tabelas dinâmicas, campos calculados, filtros e regras de validação para prova.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_9',
      title: 'Processos Adm.: Administração Patrimonial (Inventário, Tombamento e Depreciação Linear)',
      subtitle: 'Cálculo de depreciação linear: (Custo - Valor Residual) / Vida Útil. Controle físico de ativos.',
    },
  ],
  '2026-12-03': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_2',
      title: 'Logística: Lei 14.133/2021 — Modalidades de Licitação e Critérios de Julgamento',
      subtitle: 'Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo. Critérios de menor preço e maior desconto.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_7',
      title: 'Finanças: Análise das Demonstrações: Índices de Liquidez (Corrente, Seca, Imediata e Geral)',
      subtitle: 'Fórmulas dos índices de liquidez, interpretação de solvência a curto e longo prazo.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_6',
      title: 'Processos Adm.: Gestão de Riscos Operacionais, Matriz de Riscos e Análise SWOT/FOFA',
      subtitle: 'Identificação, mensuração e mitigação de riscos; matriz de probabilidade x impacto em estatais.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_20',
      title: 'Logística: Conceitos de Cadeia de Suprimentos (SCM), Logística Integrada e Nível de Serviço',
      subtitle: 'Fluxos de materiais e informações, efeito chicote (bullwhip), integração de elos e OTIF.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'informatica',
      microTopicId: 'micro_inf_1',
      title: 'Informática: Super Revisão 80/20 de Informática — LGPD + Questões Quentes de Excel e Segurança',
      subtitle: 'Síntese das principais pegadinhas da Cesgranrio: bases legais da LGPD, fórmulas com $ e malwares.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_15',
      title: 'Logística: Gestão de Riscos Contratuais, Matriz de Riscos e Contratos Digitais',
      subtitle: 'Alocação de riscos entre contratante e contratado, equilíbrio econômico-financeiro e fiscalização.',
    },
  ],
  '2026-12-04': [
    {
      timeSlot: '09:00 - 10:00',
      shift: 'manha',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_2',
      title: 'Logística: Super Revisão 80/20 — Compras Públicas: Lei 14.133 × Lei 13.303',
      subtitle: 'Quadro comparativo definitivo: modalidades, limites de dispensa de valor e inversão de fases.',
    },
    {
      timeSlot: '10:00 - 11:00',
      shift: 'manha',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_6',
      title: 'Finanças: Super Revisão 80/20 — Demonstrações Contábeis e Fórmulas Rápidas',
      subtitle: 'Fixação relâmpago de DRE, DFC direto/indireto, Balanço e partidas dobradas.',
    },
    {
      timeSlot: '14:00 - 15:00',
      shift: 'tarde',
      disciplineId: 'processos_adm',
      microTopicId: 'micro_adm_10',
      title: 'Processos Adm.: Super Revisão 80/20 — Manutenção (MTBF/MTTR), SGI, RH, ESG e Patrimônio',
      subtitle: 'Fórmulas de confiabilidade e disponibilidade, tipos de manutenção e pilares normativos.',
    },
    {
      timeSlot: '15:00 - 16:00',
      shift: 'tarde',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_16',
      title: 'Logística: Super Revisão 80/20 — Transporte (ANTT/ANTAQ), Armazenagem (WMS) e Estoques',
      subtitle: 'Revisão final dos tópicos quentes: intermodalidade x multimodalidade, WMS/picking e Curva ABC.',
    },
    {
      timeSlot: '20:00 - 21:00',
      shift: 'noite',
      disciplineId: 'financas',
      microTopicId: 'micro_fin_8',
      title: 'Finanças: Super Revisão 80/20 — Contabilidade Prática, Fatos Contábeis e Pegadinhas Cesgranrio',
      subtitle: 'Revisão intensiva de lançamentos contábeis de encerramento, depreciação acumulada e regime de competência.',
    },
    {
      timeSlot: '21:00 - 22:00',
      shift: 'noite',
      disciplineId: 'logistica',
      microTopicId: 'micro_log_8',
      title: 'Logística: Super Revisão 80/20 Final — Checklist de Ouro dos Tópicos Mais Recorrentes Transpetro',
      subtitle: 'Checklist definitivo: licitações 13.303 vs 14.133, fiscalização de contratos, WMS e giro de estoque.',
    },
  ],
};

export function generateInitialSchedule(): StudySession[] {
  const sessions: StudySession[] = [];

  // Topics for Logística before October 5, 2026 (Phase 1 start: Compras, Estoques, Contratos, SCM)
  // Strictly excludes Transporte and Armazenagem before 05/10/2026
  const earlyLogisticaTopicIds = [
    'micro_log_1',  // Lei 14.133 Princípios
    'micro_log_8',  // Curva ABC
    'micro_log_5',  // Lei 13.303 Licitação nas Estatais
    'micro_log_9',  // Ponto de pedido e Lead Time
    'micro_log_13', // Contratos: Gestor x Fiscal
    'micro_log_20', // Logística e SCM
    'micro_log_2',  // Lei 14.133 Modalidades
    'micro_log_11', // Custos de estoque e LEC/EOQ
    'micro_log_14', // Aditivos contratuais 25%/50%
    'micro_log_6',  // Lei 13.303 Procedimento e Modos de disputa
    'micro_log_10', // Giro e cobertura de estoque
    'micro_log_12', // Valoração PEPS, UEPS e Custo Médio
    'micro_log_3',  // Lei 14.133 Fases
    'micro_log_4',  // Contratação direta Dispensa x Inexigibilidade
  ];

  // Topics for Logística starting from October 5, 2026 (05/10/2026)
  // Introduces Modalidades de Transporte & Armazenagem (WMS) right on 05/10/2026
  const fromOct05LogisticaTopicIds = [
    'micro_log_16', // Modalidades de Transporte — Modais e Matriz (inicia em 05/10/2026)
    'micro_log_18', // Armazenagem — Tipos de Armazéns, Layout e Endereçamento (06/10/2026)
    'micro_log_17', // Modalidades de Transporte — Intermodalidade vs Multimodalidade e Regulação (08/10/2026)
    'micro_log_19', // Armazenagem — Sistemas WMS, Picking e Cross-docking (09/10/2026)
    'micro_log_1',  // Lei 14.133 Princípios
    'micro_log_8',  // Curva ABC
    'micro_log_5',  // Lei 13.303 Licitação nas Estatais
    'micro_log_9',  // Ponto de pedido e Lead Time
    'micro_log_13', // Contratos: Gestor x Fiscal
    'micro_log_20', // Logística e SCM
    'micro_log_2',  // Lei 14.133 Modalidades
    'micro_log_16', // Retomada Transporte
    'micro_log_11', // Custos de estoque e LEC/EOQ
    'micro_log_18', // Retomada Armazenagem
    'micro_log_14', // Aditivos contratuais 25%/50%
    'micro_log_17', // Retomada Transporte / Regulação
    'micro_log_6',  // Lei 13.303 Modos de disputa
    'micro_log_19', // Retomada Armazenagem / WMS
    'micro_log_10', // Giro e cobertura de estoque
    'micro_log_12', // Valoração PEPS, UEPS e Custo Médio
    'micro_log_3',  // Lei 14.133 Fases
    'micro_log_4',  // Dispensa x Inexigibilidade
    'micro_log_7',  // Lei 13.303 Contratos
    'micro_log_15', // Matriz de riscos contratuais
    'micro_log_21', // Embalagem e Unitização
    'micro_log_22', // Manuseio de Materiais e Automação
  ];

  const earlyLogisticaList = earlyLogisticaTopicIds
    .map((id) => MICRO_TOPICS.find((m) => m.id === id))
    .filter((m): m is typeof MICRO_TOPICS[0] => Boolean(m));

  const fromOct05LogisticaList = fromOct05LogisticaTopicIds
    .map((id) => MICRO_TOPICS.find((m) => m.id === id))
    .filter((m): m is typeof MICRO_TOPICS[0] => Boolean(m));

  // Group micro-topics by technical discipline (Pareto Camada 3)
  const microByDiscipline: Record<DisciplineId, typeof MICRO_TOPICS> = {
    logistica: fromOct05LogisticaList,
    financas: MICRO_TOPICS.filter((m) => m.disciplineId === 'financas'),
    processos_adm: MICRO_TOPICS.filter((m) => m.disciplineId === 'processos_adm'),
    informatica: MICRO_TOPICS.filter((m) => m.disciplineId === 'informatica'),
    portugues: [],
    matematica: [],
  };

  // Rotation indices
  let earlyLogIdx = 0;
  let postOctLogIdx = 0;
  let finIdx = 0;
  let admIdx = 0;
  let infIdx = 0;

  // Pareto weighting for all 7 days of the week:
  // We alternate disciplines in 20:00-21:30 and 21:30-23:00 to match Pareto distribution
  const weekdayPatterns: [DisciplineId, DisciplineId][] = [
    ['logistica', 'financas'], // Dia A
    ['processos_adm', 'logistica'], // Dia B
    ['financas', 'informatica'], // Dia C
    ['logistica', 'processos_adm'], // Dia D
    ['financas', 'logistica'], // Dia E
    ['processos_adm', 'informatica'], // Dia F
    ['logistica', 'financas'], // Dia G
  ];

  let weekdayPatternIdx = 0;

  const start = new Date(2026, 8, 21); // Sept 21, 2026 (Month is 0-indexed, Sept 21 is Monday)
  const end = new Date(2026, 11, 5); // Dec 5, 2026

  const current = new Date(start);
  let sessionCounter = 1;

  while (current <= end) {
    const dateStr = formatDate(current);
    const dayOfWeek = current.getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
    const isFromOct05 = dateStr >= '2026-10-05';

    // RETA FINAL (28/11/2026 a 04/12/2026): 6 matérias por dia de 1h cada
    // Manhã (09:00 - 11:00), Tarde (14:00 - 16:00), Noite (20:00 - 22:00) com distribuição Pareto
    if (RETA_FINAL_CONFIG[dateStr]) {
      const daySlots = RETA_FINAL_CONFIG[dateStr];
      for (const slot of daySlots) {
        sessions.push({
          id: `sess_rf_${dateStr}_${slot.shift}_${slot.timeSlot.replace(/[: -]/g, '_')}`,
          date: dateStr,
          dayOfWeek,
          timeSlot: slot.timeSlot,
          type: 'reta_final',
          shift: slot.shift,
          disciplineId: slot.disciplineId,
          microTopicId: slot.microTopicId,
          title: slot.title,
          subtitle: slot.subtitle,
          targetMinutes: 60,
          studiedMinutes: 0,
          completed: false,
        });
      }
      current.setDate(current.getDate() + 1);
      continue;
    }

    // 1. Check for 18:00 - 19:00 slot (Português and Matemática 2x/week, never same day)
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      // Português (Segunda e Quarta)
      sessions.push({
        id: `sess_${sessionCounter++}`,
        date: dateStr,
        dayOfWeek,
        timeSlot: '18:00 - 19:00',
        type: 'basic',
        disciplineId: 'portugues',
        title: 'Língua Portuguesa',
        subtitle: '',
        targetMinutes: 60,
        studiedMinutes: 0,
        completed: false,
      });
    } else if (dayOfWeek === 2 || dayOfWeek === 4) {
      // Matemática (Terça e Quinta)
      sessions.push({
        id: `sess_${sessionCounter++}`,
        date: dateStr,
        dayOfWeek,
        timeSlot: '18:00 - 19:00',
        type: 'basic',
        disciplineId: 'matematica',
        title: 'Matemática',
        subtitle: '',
        targetMinutes: 60,
        studiedMinutes: 0,
        completed: false,
      });
    }

    // 2. Main Evening Study Slots: 20:00 to 23:00 (3 hours every day, 7 days/week!)
    const [disc1, disc2] = weekdayPatterns[weekdayPatternIdx % weekdayPatterns.length];
    weekdayPatternIdx++;

    // Pick next micro topic for disc1
    let topic1 = microByDiscipline[disc1][0];
    if (disc1 === 'logistica') {
      if (!isFromOct05 && earlyLogisticaList.length > 0) {
        topic1 = earlyLogisticaList[earlyLogIdx % earlyLogisticaList.length];
        earlyLogIdx++;
      } else if (fromOct05LogisticaList.length > 0) {
        topic1 = fromOct05LogisticaList[postOctLogIdx % fromOct05LogisticaList.length];
        postOctLogIdx++;
      }
    } else if (disc1 === 'financas' && microByDiscipline.financas.length > 0) {
      topic1 = microByDiscipline.financas[finIdx % microByDiscipline.financas.length];
      finIdx++;
    } else if (disc1 === 'processos_adm' && microByDiscipline.processos_adm.length > 0) {
      topic1 = microByDiscipline.processos_adm[admIdx % microByDiscipline.processos_adm.length];
      admIdx++;
    } else if (disc1 === 'informatica' && microByDiscipline.informatica.length > 0) {
      topic1 = microByDiscipline.informatica[infIdx % microByDiscipline.informatica.length];
      infIdx++;
    }

    // Slot 1: 20:00 - 21:30
    sessions.push({
      id: `sess_${sessionCounter++}`,
      date: dateStr,
      dayOfWeek,
      timeSlot: '20:00 - 21:30',
      type: 'regular',
      disciplineId: disc1,
      microTopicId: topic1.id,
      title: `${DISCIPLINES.find((d) => d.id === disc1)?.shortName}: ${topic1.title}`,
      subtitle: `${topic1.keyConcepts}`,
      targetMinutes: 90,
      studiedMinutes: 0,
      completed: false,
    });

    // Pick next micro topic for disc2
    let topic2 = microByDiscipline[disc2][0];
    if (disc2 === 'logistica') {
      if (!isFromOct05 && earlyLogisticaList.length > 0) {
        topic2 = earlyLogisticaList[earlyLogIdx % earlyLogisticaList.length];
        earlyLogIdx++;
      } else if (fromOct05LogisticaList.length > 0) {
        topic2 = fromOct05LogisticaList[postOctLogIdx % fromOct05LogisticaList.length];
        postOctLogIdx++;
      }
    } else if (disc2 === 'financas' && microByDiscipline.financas.length > 0) {
      topic2 = microByDiscipline.financas[finIdx % microByDiscipline.financas.length];
      finIdx++;
    } else if (disc2 === 'processos_adm' && microByDiscipline.processos_adm.length > 0) {
      topic2 = microByDiscipline.processos_adm[admIdx % microByDiscipline.processos_adm.length];
      admIdx++;
    } else if (disc2 === 'informatica' && microByDiscipline.informatica.length > 0) {
      topic2 = microByDiscipline.informatica[infIdx % microByDiscipline.informatica.length];
      infIdx++;
    }

    // Slot 2: 21:30 - 23:00
    sessions.push({
      id: `sess_${sessionCounter++}`,
      date: dateStr,
      dayOfWeek,
      timeSlot: '21:30 - 23:00',
      type: 'regular',
      disciplineId: disc2,
      microTopicId: topic2.id,
      title: `${DISCIPLINES.find((d) => d.id === disc2)?.shortName}: ${topic2.title}`,
      subtitle: `${topic2.keyConcepts}`,
      targetMinutes: 90,
      studiedMinutes: 0,
      completed: false,
    });

    // Advance 1 day
    current.setDate(current.getDate() + 1);
  }

  return sessions;
}

export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatSecondsToDigital(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const WEEKDAY_NAMES_PT = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function formatDateBrExtended(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_NAMES_PT[date.getDay()]}, ${day} de ${MONTH_NAMES_PT[month - 1]}`;
}
