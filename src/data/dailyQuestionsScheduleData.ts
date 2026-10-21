import { DisciplineId } from '../types';

export interface DailyScheduleBlock {
  id: string; // e.g. 'd1_b1'
  blockIndex: number; // 1, 2, 3, 4
  duration: string; // '45 min'
  disciplineId: DisciplineId;
  disciplineName: string;
  subtopicTitle: string;
  microTopicId: string;
  summary: string;
}

export interface DailyScheduleDay {
  dayNumber: number; // 1 to 50
  totalDaily: string; // '3h'
  blocks: DailyScheduleBlock[];
}

// Master summary lookup by microTopicId
export const SUBTOPIC_METADATA: Record<string, { summary: string; disciplineId: DisciplineId; fullTitle: string }> = {
  micro_adm_1: {
    disciplineId: 'processos_adm',
    fullTitle: 'Recrutamento Interno × Externo × Misto: Vantagens e desvantagens',
    summary: 'Interno: mais barato, rápido, motiva o quadro; Externo: traz sangue novo, ideias inovadoras, custo maior.',
  },
  micro_adm_2: {
    disciplineId: 'processos_adm',
    fullTitle: 'Seleção por Competências e Modelo CHA (Conhecimento, Habilidade, Atitude)',
    summary: 'Conhecimento (Saber), Habilidade (Saber fazer), Atitude (Querer fazer). Instrumentos de seleção.',
  },
  micro_adm_3: {
    disciplineId: 'processos_adm',
    fullTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros de Avaliação (Efeito Halo, Leniência)',
    summary: 'Efeito Halo (generalização positiva) / Horn (negativa), tendência central, recentidade e leniência.',
  },
  micro_adm_4: {
    disciplineId: 'processos_adm',
    fullTitle: 'T&D&E: Diferença entre Treinamento × Desenvolvimento × Educação e Ciclo LNT',
    summary: 'Treinamento (cargo atual), Desenvolvimento (carreira/futuro), Educação (holística). Ciclo: LNT -> Desenho -> Execução -> Avaliação.',
  },
  micro_adm_5: {
    disciplineId: 'processos_adm',
    fullTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
    summary: 'ISO 9001 (Qualidade), ISO 14001 (Gestão Ambiental), ISO 45001 (Saúde e Segurança). Estrutura de alto nível compartilhada.',
  },
  micro_adm_6: {
    disciplineId: 'processos_adm',
    fullTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva × Correção e Auditoria Interna',
    summary: 'PDCA (Plan, Do, Check, Act). Auditoria de 1ª parte (interna), 2ª parte (fornecedor/cliente) e 3ª parte (certificadora).',
  },
  micro_adm_7: {
    disciplineId: 'processos_adm',
    fullTitle: 'Indicadores de Desempenho: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
    summary: 'Eficiência (fazer certo com menos recursos), Eficácia (meta), Efetividade (impacto real). 4 perspectivas BSC.',
  },
  micro_adm_8: {
    disciplineId: 'processos_adm',
    fullTitle: 'Indicadores ESG (Environmental, Social, Governance) e Relatórios GRI',
    summary: '3 pilares de sustentabilidade, métricas de carbono, diversidade, integridade e governança corporativa.',
  },
  micro_adm_9: {
    disciplineId: 'processos_adm',
    fullTitle: 'Administração Patrimonial: Inventário, tombamento e depreciação linear (cálculo)',
    summary: 'Depreciação: (Custo Aquisição - Valor Residual) / Vida Útil. Conciliação físico-contábil e tombamento.',
  },
  micro_adm_10: {
    disciplineId: 'processos_adm',
    fullTitle: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e Indicadores PCM',
    summary: 'Preditiva (sensores/vibração), Preventiva (tempo/horas), Corretiva (após falha). MTBF e MTTR.',
  },
  micro_log_1: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 14.133/2021 — Princípios fundamentais e definições (arts. 5º e 6º)',
    summary: 'Estudo técnico preliminar, matriz de riscos, segregação de funções e novos princípios expressos.',
  },
  micro_log_2: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
    summary: 'Pregão (bens comuns), Concorrência, Concurso, Leilão e Diálogo Competitivo. Critérios de menor preço e maior desconto.',
  },
  micro_log_3: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 14.133/2021 — Fases da licitação e inversão de fases',
    summary: 'Fase preparatória, edital, propostas, julgamento, habilitação, recursal e homologação.',
  },
  micro_log_4: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
    summary: 'Inexigibilidade (inviabilidade de competição, fornecedor exclusivo) vs Dispensa (limites de valor, rol taxativo).',
  },
  micro_log_5: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais, Dispensa e Não Aplicação',
    summary: 'Regras Petrobras/Transpetro: hipóteses de não aplicação (atividade-fim, parcerias) e dispensa de valor.',
  },
  micro_log_6: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, modos de disputa e matriz de riscos',
    summary: 'Modos de disputa aberto, fechado ou combinado. Inversão automática de fases nas estatais.',
  },
  micro_log_7: {
    disciplineId: 'logistica',
    fullTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos, formalização, alterações e fiscalização',
    summary: 'Cláusulas obrigatórias, garantias, aditivos contratuais, sanções administrativas e rescisão.',
  },
  micro_log_8: {
    disciplineId: 'logistica',
    fullTitle: 'Curva ABC e classificação de materiais por valor e criticidade (XYZ/PQR)',
    summary: 'Classe A (80% valor, 20% itens), Classe B (15% valor, 30% itens), Classe C (5% valor, 50% itens). Criticidade XYZ.',
  },
  micro_log_9: {
    disciplineId: 'logistica',
    fullTitle: 'Ponto de pedido, estoque de segurança, tempo de reposição (Lead Time)',
    summary: 'Fórmulas: PP = (Consumo Médio Diário x Lead Time) + Estoque de Segurança. Conceito de ruptura.',
  },
  micro_log_10: {
    disciplineId: 'logistica',
    fullTitle: 'Giro e cobertura de estoques (fórmulas e interpretação)',
    summary: 'Giro = Consumo / Estoque Médio; Cobertura = 1 / Giro (ou Estoque / Consumo por período).',
  },
  micro_log_11: {
    disciplineId: 'logistica',
    fullTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
    summary: 'Custo de posse (armazenagem) x Custo de pedido. Ponto ótimo onde os custos se igualam.',
  },
  micro_log_12: {
    disciplineId: 'logistica',
    fullTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio Ponderado',
    summary: 'Impacto inflacionário no estoque final com PEPS vs Custo Médio Ponderado (UEPS não aceito no fisco BR).',
  },
  micro_log_13: {
    disciplineId: 'logistica',
    fullTitle: 'Ciclo de vida contratual: Gestor do Contrato × Fiscal do Contrato',
    summary: 'Fiscal atesta execução e ocorrências; Gestor coordena aspectos administrativos, apostilas e aditivos.',
  },
  micro_log_14: {
    disciplineId: 'logistica',
    fullTitle: 'Aditivos contratuais: Limites de 25% e 50% (reforma) e Apostilamento',
    summary: 'Limites legais de acréscimo/supressão vs simples apostilamento (reajustes e variações previstas).',
  },
  micro_log_15: {
    disciplineId: 'logistica',
    fullTitle: 'Gestão de riscos contratuais, matriz de riscos e contratos digitais',
    summary: 'Alocação de riscos entre contratante e contratado, equilíbrio econômico-financeiro e assinaturas digitais.',
  },
  micro_fin_1: {
    disciplineId: 'financas',
    fullTitle: 'Juros Simples e Juros Compostos (Cálculo de montante, taxa e prazo)',
    summary: 'J = C.i.t / M = C(1+i)^t. Fórmulas de juros e cálculo rápido de montante sem calculadora.',
  },
  micro_fin_2: {
    disciplineId: 'financas',
    fullTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
    summary: 'Db = N.i.t (sobre valor nominal) vs Dr = A.i.t (sobre valor atual). Diferenças fundamentais de base.',
  },
  micro_fin_3: {
    disciplineId: 'financas',
    fullTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fórmula de Fisher)',
    summary: 'Conversão de taxas compostas e fórmula de Fisher para expurgar a inflação: (1+in) = (1+ir)(1+ip).',
  },
  micro_fin_4: {
    disciplineId: 'financas',
    fullTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
    summary: 'Fatores multiplicadores (1+i) e (1-i), relação lucro sobre custo vs lucro sobre a venda (mark-up).',
  },
  micro_fin_5: {
    disciplineId: 'financas',
    fullTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
    summary: 'Ordem de liquidez decrescente (Circulante, Realizável a Longo Prazo, Imobilizado) e exigibilidade no Passivo.',
  },
  micro_fin_6: {
    disciplineId: 'financas',
    fullTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
    summary: 'Receita Bruta - Deduções = Líquida - CMV = Lucro Bruto - Despesas = EBIT - Fin = LAIR - IR/CSLL = Lucro Líquido.',
  },
  micro_fin_7: {
    disciplineId: 'financas',
    fullTitle: 'Demonstração dos Fluxos de Caixa (DFC) Método Direto × Indireto',
    summary: 'Método Direto (recebimentos e pagamentos brutos) vs Indireto (ajuste do Lucro Líquido pela depreciação).',
  },
  micro_fin_8: {
    disciplineId: 'financas',
    fullTitle: 'Classificação de contas, partidas dobradas (Débito e Crédito) e Regime de Competência',
    summary: 'Débito aumenta Ativo e Despesas; Crédito aumenta Passivo, PL e Receitas. Fatos permutativos e modificativos.',
  },
  micro_inf_1: {
    disciplineId: 'informatica',
    fullTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado pessoal × sensível, agentes e bases legais',
    summary: 'Dados sensíveis (biometria, saúde, raça). Controlador x Operador. 10 bases legais e direitos do titular.',
  },
  micro_inf_2: {
    disciplineId: 'informatica',
    fullTitle: 'Segurança da Informação: Princípios CID, Malware (Ransomware, Phishing) e Backup',
    summary: 'Confidencialidade, Integridade, Disponibilidade, Autenticidade. Phishing, Ransomware e tipos de backup.',
  },
  micro_inf_3: {
    disciplineId: 'informatica',
    fullTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
    summary: 'Cifrão $ para fixar linhas/colunas ($A$1, A$1, $A1), condições lógicas e contagens condicionais.',
  },
  micro_inf_4: {
    disciplineId: 'informatica',
    fullTitle: 'Excel 2024: PROCV e PROCX (sintaxe, busca exata vs aproximada)',
    summary: 'Sintaxe PROCV vs PROCX, vantagem da busca à esquerda, tratamento de erros e correspondência exata.',
  },
  micro_inf_5: {
    disciplineId: 'informatica',
    fullTitle: 'Windows 11, Navegadores (Atalhos, aba anônima, cookies) e Conceitos de Internet/Intranet',
    summary: 'Atalhos essenciais (Ctrl+Shift+N, Win+E, Win+D), cache/cookies, intranet privada vs internet pública.',
  },
};

// Raw table definition for the 50 days (4 blocks per day)
const RAW_50_DAYS_SCHEDULE: Array<{
  day: number;
  blocks: Array<{
    disciplineName: string;
    subtopicTitle: string;
    microTopicId: string;
  }>;
}> = [
  // Dia 1
  {
    day: 1,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Princípios e definições (arts. 5º e 6º)',
        microTopicId: 'micro_log_1',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Recrutamento Interno × Externo × Misto',
        microTopicId: 'micro_adm_1',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
    ],
  },
  // Dia 2
  {
    day: 2,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        microTopicId: 'micro_log_2',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Seleção por Competências e Modelo CHA',
        microTopicId: 'micro_adm_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Fases e inversão de fases',
        microTopicId: 'micro_log_3',
      },
    ],
  },
  // Dia 3
  {
    day: 3,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        microTopicId: 'micro_log_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros (Halo, Leniência)',
        microTopicId: 'micro_adm_3',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
    ],
  },
  // Dia 4
  {
    day: 4,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
        microTopicId: 'micro_log_5',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'T&D&E: Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        microTopicId: 'micro_adm_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, disputa e matriz de riscos',
        microTopicId: 'micro_log_6',
      },
    ],
  },
  // Dia 5
  {
    day: 5,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos e fiscalização',
        microTopicId: 'micro_log_7',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        microTopicId: 'micro_adm_5',
      },
    ],
  },
  // Dia 6
  {
    day: 6,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Curva ABC e classificação por valor e criticidade (XYZ/PQR)',
        microTopicId: 'micro_log_8',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva e Auditoria Interna',
        microTopicId: 'micro_adm_6',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ponto de pedido, estoque de segurança e Lead Time',
        microTopicId: 'micro_log_9',
      },
    ],
  },
  // Dia 7
  {
    day: 7,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: PROCV e PROCX',
        microTopicId: 'micro_inf_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Giro e cobertura de estoques',
        microTopicId: 'micro_log_10',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        microTopicId: 'micro_adm_7',
      },
    ],
  },
  // Dia 8
  {
    day: 8,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        microTopicId: 'micro_log_11',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores ESG e Relatórios GRI',
        microTopicId: 'micro_adm_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio',
        microTopicId: 'micro_log_12',
      },
    ],
  },
  // Dia 9
  {
    day: 9,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Windows 11, Navegadores (Atalhos, aba anônima) e Internet/Intranet',
        microTopicId: 'micro_inf_5',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ciclo de vida contratual: Gestor × Fiscal do Contrato',
        microTopicId: 'micro_log_13',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Administração Patrimonial: Inventário, tombamento e depreciação linear',
        microTopicId: 'micro_adm_9',
      },
    ],
  },
  // Dia 10
  {
    day: 10,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Aditivos contratuais: Limites de 25% e 50% e Apostilamento',
        microTopicId: 'micro_log_14',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e PCM',
        microTopicId: 'micro_adm_10',
      },
    ],
  },
  // Dia 11
  {
    day: 11,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Gestão de riscos contratuais e matriz de riscos',
        microTopicId: 'micro_log_15',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Princípios e definições (arts. 5º e 6º)',
        microTopicId: 'micro_log_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Recrutamento Interno × Externo × Misto',
        microTopicId: 'micro_adm_1',
      },
    ],
  },
  // Dia 12
  {
    day: 12,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        microTopicId: 'micro_log_2',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Seleção por Competências e Modelo CHA',
        microTopicId: 'micro_adm_2',
      },
    ],
  },
  // Dia 13
  {
    day: 13,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Fases e inversão de fases',
        microTopicId: 'micro_log_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        microTopicId: 'micro_log_4',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
    ],
  },
  // Dia 14
  {
    day: 14,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros (Halo, Leniência)',
        microTopicId: 'micro_adm_3',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
        microTopicId: 'micro_log_5',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
    ],
  },
  // Dia 15
  {
    day: 15,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'T&D&E: Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        microTopicId: 'micro_adm_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, disputa e matriz de riscos',
        microTopicId: 'micro_log_6',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos e fiscalização',
        microTopicId: 'micro_log_7',
      },
    ],
  },
  // Dia 16
  {
    day: 16,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        microTopicId: 'micro_adm_5',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: PROCV e PROCX',
        microTopicId: 'micro_inf_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Curva ABC e classificação por valor e criticidade (XYZ/PQR)',
        microTopicId: 'micro_log_8',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
    ],
  },
  // Dia 17
  {
    day: 17,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva e Auditoria Interna',
        microTopicId: 'micro_adm_6',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ponto de pedido, estoque de segurança e Lead Time',
        microTopicId: 'micro_log_9',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Windows 11, Navegadores (Atalhos, aba anônima) e Internet/Intranet',
        microTopicId: 'micro_inf_5',
      },
    ],
  },
  // Dia 18
  {
    day: 18,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Giro e cobertura de estoques',
        microTopicId: 'micro_log_10',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        microTopicId: 'micro_adm_7',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        microTopicId: 'micro_log_11',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
    ],
  },
  // Dia 19
  {
    day: 19,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores ESG e Relatórios GRI',
        microTopicId: 'micro_adm_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio',
        microTopicId: 'micro_log_12',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
    ],
  },
  // Dia 20
  {
    day: 20,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ciclo de vida contratual: Gestor × Fiscal do Contrato',
        microTopicId: 'micro_log_13',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Administração Patrimonial: Inventário, tombamento e depreciação linear',
        microTopicId: 'micro_adm_9',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Aditivos contratuais: Limites de 25% e 50% e Apostilamento',
        microTopicId: 'micro_log_14',
      },
    ],
  },
  // Dia 21
  {
    day: 21,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e PCM',
        microTopicId: 'micro_adm_10',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Gestão de riscos contratuais e matriz de riscos',
        microTopicId: 'micro_log_15',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
    ],
  },
  // Dia 22
  {
    day: 22,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Princípios e definições (arts. 5º e 6º)',
        microTopicId: 'micro_log_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Recrutamento Interno × Externo × Misto',
        microTopicId: 'micro_adm_1',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        microTopicId: 'micro_log_2',
      },
    ],
  },
  // Dia 23
  {
    day: 23,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Seleção por Competências e Modelo CHA',
        microTopicId: 'micro_adm_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Fases e inversão de fases',
        microTopicId: 'micro_log_3',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
    ],
  },
  // Dia 24
  {
    day: 24,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        microTopicId: 'micro_log_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros (Halo, Leniência)',
        microTopicId: 'micro_adm_3',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
        microTopicId: 'micro_log_5',
      },
    ],
  },
  // Dia 25
  {
    day: 25,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: PROCV e PROCX',
        microTopicId: 'micro_inf_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'T&D&E: Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        microTopicId: 'micro_adm_4',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, disputa e matriz de riscos',
        microTopicId: 'micro_log_6',
      },
    ],
  },
  // Dia 26
  {
    day: 26,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos e fiscalização',
        microTopicId: 'micro_log_7',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        microTopicId: 'micro_adm_5',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Windows 11, Navegadores (Atalhos, aba anônima) e Internet/Intranet',
        microTopicId: 'micro_inf_5',
      },
    ],
  },
  // Dia 27
  {
    day: 27,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Curva ABC e classificação por valor e criticidade (XYZ/PQR)',
        microTopicId: 'micro_log_8',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva e Auditoria Interna',
        microTopicId: 'micro_adm_6',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ponto de pedido, estoque de segurança e Lead Time',
        microTopicId: 'micro_log_9',
      },
    ],
  },
  // Dia 28
  {
    day: 28,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Giro e cobertura de estoques',
        microTopicId: 'micro_log_10',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        microTopicId: 'micro_adm_7',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
    ],
  },
  // Dia 29
  {
    day: 29,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        microTopicId: 'micro_log_11',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores ESG e Relatórios GRI',
        microTopicId: 'micro_adm_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio',
        microTopicId: 'micro_log_12',
      },
    ],
  },
  // Dia 30
  {
    day: 30,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ciclo de vida contratual: Gestor × Fiscal do Contrato',
        microTopicId: 'micro_log_13',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Administração Patrimonial: Inventário, tombamento e depreciação linear',
        microTopicId: 'micro_adm_9',
      },
    ],
  },
  // Dia 31
  {
    day: 31,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Aditivos contratuais: Limites de 25% e 50% e Apostilamento',
        microTopicId: 'micro_log_14',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e PCM',
        microTopicId: 'micro_adm_10',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Gestão de riscos contratuais e matriz de riscos',
        microTopicId: 'micro_log_15',
      },
    ],
  },
  // Dia 32
  {
    day: 32,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Princípios e definições (arts. 5º e 6º)',
        microTopicId: 'micro_log_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Recrutamento Interno × Externo × Misto',
        microTopicId: 'micro_adm_1',
      },
    ],
  },
  // Dia 33
  {
    day: 33,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        microTopicId: 'micro_log_2',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Seleção por Competências e Modelo CHA',
        microTopicId: 'micro_adm_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Fases e inversão de fases',
        microTopicId: 'micro_log_3',
      },
    ],
  },
  // Dia 34
  {
    day: 34,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: PROCV e PROCX',
        microTopicId: 'micro_inf_4',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        microTopicId: 'micro_log_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros (Halo, Leniência)',
        microTopicId: 'micro_adm_3',
      },
    ],
  },
  // Dia 35
  {
    day: 35,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
        microTopicId: 'micro_log_5',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Windows 11, Navegadores (Atalhos, aba anônima) e Internet/Intranet',
        microTopicId: 'micro_inf_5',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'T&D&E: Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        microTopicId: 'micro_adm_4',
      },
    ],
  },
  // Dia 36
  {
    day: 36,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, disputa e matriz de riscos',
        microTopicId: 'micro_log_6',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos e fiscalização',
        microTopicId: 'micro_log_7',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        microTopicId: 'micro_adm_5',
      },
    ],
  },
  // Dia 37
  {
    day: 37,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Curva ABC e classificação por valor e criticidade (XYZ/PQR)',
        microTopicId: 'micro_log_8',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva e Auditoria Interna',
        microTopicId: 'micro_adm_6',
      },
    ],
  },
  // Dia 38
  {
    day: 38,
    blocks: [
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ponto de pedido, estoque de segurança e Lead Time',
        microTopicId: 'micro_log_9',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Giro e cobertura de estoques',
        microTopicId: 'micro_log_10',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
    ],
  },
  // Dia 39
  {
    day: 39,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        microTopicId: 'micro_adm_7',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        microTopicId: 'micro_log_11',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
    ],
  },
  // Dia 40
  {
    day: 40,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores ESG e Relatórios GRI',
        microTopicId: 'micro_adm_8',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio',
        microTopicId: 'micro_log_12',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ciclo de vida contratual: Gestor × Fiscal do Contrato',
        microTopicId: 'micro_log_13',
      },
    ],
  },
  // Dia 41
  {
    day: 41,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Administração Patrimonial: Inventário, tombamento e depreciação linear',
        microTopicId: 'micro_adm_9',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Aditivos contratuais: Limites de 25% e 50% e Apostilamento',
        microTopicId: 'micro_log_14',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
    ],
  },
  // Dia 42
  {
    day: 42,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Tipos de Manutenção: Preventiva × Preditiva × Corretiva × Detectiva e PCM',
        microTopicId: 'micro_adm_10',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Gestão de riscos contratuais e matriz de riscos',
        microTopicId: 'micro_log_15',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: PROCV e PROCX',
        microTopicId: 'micro_inf_4',
      },
    ],
  },
  // Dia 43
  {
    day: 43,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Princípios e definições (arts. 5º e 6º)',
        microTopicId: 'micro_log_1',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Recrutamento Interno × Externo × Misto',
        microTopicId: 'micro_adm_1',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Modalidades e critérios de julgamento',
        microTopicId: 'micro_log_2',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura do Balanço Patrimonial: Ativo, Passivo e PL',
        microTopicId: 'micro_fin_5',
      },
    ],
  },
  // Dia 44
  {
    day: 44,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Seleção por Competências e Modelo CHA',
        microTopicId: 'micro_adm_2',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Fases e inversão de fases',
        microTopicId: 'micro_log_3',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Estrutura da DRE: Da Receita Bruta ao Lucro Líquido',
        microTopicId: 'micro_fin_6',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Windows 11, Navegadores (Atalhos, aba anônima) e Internet/Intranet',
        microTopicId: 'micro_inf_5',
      },
    ],
  },
  // Dia 45
  {
    day: 45,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 14.133/2021 — Contratação direta: Dispensa × Inexigibilidade',
        microTopicId: 'micro_log_4',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Avaliação de Desempenho (90º, 180º, 360º) e Erros (Halo, Leniência)',
        microTopicId: 'micro_adm_3',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Demonstração dos Fluxos de Caixa (DFC) Direto × Indireto',
        microTopicId: 'micro_fin_7',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 28–41 — Licitação nas Estatais e Dispensa',
        microTopicId: 'micro_log_5',
      },
    ],
  },
  // Dia 46
  {
    day: 46,
    blocks: [
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'T&D&E: Treinamento × Desenvolvimento × Educação e Ciclo LNT',
        microTopicId: 'micro_adm_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 42–67 — Procedimento, disputa e matriz de riscos',
        microTopicId: 'micro_log_6',
      },
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'LGPD (Lei 13.709/2018): Conceitos, dado sensível, agentes e bases legais',
        microTopicId: 'micro_inf_1',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Classificação de contas, partidas dobradas e Regime de Competência',
        microTopicId: 'micro_fin_8',
      },
    ],
  },
  // Dia 47
  {
    day: 47,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Lei 13.303/2016 arts. 68–91 — Contratos e fiscalização',
        microTopicId: 'micro_log_7',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Sistema de Gestão Integrado (SGI): Normas ISO 9001, ISO 14001 e ISO 45001',
        microTopicId: 'micro_adm_5',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Juros Simples e Juros Compostos',
        microTopicId: 'micro_fin_1',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Curva ABC e classificação por valor e criticidade (XYZ/PQR)',
        microTopicId: 'micro_log_8',
      },
    ],
  },
  // Dia 48
  {
    day: 48,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Segurança da Informação: Princípios CID, Malware e Backup',
        microTopicId: 'micro_inf_2',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Ciclo PDCA, Ação Corretiva × Preventiva e Auditoria Interna',
        microTopicId: 'micro_adm_6',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Ponto de pedido, estoque de segurança e Lead Time',
        microTopicId: 'micro_log_9',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Desconto Simples Comercial (por fora) × Desconto Simples Racional (por dentro)',
        microTopicId: 'micro_fin_2',
      },
    ],
  },
  // Dia 49
  {
    day: 49,
    blocks: [
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Giro e cobertura de estoques',
        microTopicId: 'micro_log_10',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores: Eficiência × Eficácia × Efetividade, KPIs, SMART e BSC',
        microTopicId: 'micro_adm_7',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Taxas equivalentes, nominais, efetivas e taxa real (Fisher)',
        microTopicId: 'micro_fin_3',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Custos de estoque e Lote Econômico de Compra (LEC / EOQ)',
        microTopicId: 'micro_log_11',
      },
    ],
  },
  // Dia 50
  {
    day: 50,
    blocks: [
      {
        disciplineName: 'Informática & Segurança de Dados',
        subtopicTitle: 'Excel 2024: Fórmulas SE, SOMASE, CONT.SE, MÉDIA e Referências ($A$1)',
        microTopicId: 'micro_inf_3',
      },
      {
        disciplineName: 'Processos Adm. & Legislação',
        subtopicTitle: 'Indicadores ESG e Relatórios GRI',
        microTopicId: 'micro_adm_8',
      },
      {
        disciplineName: 'Finanças & Contabilidade',
        subtopicTitle: 'Porcentagem: Aumentos e descontos sucessivos, margens',
        microTopicId: 'micro_fin_4',
      },
      {
        disciplineName: 'Logística & Gestão de Suprimentos',
        subtopicTitle: 'Métodos de valoração de estoque: PEPS (FIFO), UEPS (LIFO) e Custo Médio',
        microTopicId: 'micro_log_12',
      },
    ],
  },
];

// Compiled schedule with unique block IDs and enriched summaries
export const DAILY_QUESTIONS_50_DAYS: DailyScheduleDay[] = RAW_50_DAYS_SCHEDULE.map((item) => {
  return {
    dayNumber: item.day,
    totalDaily: '3h',
    blocks: item.blocks.map((block, idx) => {
      const meta = SUBTOPIC_METADATA[block.microTopicId] || {
        summary: '',
        disciplineId: 'logistica' as DisciplineId,
        fullTitle: block.subtopicTitle,
      };

      return {
        id: `d${item.day}_b${idx + 1}`,
        blockIndex: idx + 1,
        duration: '45 min',
        disciplineId: meta.disciplineId,
        disciplineName: block.disciplineName,
        subtopicTitle: block.subtopicTitle,
        microTopicId: block.microTopicId,
        summary: meta.summary,
      };
    }),
  };
});

export const TOTAL_SCHEDULE_DAYS = DAILY_QUESTIONS_50_DAYS.length; // 50
export const TOTAL_SCHEDULE_BLOCKS = TOTAL_SCHEDULE_DAYS * 4; // 200
