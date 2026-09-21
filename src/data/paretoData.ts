import { DisciplineInfo, MesoTopic, MicroTopic } from '../types';

export const DISCIPLINES: DisciplineInfo[] = [
  {
    id: 'logistica',
    name: 'Logística & Gestão de Suprimentos',
    shortName: 'Logística',
    targetHours: 54,
    questionsCount: 14,
    examSharePercent: 35,
    priorityBadge: 'PRIORITÁRIA',
    color: '#0284c7', // Sky-600
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-400',
    description:
      'Coração da ênfase (8 tópicos no Anexo IV). Envolve Compras Públicas (Lei 13.303 e 14.133), Gestão de Contratos e Estoques. Representa o maior volume e peso da prova.',
  },
  {
    id: 'financas',
    name: 'Finanças & Contabilidade',
    shortName: 'Finanças',
    targetHours: 39,
    questionsCount: 10,
    examSharePercent: 25,
    priorityBadge: 'PRIORITÁRIA',
    color: '#10b981', // Emerald-500
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    description:
      'Contabilidade prática e Gerencial: Balanço Patrimonial, DRE, Demonstração dos Fluxos de Caixa (DFC direto × indireto), partidas dobradas e regime de competência.',
  },
  {
    id: 'processos_adm',
    name: 'Processos Adm. & Legislação',
    shortName: 'Processos Adm.',
    targetHours: 36,
    questionsCount: 10,
    examSharePercent: 25,
    priorityBadge: 'PRIORITÁRIA',
    color: '#f59e0b', // Amber-500
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    description:
      'Gestão de Recursos Humanos (R&S, avaliação 360º, cargos), SGI (ISO 9001/14001/45001), Gestão de Riscos, Indicadores ESG/BSC e Gestão de Manutenção/Patrimônio.',
  },
  {
    id: 'informatica',
    name: 'Informática & Segurança de Dados',
    shortName: 'Informática',
    targetHours: 21,
    questionsCount: 6,
    examSharePercent: 15,
    priorityBadge: 'COMPLEMENTAR',
    color: '#8b5cf6', // Violet-500
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    description:
      'Bloco de altíssimo custo-benefício: LGPD (Lei 13.709/18), Segurança da Informação (CID, malware) e fórmulas do Excel (PROCV/PROCX, SE, SOMASE).',
  },
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    shortName: 'Português',
    targetHours: 22,
    questionsCount: 10,
    examSharePercent: 15,
    priorityBadge: 'BÁSICA',
    color: '#ec4899', // Pink-500
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    description:
      'Matéria básica do edital (18h às 19h, 2x por semana em dias alternados: segundas e quartas).',
  },
  {
    id: 'matematica',
    name: 'Matemática & Raciocínio Lógico',
    shortName: 'Matemática',
    targetHours: 22,
    questionsCount: 10,
    examSharePercent: 15,
    priorityBadge: 'BÁSICA',
    color: '#06b6d4', // Cyan-500
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    description:
      'Matéria básica do edital (18h às 19h, 2x por semana em dias alternados: terças e quintas).',
  },
];

export const MESO_TOPICS: MesoTopic[] = [
  // --- Logística & Gestão de Suprimentos ---
  {
    id: 'meso_log_1',
    disciplineId: 'logistica',
    order: 1,
    title: 'Gestão de Compras — Lei 13.303/2016 (arts. 28–91) e Lei 14.133/2021',
    strategyTip:
      'O item 7.3 é o único ponto do edital que cita artigos específicos de lei ("arts 28 ao 91" da 13.303). A banca Cesgranrio sempre cobra a literalidade dessas regras para estatais!',
    retomadasCount: 7,
    phases: 'Presente nas 3 Fases (S1, S2, S6, S7, S11, S15)',
    frequency: 'Alta (Quase 100% de incidência)',
    temperature: 'fervendo',
    hours: 18,
  },
  {
    id: 'meso_log_2',
    disciplineId: 'logistica',
    order: 2,
    title: 'Gestão de Estoques (Curva ABC, políticas, nível de serviço, LEC)',
    strategyTip:
      'Curva ABC, ponto de pedido, estoque de segurança e cálculo de giro/cobertura são cobranças clássicas e de resolução direta.',
    retomadasCount: 5,
    phases: 'Presente nas 3 Fases (S2, S4, S7, S9, S12)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 10,
  },
  {
    id: 'meso_log_3',
    disciplineId: 'logistica',
    order: 3,
    title: 'Gestão de Contratos (Ciclo de vida, fiscalização, aditivos, riscos)',
    strategyTip:
      'A atribuição do cargo no Anexo III é literalmente "Executar a fiscalização técnica e administrativa dos contratos". Conhecer limites de aditivos (25%/50%) e apostilamento é essencial.',
    retomadasCount: 5,
    phases: 'Presente nas 3 Fases (S2, S5, S7, S10, S14)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 9,
  },
  {
    id: 'meso_log_4',
    disciplineId: 'logistica',
    order: 4,
    title: 'Logística e SCM — Conceitos, logística verde e tecnologias emergentes',
    strategyTip: 'Conceito de Supply Chain Management, Logística Reversa e ESG na cadeia de suprimentos.',
    retomadasCount: 3,
    phases: 'Fase 1 (S1) · Fase 2 (S6) · Fase 3 (S11)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 6,
  },
  {
    id: 'meso_log_5',
    disciplineId: 'logistica',
    order: 5,
    title: 'Modalidades de Transporte (Intermodalidade e Multimodalidade, ANTT/ANTAQ)',
    strategyTip:
      'A Cesgranrio adora diferenciar transporte intermodal (múltiplos contratos/CT-e) de multimodal (um único OTM e conhecimento único).',
    retomadasCount: 3,
    phases: 'Fase 1 (S1) · Fase 2 (S6) · Fase 3 (S11)',
    frequency: 'Média-Alta',
    temperature: 'quente',
    hours: 4,
  },
  {
    id: 'meso_log_6',
    disciplineId: 'logistica',
    order: 6,
    title: 'Armazenagem (Tipos de armazéns, layout, organização e WMS)',
    strategyTip: 'Critérios de endereçamento, sistemas WMS e ergonomia/fluxos de armazenagem.',
    retomadasCount: 3,
    phases: 'Fase 1 (S2) · Fase 2 (S7) · Fase 3 (S12)',
    frequency: 'Média',
    temperature: 'morno',
    hours: 3,
  },
  {
    id: 'meso_log_7',
    disciplineId: 'logistica',
    order: 7,
    title: 'Embalagem e Unitização de Cargas (Pallets, contêineres, sustentabilidade)',
    strategyTip: 'Padrão PBR, unitização e proteção contra avarias no transporte marítimo e rodoviário.',
    retomadasCount: 2,
    phases: 'Fase 1 (S4) · Fase 2 (S9)',
    frequency: 'Média-Baixa',
    temperature: 'morno',
    hours: 2,
  },
  {
    id: 'meso_log_8',
    disciplineId: 'logistica',
    order: 8,
    title: 'Manuseio de Materiais / Equipamentos de Movimentação e Automação',
    strategyTip: 'Empilhadeiras, pontes rolantes, esteiras e AGVs (veículos guiados automaticamente).',
    retomadasCount: 2,
    phases: 'Fase 1 (S4) · Fase 2 (S9)',
    frequency: 'Baixa',
    temperature: 'frio',
    hours: 2,
  },

  // --- Finanças & Contabilidade ---
  {
    id: 'meso_fin_2',
    disciplineId: 'financas',
    order: 1,
    title: 'Balanço Patrimonial e DRE (Estrutura, ordem de liquidez, relação)',
    strategyTip:
      'Entender a ordem decrescente de liquidez no Ativo, exigibilidade no Passivo e estrutura completa da DRE da Receita Bruta ao Lucro Líquido.',
    retomadasCount: 10,
    phases: 'Presente em todas as fases e semanas',
    frequency: 'Altíssima',
    temperature: 'fervendo',
    hours: 15,
  },
  {
    id: 'meso_fin_3',
    disciplineId: 'financas',
    order: 2,
    title: 'Demonstração dos Fluxos de Caixa (DFC: Método Direto × Indireto, Atividades)',
    strategyTip:
      'Método direto (recebimentos/pagamentos operacionais brutos) vs método indireto (reconciliação a partir do Lucro Líquido + depreciação/não-caixa).',
    retomadasCount: 8,
    phases: 'Presente em todas as fases e semanas',
    frequency: 'Alta',
    temperature: 'fervendo',
    hours: 12,
  },
  {
    id: 'meso_fin_4',
    disciplineId: 'financas',
    order: 3,
    title: 'Registros Contábeis / Partidas Dobradas / Regime de Competência × Caixa',
    strategyTip:
      'Regra de ouro das contas: Débito aumenta Ativo e Despesa; Crédito aumenta Passivo, PL e Receita. Fatos contábeis permutativos e modificativos.',
    retomadasCount: 8,
    phases: 'Presente em todas as fases e semanas',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 12,
  },

  // --- Processos Adm. & Legislação ---
  {
    id: 'meso_adm_1',
    disciplineId: 'processos_adm',
    order: 1,
    title: 'Recursos Humanos (R&S, Plano de Cargos, T&D&E, Desempenho 360º, CHA)',
    strategyTip:
      'Recrutamento interno x externo, distinção entre Treinamento x Desenvolvimento x Educação e erros de avaliação (efeito halo, leniência).',
    retomadasCount: 6,
    phases: 'Presente nas 3 Fases (S3, S5, S8, S10, S13, S15)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 12,
  },
  {
    id: 'meso_adm_2',
    disciplineId: 'processos_adm',
    order: 2,
    title: 'Gestão de Indicadores e ESG (Eficiência x Eficácia x Efetividade, KPI, BSC, ESG)',
    strategyTip:
      'ESG (Environmental, Social, Governance) é prioridade máxima em estatais como Transpetro e Petrobras. Saiba os 3 pilares e indicadores GRI.',
    retomadasCount: 5,
    phases: 'Presente nas 3 Fases (S4, S5, S9, S10, S14)',
    frequency: 'Média-Alta (Tema da Moda)',
    temperature: 'quente',
    hours: 8,
  },
  {
    id: 'meso_adm_3',
    disciplineId: 'processos_adm',
    order: 3,
    title: 'Sistema de Gestão Integrado (SGI: ISO 9001/14001/45001, Auditoria e Riscos)',
    strategyTip:
      'Pegadinha clássica: Ação corretiva (elimina a causa da não conformidade) vs Correção (ação imediata para conter o problema).',
    retomadasCount: 4,
    phases: 'Presente nas 3 Fases (S4, S9, S14)',
    frequency: 'Média-Alta',
    temperature: 'quente',
    hours: 7,
  },
  {
    id: 'meso_adm_4',
    disciplineId: 'processos_adm',
    order: 4,
    title: 'Administração Patrimonial (Inventário, tombamento, depreciação linear)',
    strategyTip: 'Cálculo de depreciação linear, tombamento de ativos e controle de inventário físico.',
    retomadasCount: 4,
    phases: 'Fase 1 (S4, S5) · Fase 2 (S9, S10) · Fase 3 (S14)',
    frequency: 'Média',
    temperature: 'morno',
    hours: 5,
  },
  {
    id: 'meso_adm_5',
    disciplineId: 'processos_adm',
    order: 5,
    title: 'Gestão da Manutenção (Preventiva × Corretiva × Preditiva × Detectiva, PCM)',
    strategyTip:
      'MTBF (tempo médio entre falhas) e MTTR (tempo médio para reparo) e disponibilidade operacional.',
    retomadasCount: 3,
    phases: 'Fase 1 (S4) · Fase 2 (S9) · Fase 3 (S14)',
    frequency: 'Média',
    temperature: 'morno',
    hours: 4,
  },

  // --- Informática & Segurança de Dados ---
  {
    id: 'meso_inf_1',
    disciplineId: 'informatica',
    order: 1,
    title: 'Microsoft Excel 2024 (Planilhas, Fórmulas SE, SOMASE, PROCV/PROCX, $)',
    strategyTip:
      'Fórmulas lógicas, busca PROCV/PROCX e fixação de células com $ (referência absoluta e mista) caem em todas as provas de nível médio.',
    retomadasCount: 6,
    phases: 'Presente nas 3 Fases (S2, S5, S7, S10, S12, S15)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 8,
  },
  {
    id: 'meso_inf_2',
    disciplineId: 'informatica',
    order: 2,
    title: 'Segurança da Informação + LGPD (Lei 13.709/2018 - Conceitos, Agentes, Bases)',
    strategyTip:
      'A LGPD é lei curta, cai de forma literal (dado pessoal x sensível, controlador x operador, ANPD). Alto retorno em pontos por hora!',
    retomadasCount: 6,
    phases: 'Presente nas 3 Fases (S2, S5, S7, S10, S12, S15)',
    frequency: 'Alta',
    temperature: 'quente',
    hours: 7,
  },
  {
    id: 'meso_inf_3',
    disciplineId: 'informatica',
    order: 3,
    title: 'Internet, Intranet, Extranet e Navegadores (Atalhos, cookies, aba anônima)',
    strategyTip:
      'Atalhos de navegação e conceitos de redes corporativas (intranet/extranet) versus pública.',
    retomadasCount: 3,
    phases: 'Fase 1 (S2) · Fase 2 (S7) · Fase 3 (S12)',
    frequency: 'Média',
    temperature: 'morno',
    hours: 3,
  },
  {
    id: 'meso_inf_4',
    disciplineId: 'informatica',
    order: 4,
    title: 'Hardware/Software, Windows 11 e Manipulação de Arquivos',
    strategyTip:
      'Atalhos Win 11, extensões de arquivos e gerenciamento de diretórios e memória.',
    retomadasCount: 2,
    phases: 'Fase 1 (S2) · Fase 2 (S7)',
    frequency: 'Média',
    temperature: 'morno',
    hours: 3,
  },
];

export const MICRO_TOPICS: MicroTopic[] = [
  // ==========================================
  // Processos Adm. & Legislação (10 subtópicos)
  // ==========================================
  {
    id: 'micro_adm_1',
    mesoTopicId: 'meso_adm_1',
    disciplineId: 'processos_adm',
    title: 'Recrutamento Interno × Externo × Misto: Vantagens e desvantagens',
    keyConcepts:
      'Interno: mais barato, rápido, motiva o quadro; Externo: traz sangue novo, ideias inovadoras, custo maior.',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_2',
    mesoTopicId: 'meso_adm_1',
    disciplineId: 'processos_adm',
    title: 'Seleção por Competências e Modelo CHA (Conhecimento, Habilidade, Atitude)',
    keyConcepts:
      'Conhecimento (Saber), Habilidade (Saber fazer), Atitude (Querer fazer). Instrumentos de seleção.',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_3',
    mesoTopicId: 'meso_adm_1',
    disciplineId: 'processos_adm',
    title: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros de Avaliação (Efeito Halo, Leniência)',
    keyConcepts:
      'Efeito Halo (generalização positiva) / Horn (generalização negativa), tendência central, efeito de recentidade e leniência.',
    difficulty: 'Médio',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_4',
    mesoTopicId: 'meso_adm_1',
    disciplineId: 'processos_adm',
    title: 'T&D&E: Diferença entre Treinamento × Desenvolvimento × Educação e Ciclo LNT',
    keyConcepts:
      'Treinamento (foco no cargo atual, curto prazo), Desenvolvimento (foco na carreira/futuro), Educação (visão holística/cidadã). Ciclo: LNT -> Desenho -> Execução -> Avaliação.',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_5',
    mesoTopicId: 'meso_adm_3',
    disciplineId: 'processos_adm',
    title: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
    keyConcepts:
      'ISO 9001 (Qualidade), ISO 14001 (Gestão Ambiental), ISO 45001 (Saúde e Segurança Ocupacional). Estrutura de alto nível compartilhada.',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_6',
    mesoTopicId: 'meso_adm_3',
    disciplineId: 'processos_adm',
    title: 'Ciclo PDCA, Ação Corretiva × Preventiva × Correção e Auditoria Interna',
    keyConcepts:
      'PDCA (Plan, Do, Check, Act). Auditoria de 1ª parte (interna), 2ª parte (fornecedor/cliente) e 3ª parte (certificadora externa).',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_7',
    mesoTopicId: 'meso_adm_2',
    disciplineId: 'processos_adm',
    title: 'Indicadores de Desempenho: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
    keyConcepts:
      'Eficiência (fazer certo com menos recursos), Eficácia (atingir a meta), Efetividade (impacto real/mudança no ambiente). 4 perspectivas do BSC (Financeira, Clientes, Processos Internos, Aprendizado).',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_8',
    mesoTopicId: 'meso_adm_2',
    disciplineId: 'processos_adm',
    title: 'Indicadores ESG (Environmental, Social, Governance) e Relatórios GRI',
    keyConcepts:
      'Os 3 pilares da sustentabilidade corporativa, métricas de pegada de carbono, equidade, governança corporativa e integridade.',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_9',
    mesoTopicId: 'meso_adm_4',
    disciplineId: 'processos_adm',
    title: 'Administração Patrimonial: Inventário, tombamento e depreciação linear (cálculo)',
    keyConcepts:
      'Cálculo de depreciação linear: (Custo de Aquisição - Valor Residual) / Vida Útil. Conciliação físico-contábil.',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_adm_10',
    mesoTopicId: 'meso_adm_5',
    disciplineId: 'processos_adm',
    title: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e Indicadores PCM',
    keyConcepts:
      'Preditiva (com sensores/vibração/termografia), Preventiva (por tempo/horas de uso), Corretiva (após falha). MTBF e MTTR.',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },

  // ==========================================
  // Logística & Gestão de Suprimentos (15 subtópicos)
  // ==========================================
  {
    id: 'micro_log_1',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 14.133/2021 — Princípios fundamentais e definições (arts. 5º e 6º)',
    keyConcepts:
      'Conceitos de estudo técnico preliminar, matriz de riscos, seguro-garantia e novos princípios expressos (segregação de funções, planejamento).',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_2',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
    keyConcepts:
      'Pregão (obrigatório para bens comuns), Concorrência, Concurso, Leilão e Diálogo Competitivo. Critérios de menor preço, maior desconto, etc.',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_3',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 14.133/2021 — Fases da licitação e inversão de fases',
    keyConcepts:
      'Fase preparatória, divulgação do edital, apresentação de propostas, julgamento, habilitação, recursal e homologação.',
    difficulty: 'Médio',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_4',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
    keyConcepts:
      'Inexigibilidade (inviabilidade de competição, fornecedor exclusivo, serviço técnico especializado) vs Dispensa (rol taxativo, limites de valor, emergência).',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_5',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais, Dispensa e Não Aplicação',
    keyConcepts:
      'Regras específicas para Petrobras e Transpetro: hipóteses de não aplicação (atividade-fim, parcerias) e limites de dispensa de valor.',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_6',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 13.303/2016 arts. 42–67 — Procedimento, modos de disputa e matriz de riscos',
    keyConcepts:
      'Modos de disputa aberto, fechado ou combinado. Inversão automática de fases nas estatais.',
    difficulty: 'Médio-Difícil',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_7',
    mesoTopicId: 'meso_log_1',
    disciplineId: 'logistica',
    title: 'Lei 13.303/2016 arts. 68–91 — Contratos, formalização, alterações e fiscalização',
    keyConcepts:
      'Cláusulas obrigatórias, garantias, aditivos contratuais, sanções administrativas e rescisão.',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_8',
    mesoTopicId: 'meso_log_2',
    disciplineId: 'logistica',
    title: 'Curva ABC e classificação de materiais por valor e criticidade (XYZ/PQR)',
    keyConcepts:
      'Classe A (80% do valor, 20% dos itens), Classe B (15% valor, 30% itens), Classe C (5% valor, 50% itens).',
    difficulty: 'Fácil',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_log_9',
    mesoTopicId: 'meso_log_2',
    disciplineId: 'logistica',
    title: 'Ponto de pedido, estoque de segurança, tempo de reposição (Lead Time)',
    keyConcepts:
      'Fórmulas: PP = (Consumo Médio Diário x Lead Time) + Estoque de Segurança. Conceito de ruptura.',
    difficulty: 'Médio',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_10',
    mesoTopicId: 'meso_log_2',
    disciplineId: 'logistica',
    title: 'Giro e cobertura de estoques (fórmulas e interpretação)',
    keyConcepts:
      'Giro = Consumo / Estoque Médio; Cobertura = 1 / Giro (ou Estoque / Consumo por período).',
    difficulty: 'Fácil',
    suggestedHours: 2.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_11',
    mesoTopicId: 'meso_log_2',
    disciplineId: 'logistica',
    title: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
    keyConcepts:
      'Custo de armazenagem (posse) x Custo de pedido. Ponto de equilíbrio onde os dois custos se igualam.',
    difficulty: 'Médio',
    suggestedHours: 2.5,
    isCorePareto: true,
  },
  {
    id: 'micro_log_12',
    mesoTopicId: 'meso_log_2',
    disciplineId: 'logistica',
    title: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio Ponderado',
    keyConcepts:
      'Impacto da inflação no lucro e no valor do estoque final com PEPS vs Custo Médio (UEPS não é aceito pelo fisco brasileiro).',
    difficulty: 'Fácil',
    suggestedHours: 2.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_13',
    mesoTopicId: 'meso_log_3',
    disciplineId: 'logistica',
    title: 'Ciclo de vida contratual: Gestor do Contrato × Fiscal do Contrato',
    keyConcepts:
      'Diferença de atribuições: o fiscal atesta a execução e registra ocorrências; o gestor coordena os aspectos administrativos e aditivos.',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_14',
    mesoTopicId: 'meso_log_3',
    disciplineId: 'logistica',
    title: 'Aditivos contratuais: Limites de 25% e 50% (reforma) e Apostilamento',
    keyConcepts:
      'O que pode ser alterado por aditivo (qualitativo/quantitativo) vs o que é simples apostilamento (reajuste previsto, variação cambial).',
    difficulty: 'Médio',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_log_15',
    mesoTopicId: 'meso_log_3',
    disciplineId: 'logistica',
    title: 'Gestão de riscos contratuais, matriz de riscos e contratos digitais',
    keyConcepts:
      'Alocação de riscos entre contratante e contratado, equilíbrio econômico-financeiro.',
    difficulty: 'Médio',
    suggestedHours: 3.0,
    isCorePareto: true,
  },

  // ==========================================
  // Finanças & Contabilidade (4 subtópicos ampliados)
  // ==========================================
  {
    id: 'micro_fin_5',
    mesoTopicId: 'meso_fin_2',
    disciplineId: 'financas',
    title: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
    keyConcepts:
      'Ordem decrescente de liquidez no Ativo (Circulante, Realizável a Longo Prazo, Investimentos, Imobilizado, Intangível) e exigibilidade no Passivo.',
    difficulty: 'Fácil',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_fin_6',
    mesoTopicId: 'meso_fin_2',
    disciplineId: 'financas',
    title: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
    keyConcepts:
      'Receita Bruta - Deduções = Receita Líquida - CMV = Lucro Bruto - Despesas Operacionais = EBIT/LAJIR - Desp. Financeiras = LAIR - IR/CSLL = Lucro Líquido.',
    difficulty: 'Fácil',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_fin_7',
    mesoTopicId: 'meso_fin_3',
    disciplineId: 'financas',
    title: 'Demonstração dos Fluxos de Caixa (DFC) Método Direto × Indireto',
    keyConcepts:
      'No direto evidencia-se recebimentos e pagamentos brutos; no indireto parte-se do Lucro Líquido ajustando por itens que não afetam o caixa (depreciação).',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_fin_8',
    mesoTopicId: 'meso_fin_4',
    disciplineId: 'financas',
    title: 'Classificação de contas, partidas dobradas (Débito e Crédito) e Regime de Competência',
    keyConcepts:
      'Regra de ouro das contas: Débito aumenta Ativo e Despesa; Crédito aumenta Passivo, PL e Receita. Fatos contábeis permutativos e modificativos.',
    difficulty: 'Fácil',
    suggestedHours: 4.0,
    isCorePareto: true,
  },

  // ==========================================
  // Informática & Segurança de Dados (5 subtópicos)
  // ==========================================
  {
    id: 'micro_inf_1',
    mesoTopicId: 'meso_inf_2',
    disciplineId: 'informatica',
    title: 'LGPD (Lei 13.709/2018): Conceitos, dado pessoal × sensível, agentes e bases legais',
    keyConcepts:
      'Dado pessoal sensível (origem racial, saúde, biometria, etc.). Controlador (toma decisões) x Operador (executa). 10 bases legais e direitos do titular.',
    difficulty: 'Fácil',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_inf_2',
    mesoTopicId: 'meso_inf_2',
    disciplineId: 'informatica',
    title: 'Segurança da Informação: Princípios CID, Malware (Ransomware, Phishing) e Backup',
    keyConcepts:
      'Confidencialidade, Integridade, Disponibilidade, Autenticidade, Não Repúdio. Diferença entre Phishing, Spyware e Ransomware.',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
  {
    id: 'micro_inf_3',
    mesoTopicId: 'meso_inf_1',
    disciplineId: 'informatica',
    title: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
    keyConcepts:
      'Uso do cifrão $ para travar linha ou coluna no arraste de fórmulas. Lógica condicional e contagens.',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_inf_4',
    mesoTopicId: 'meso_inf_1',
    disciplineId: 'informatica',
    title: 'Excel 2024: PROCV e PROCX (sintaxe, busca exata vs aproximada)',
    keyConcepts:
      'Sintaxe: =PROCV(valor_procurado; matriz_tabela; num_indice_coluna; [procurar_intervalo]). Vantagens do PROCX.',
    difficulty: 'Médio',
    suggestedHours: 4.0,
    isCorePareto: true,
  },
  {
    id: 'micro_inf_5',
    mesoTopicId: 'meso_inf_4',
    disciplineId: 'informatica',
    title: 'Windows 11, Navegadores (Atalhos, aba anônima, cookies) e Conceitos de Internet/Intranet',
    keyConcepts:
      'Atalhos essenciais do teclado (Ctrl+Shift+N, Win+E, Win+D), diferença entre internet (pública) e intranet (privada corporativa).',
    difficulty: 'Fácil',
    suggestedHours: 3.0,
    isCorePareto: true,
  },
];
