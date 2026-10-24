export type AppTab =
  | 'schedule'
  | 'reta_final'
  | 'questoes_diarias'
  | 'pareto'
  | 'timer'
  | 'backup';

export interface SavedNavigationState {
  currentTab: AppTab;
  // Schedule state
  scheduleSelectedDate?: string;
  scheduleViewMode?: 'daily' | 'weekly' | 'reta_final';
  scheduleFilterDiscipline?: string;
  retaFinalLayout?: 'single_day' | 'all_days';

  // Daily Questions state
  dailyQuestionsFocusedDay?: number;
  dailyQuestionsViewMode?: 'all' | 'single';
  dailyQuestionsDiscipline?: string;
  dailyQuestionsStatusFilter?: 'all' | 'pending' | 'completed';

  // Pareto state
  paretoActiveLayer?: 'all' | 'camada1' | 'camada2' | 'camada3';
  paretoDiscipline?: string;
  paretoTemperature?: string;

  // Timer state
  activeTimerSessionId?: string | null;
  timerElapsedSeconds?: number;
  isTimerRunning?: boolean;
  timerSavedAtTimestamp?: number;
  isTimerModalOpen?: boolean;

  // Scroll positions per tab
  scrollPositions?: Record<string, number>;
  lastSavedAt?: number;
}

const STORAGE_KEY_NAV_STATE = 'pareto_navigation_state_v1';

export function getStoredNavigationState(): SavedNavigationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NAV_STATE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          currentTab: parsed.currentTab || 'schedule',
          scheduleSelectedDate: parsed.scheduleSelectedDate,
          scheduleViewMode: parsed.scheduleViewMode,
          scheduleFilterDiscipline: parsed.scheduleFilterDiscipline,
          retaFinalLayout: parsed.retaFinalLayout,
          dailyQuestionsFocusedDay: parsed.dailyQuestionsFocusedDay,
          dailyQuestionsViewMode: parsed.dailyQuestionsViewMode,
          dailyQuestionsDiscipline: parsed.dailyQuestionsDiscipline,
          dailyQuestionsStatusFilter: parsed.dailyQuestionsStatusFilter,
          paretoActiveLayer: parsed.paretoActiveLayer,
          paretoDiscipline: parsed.paretoDiscipline,
          paretoTemperature: parsed.paretoTemperature,
          activeTimerSessionId: parsed.activeTimerSessionId,
          timerElapsedSeconds: parsed.timerElapsedSeconds,
          isTimerRunning: parsed.isTimerRunning,
          timerSavedAtTimestamp: parsed.timerSavedAtTimestamp,
          isTimerModalOpen: parsed.isTimerModalOpen,
          scrollPositions: parsed.scrollPositions || {},
          lastSavedAt: parsed.lastSavedAt,
        };
      }
    }
  } catch (err) {
    console.error('Error loading navigation state', err);
  }

  return {
    currentTab: 'schedule',
    scrollPositions: {},
  };
}

export function saveStoredNavigationState(partial: Partial<SavedNavigationState>): void {
  try {
    const current = getStoredNavigationState();
    const updated: SavedNavigationState = {
      ...current,
      ...partial,
      scrollPositions: {
        ...(current.scrollPositions || {}),
        ...(partial.scrollPositions || {}),
      },
      lastSavedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_NAV_STATE, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving navigation state', err);
  }
}

export function saveTabScrollPosition(tab: string, scrollY: number): void {
  try {
    const current = getStoredNavigationState();
    const scrollPositions = { ...(current.scrollPositions || {}), [tab]: Math.max(0, Math.round(scrollY)) };
    saveStoredNavigationState({ scrollPositions });
  } catch (err) {
    console.error('Error saving tab scroll position', err);
  }
}

export function getTabScrollPosition(tab: string): number {
  try {
    const current = getStoredNavigationState();
    return current.scrollPositions?.[tab] || 0;
  } catch {
    return 0;
  }
}
