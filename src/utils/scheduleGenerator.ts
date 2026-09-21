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

export function generateInitialSchedule(): StudySession[] {
  const sessions: StudySession[] = [];

  // Group micro-topics by technical discipline (Pareto Camada 3)
  const microByDiscipline: Record<DisciplineId, typeof MICRO_TOPICS> = {
    logistica: MICRO_TOPICS.filter((m) => m.disciplineId === 'logistica'),
    financas: MICRO_TOPICS.filter((m) => m.disciplineId === 'financas'),
    processos_adm: MICRO_TOPICS.filter((m) => m.disciplineId === 'processos_adm'),
    informatica: MICRO_TOPICS.filter((m) => m.disciplineId === 'informatica'),
    portugues: [],
    matematica: [],
  };

  // Rotation indices
  let logIdx = 0;
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

    // 1. Check for 18:00 - 19:00 slot (Português and Matemática 2x/week, never same day)
    // Basic disciplines have no subtopic contents, only the subject names
    // Monday (1): Português
    // Tuesday (2): Matemática
    // Wednesday (3): Português
    // Thursday (4): Matemática
    // Friday (5), Saturday (6), Sunday (0): None
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
    // Normal study schedule of subtopics for ALL days including Sunday:
    // 2 slots of 1:30 each: 20:00 - 21:30 and 21:30 - 23:00
    const [disc1, disc2] = weekdayPatterns[weekdayPatternIdx % weekdayPatterns.length];
    weekdayPatternIdx++;

    // Pick next micro topic for disc1
    let topic1 = microByDiscipline[disc1][0];
    if (disc1 === 'logistica' && microByDiscipline.logistica.length > 0) {
      topic1 = microByDiscipline.logistica[logIdx % microByDiscipline.logistica.length];
      logIdx++;
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
    if (disc2 === 'logistica' && microByDiscipline.logistica.length > 0) {
      topic2 = microByDiscipline.logistica[logIdx % microByDiscipline.logistica.length];
      logIdx++;
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
