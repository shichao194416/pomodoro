/**
 * Runtime smoke tests.
 *
 * These render the real app in jsdom, so they catch wiring mistakes that a
 * type-check cannot: providers in the wrong order, a crash on mount, missing
 * translation keys, and — most importantly — whether the daily summary counts
 * the right sessions.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { LANDSCAPE_PHONE_QUERY } from './hooks/useMediaQuery';
import { PomodoroProvider } from './hooks/pomodoro/PomodoroContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * jsdom has no matchMedia, so it is stubbed explicitly. Only the landscape
 * query is made to match; the theme query stays false (light theme).
 */
function mockViewport({ landscapePhone }: { landscapePhone: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === LANDSCAPE_PHONE_QUERY ? landscapePhone : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function renderApp() {
  return render(
    <ErrorBoundary fullPage>
      <SettingsProvider>
        <LanguageProvider>
          <ThemeProvider>
            <PomodoroProvider>
              <App />
            </PomodoroProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const MIN = 60;

type StoredSession = {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
  mode?: 'work' | 'break';
};

const seedSessions = (sessions: StoredSession[]) =>
  localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions));

beforeEach(() => {
  localStorage.clear();
  mockViewport({ landscapePhone: false });
  Object.defineProperty(window.navigator, 'language', {
    value: 'zh-CN',
    configurable: true,
  });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('番茄钟 App', () => {
  it('首次打开渲染鼓励语并显示默认 25 分钟倒计时', () => {
    renderApp();

    expect(screen.getByText('加油李世超')).toBeTruthy();
    // Mode indicator label
    expect(screen.getByText('专注学习')).toBeTruthy();
    // Default work duration rendered as MM:SS
    expect(screen.getByText('25:00')).toBeTruthy();
    // Navigation
    expect(screen.getByText('计时')).toBeTruthy();
    expect(screen.getByText('总结')).toBeTruthy();
    // The removable extras are gone.
    expect(screen.queryByText('选择标签')).toBeNull();
    expect(screen.queryByText('横屏查看效果更好')).toBeNull();
    expect(screen.queryByPlaceholderText(/给这次番茄加个备注/)).toBeNull();
  });

  it('每日总结只统计专注时段，并排除休息', () => {
    seedSessions([
      // today: 2 × 25min focus + one 5min break that must NOT count
      { tag: '学习', duration: 25 * MIN, timestamp: NOW, completed: true, mode: 'work' },
      { tag: '学习', duration: 25 * MIN, timestamp: NOW, completed: true, mode: 'work' },
      { tag: '学习', duration: 5 * MIN, timestamp: NOW, completed: true, mode: 'break' },
      // yesterday: 30min focus
      { tag: '学习', duration: 30 * MIN, timestamp: NOW - DAY, completed: true, mode: 'work' },
      // legacy record with no mode field must be treated as focus
      { tag: '学习', duration: 10 * MIN, timestamp: NOW - 2 * DAY, completed: true },
    ]);

    renderApp();
    fireEvent.click(screen.getByLabelText('Stats view'));

    expect(screen.getByText('每日总结')).toBeTruthy();

    // Today: 25 + 25 = 50 minutes (the break is excluded)
    expect(screen.getAllByText('50 分钟').length).toBeGreaterThan(0);

    // Today's pomodoro count line
    expect(screen.getByText(/今日番茄/)).toBeTruthy();
    expect(screen.getByText(/今日番茄[\s\S]*2\s*次/)).toBeTruthy();

    // Grand total: 50 + 30 + 10 = 90 minutes = 1 小时 30 分钟
    expect(screen.getAllByText(/1 小时 30 分钟/).length).toBeGreaterThan(0);

    // Three distinct days are listed
    expect(screen.getByText('今天')).toBeTruthy();
    expect(screen.getByText('昨天')).toBeTruthy();
  });

  it('没有任何记录时显示空状态而不是崩溃', () => {
    renderApp();
    fireEvent.click(screen.getByLabelText('Stats view'));

    expect(screen.getByText('每日总结')).toBeTruthy();
    expect(screen.getAllByText(/0 分钟/).length).toBeGreaterThan(0);
    expect(screen.getByText(/今天还没有学习记录/)).toBeTruthy();
  });

  it('手机横屏时只渲染倒计时和退出按钮，其余界面全部卸载', () => {
    mockViewport({ landscapePhone: true });
    renderApp();

    // The countdown, and the way out of focus mode.
    expect(screen.getByText('25:00')).toBeTruthy();
    expect(screen.getByRole('button', { name: '退出横屏' })).toBeTruthy();
    // The one essential control is still there.
    expect(screen.getByRole('button', { name: '开始' })).toBeTruthy();

    // No chrome and no clutter at all.
    expect(screen.queryByText('加油李世超')).toBeNull();       // header greeting
    expect(screen.queryByText('计时')).toBeNull();             // bottom nav
    expect(screen.queryByText('总结')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Timer view' })).toBeNull();
    // The only label kept is the current phase, so a break is never mistaken
    // for study time.
    expect(screen.getByText('专注学习')).toBeTruthy();
  });

  it('退出专注模式后完整界面回来，且可以再进去', () => {
    mockViewport({ landscapePhone: true });
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: '退出横屏' }));

    // Full interface is back…
    expect(screen.getByText('加油李世超')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Timer view' })).toBeTruthy();
    expect(screen.queryByText('退出横屏')).toBeNull();

    // …and there is a way back into focus mode.
    const reenter = screen.getByRole('button', { name: '专注模式' });
    fireEvent.click(reenter);
    expect(screen.getByRole('button', { name: '退出横屏' })).toBeTruthy();
  });

  it('竖屏时不进入专注模式', () => {
    mockViewport({ landscapePhone: false });
    renderApp();

    expect(screen.getByText('加油李世超')).toBeTruthy();
    expect(screen.queryByText('退出横屏')).toBeNull();
  });
});
