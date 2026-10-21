import { DisciplineId } from '../types';

export interface DailyQuestionTopicGroup {
  id: string;
  disciplineId: DisciplineId;
  topicTitle: string;
  badge: string;
  color: string;
  borderColor: string;
  subtopics: DailyQuestionSubtopic[];
}

export interface DailyQuestionSubtopic {
  id: string; // e.g. micro_adm_1
  title: string;
  summary: string;
  disciplineId: DisciplineId;
}

export const DAILY_QUESTION_GROUPS: DailyQuestionTopicGroup[] = [
  {
    id: 'group_processos_adm',
    disciplineId: 'processos_adm',
    topicTitle: 'Processos Adm. & Legislação',
    badge: '10 Subtópicos',
    color: 'text-amber-400 bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    subtopics: [
      {
        id: 'micro_adm_1',
        disciplineId: 'processos_adm',
        title: 'Recrutamento Interno × Externo × Misto: Vantagens e desvantagens',
        summary:
          'Interno: mais barato, rápido, motiva o quadro; Externo: traz sangue novo, ideias inovadoras, custo maior.',
      },
      {
        id: 'micro_adm_2',
        disciplineId: 'processos_adm',
        title: 'Seleção por Competências e Modelo CHA (Conhecimento, Habilidade, Atitude)',
        summary:
          'Conhecimento (Saber), Habilidade (Saber fazer), Atitude (Querer fazer). Instrumentos de seleção.',
      },
      {
        id: 'micro_adm_3',
        disciplineId: 'processos_adm',
        title: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros de Avaliação (Efeito Halo, Leniência)',
        summary:
          'Efeito Halo (generalização positiva) / Horn (generalização negativa), tendência central, efeito de recentidade e leniência.',
      },
      {
        id: 'micro_adm_4',
        disciplineId: 'processos_adm',
        title: 'T&D&E: Diferença entre Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        summary:
          'Treinamento (foco no cargo atual, curto prazo), Desenvolvimento (foco na carreira/futuro), Educação (visão holística/cidadã). Ciclo: LNT -> Desenho -> Execução -> Avaliação.',
      },
      {
        id: 'micro_adm_5',
        disciplineId: 'processos_adm',
        title: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        summary:
          'ISO 9001 (Qualidade), ISO 14001 (Gestão Ambiental), ISO 45001 (Saúde e Segurança Ocupacional). Estrutura de alto nível compartilhada.',
      },
      {
        id: 'micro_adm_6',
        disciplineId: 'processos_adm',
        title: 'Ciclo PDCA, Ação Corretiva × Preventiva × Correção e Auditoria Interna',
        summary:
          'PDCA (Plan, Do, Check, Act). Auditoria de 1ª parte (interna), 2ª parte (fornecedor/cliente) e 3ª parte (certificadora externa).',
      },
      {
        id: 'micro_adm_7',
        disciplineId: 'processos_adm',
        title: 'Indicadores de Desempenho: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        summary:
          'Eficiência (fazer certo com menos recursos), Eficácia (atingir a meta), Efetividade (impacto real/mudança no ambiente). 4 perspectivas do BSC (Financeira, Clientes, Processos Internos, Aprendizado).',
      },
      {
        id: 'micro_adm_8',
        disciplineId: 'processos_adm',
        title: 'Indicadores ESG (Environmental, Social, Governance) e Relatórios GRI',
        summary:
          'Os 3 pilares da sustentabilidade corporativa, métricas de pegada de carbono, equidade, governança corporativa e integridade.',
      },
      {
        id: 'micro_adm_9',
        disciplineId: 'processos_adm',
        title: 'Administração Patrimonial: Inventário, tombamento e depreciação linear (cálculo)',
        summary:
          'Cálculo de depreciação linear: (Custo de Aquisição - Valor Residual) / Vida Útil. Conciliação físico-contábil.',
      },
      {
        id: 'micro_adm_10',
        disciplineId: 'processos_adm',
        title: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e Indicadores PCM',
        summary:
          'Preditiva (com sensores/vibração/termografia), Preventiva (por tempo/horas de uso), Corretiva (após falha). MTBF e MTTR.',
      },
    ],
  },
  {
    id: 'group_logistica',
    disciplineId: 'logistica',
    topicTitle: 'Logística & Gestão de Suprimentos',
    badge: '15 Subtópicos',
    color: 'text-sky-400 bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    subtopics: [
      {
        id: 'micro_log_1',
        disciplineId: 'logistica',
        title: 'Lei 14.133/2021 — Princípios fundamentais e definições (arts. 5º e 6º)',
        summary:
          'Conceitos de estudo técnico preliminar, matriz de riscos, seguro-garantia e novos princípios expressos (segregação de funções, planejamento).',
      },
      {
        id: 'micro_log_2',
        disciplineId: 'logistica',
        title: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        summary:
          'Pregão (obrigatório para bens comuns), Concorrência, Concurso, Leilão e Diálogo Competitivo. Critérios de menor preço, maior desconto, etc.',
      },
      {
        id: 'micro_log_3',
        disciplineId: 'logistica',
        title: 'Lei 14.133/2021 — Fases da licitação e inversão de fases',
        summary:
          'Fase preparatória, divulgação do edital, apresentação de propostas, julgamento, habilitação, recursal e homologação.',
      },
      {
        id: 'micro_log_4',
        disciplineId: 'logistica',
        title: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        summary:
          'Inexigibilidade (inviabilidade de competição, fornecedor exclusivo, serviço técnico especializado) vs Dispensa (rol taxativo, limites de valor, emergência).',
      },
      {
        id: 'micro_log_5',
        disciplineId: 'logistica',
        title: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais, Dispensa e Não Aplicação',
        summary:
          'Regras específicas para Petrobras e Transpetro: hipóteses de não aplicação (atividade-fim, parcerias) e limites de dispensa de valor.',
      },
      {
        id: 'micro_log_6',
        disciplineId: 'logistica',
        title: 'Lei 13.303/2016 arts. 42–67 — Procedimento, modos de disputa e matriz de riscos',
        summary:
          'Modos de disputa aberto, fechado ou combinado. Inversão automática de fases nas estatais.',
      },
      {
        id: 'micro_log_7',
        disciplineId: 'logistica',
        title: 'Lei 13.303/2016 arts. 68–91 — Contratos, formalização, alterações e fiscalização',
        summary:
          'Cláusulas obrigatórias, garantias, aditivos contratuais, sanções administrativas e rescisão.',
      },
      {
        id: 'micro_log_8',
        disciplineId: 'logistica',
        title: 'Curva ABC e classificação de materiais por valor e criticidade (XYZ/PQR)',
        summary:
          'Classe A (80% do valor, 20% dos itens), Classe B (15% valor, 30% itens), Classe C (5% valor, 50% itens).',
      },
      {
        id: 'micro_log_9',
        disciplineId: 'logistica',
        title: 'Ponto de pedido, estoque de segurança, tempo de reposição (Lead Time)',
        summary:
          'Fórmulas: PP = (Consumo Médio Diário x Lead Time) + Estoque de Segurança. Conceito de ruptura.',
      },
      {
        id: 'micro_log_10',
        disciplineId: 'logistica',
        title: 'Giro e cobertura de estoques (fórmulas e interpretação)',
        summary:
          'Giro = Consumo / Estoque Médio; Cobertura = 1 / Giro (ou Estoque / Consumo por período).',
      },
      {
        id: 'micro_log_11',
        disciplineId: 'logistica',
        title: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        summary:
          'Custo de armazenagem (posse) x Custo de pedido. Ponto de equilíbrio onde os dois custos se igualam.',
      },
      {
        id: 'micro_log_12',
        disciplineId: 'logistica',
        title: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio Ponderado',
        summary:
          'Impacto da inflação no lucro e no valor do estoque final com PEPS vs Custo Médio (UEPS não é aceito pelo fisco brasileiro).',
      },
      {
        id: 'micro_log_13',
        disciplineId: 'logistica',
        title: 'Ciclo de vida contratual: Gestor do Contrato × Fiscal do Contrato',
        summary:
          'Diferença de atribuições: o fiscal atesta a execução e registra ocorrências; o gestor coordena os aspectos administrativos e aditivos.',
      },
      {
        id: 'micro_log_14',
        disciplineId: 'logistica',
        title: 'Aditivos contratuais: Limites de 25% e 50% (reforma) e Apostilamento',
        summary:
          'O que pode ser alterado por aditivo (qualitativo/quantitativo) vs o que é simples apostilamento (reajuste previsto, variação cambial).',
      },
      {
        id: 'micro_log_15',
        disciplineId: 'logistica',
        title: 'Gestão de riscos contratuais, matriz de riscos e contratos digitais',
        summary:
          'Alocação de riscos entre contratante e contratado, equilíbrio econômico-financeiro.',
      },
    ],
  },
  {
    id: 'group_financas',
    disciplineId: 'financas',
    topicTitle: 'Finanças & Contabilidade',
    badge: '8 Subtópicos',
    color: 'text-emerald-400 bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    subtopics: [
      {
        id: 'micro_fin_1',
        disciplineId: 'financas',
        title: 'Juros Simples e Juros Compostos (Cálculo de montante, taxa e prazo)',
        summary: 'J = C.i.t / M = C(1+i)^t. Resolução rápida sem calculadora.',
      },
      {
        id: 'micro_fin_2',
        disciplineId: 'financas',
        title: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        summary: 'Db = N.i.t (aplicado sobre o valor nominal) vs Dr = A.i.t (aplicado sobre o valor atual).',
      },
      {
        id: 'micro_fin_3',
        disciplineId: 'financas',
        title: 'Taxas equivalentes, nominais, efetivas e taxa real (Fórmula de Fisher)',
        summary: 'Conversão de taxas em regime composto e efeito da inflação sobre o ganho real.',
      },
      {
        id: 'micro_fin_4',
        disciplineId: 'financas',
        title: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        summary:
          'Fatores multiplicadores (1+i) e (1-i), relação lucro sobre o custo x lucro sobre a venda.',
      },
      {
        id: 'micro_fin_5',
        disciplineId: 'financas',
        title: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        summary:
          'Ordem decrescente de liquidez no Ativo (Circulante, Realizável a Longo Prazo, Investimentos, Imobilizado, Intangível) e exigibilidade no Passivo.',
      },
      {
        id: 'micro_fin_6',
        disciplineId: 'financas',
        title: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        summary:
          'Receita Bruta - Deduções = Receita Líquida - CMV = Lucro Bruto - Despesas Operacionais = EBIT/LAJIR - Desp. Financeiras = LAIR - IR/CSLL = Lucro Líquido.',
      },
      {
        id: 'micro_fin_7',
        disciplineId: 'financas',
        title: 'Demonstração dos Fluxos de Caixa (DFC) Método Direto × Indireto',
        summary:
          'No direto evidencia-se recebimentos e pagamentos brutos; no indireto parte-se do Lucro Líquido ajustando por itens que não afetam o caixa (depreciação).',
      },
      {
        id: 'micro_fin_8',
        disciplineId: 'financas',
        title: 'Classificação de contas, partidas dobradas (Débito e Crédito) e Regime de Competência',
        summary:
          'Regra de ouro das contas: Débito aumenta Ativo e Despesa; Crédito aumenta Passivo, PL e Receita. Fatos contábeis permutativos e modificativos.',
      },
    ],
  },
  {
    id: 'group_informatica',
    disciplineId: 'informatica',
    topicTitle: 'Informática & Segurança de Dados',
    badge: '5 Subtópicos',
    color: 'text-violet-400 bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    subtopics: [
      {
        id: 'micro_inf_1',
        disciplineId: 'informatica',
        title: 'LGPD (Lei 13.709/2018): Conceitos, dado pessoal × sensível, agentes e bases legais',
        summary:
          'Dado pessoal sensível (origem racial, saúde, biometria, etc.). Controlador (toma decisões) x Operador (executa). 10 bases legais e direitos do titular.',
      },
      {
        id: 'micro_inf_2',
        disciplineId: 'informatica',
        title: 'Segurança da Informação: Princípios CID, Malware (Ransomware, Phishing) e Backup',
        summary:
          'Confidencialidade, Integridade, Disponibilidade, Autenticidade, Não Repúdio. Diferença entre Phishing, Spyware e Ransomware.',
      },
      {
        id: 'micro_inf_3',
        disciplineId: 'informatica',
        title: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        summary:
          'Uso do cifrão $ para travar linha ou coluna no arraste de fórmulas. Lógica condicional e contagens.',
      },
      {
        id: 'micro_inf_4',
        disciplineId: 'informatica',
        title: 'Excel 2024: PROCV e PROCX (sintaxe, busca exata vs aproximada)',
        summary:
          'Sintaxe: =PROCV(valor_procurado; matriz_tabela; num_indice_coluna; [procurar_intervalo]). Vantagens do PROCX.',
      },
      {
        id: 'micro_inf_5',
        disciplineId: 'informatica',
        title: 'Windows 11, Navegadores (Atalhos, aba anônima, cookies) e Conceitos de Internet/Intranet',
        summary:
          'Atalhos essenciais do teclado (Ctrl+Shift+N, Win+E, Win+D), diferença entre internet (pública) e intranet (privada corporativa).',
      },
    ],
  },
];

export const TOTAL_DAILY_SUBTOPICS_COUNT = DAILY_QUESTION_GROUPS.reduce(
  (acc, g) => acc + g.subtopics.length,
  0
);
