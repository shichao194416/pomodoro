/**
 * Runtime smoke tests.
 *
 * These render the real app in jsdom, so they catch wiring mistakes that a
 * type-check cannot: providers in the wrong order, a crash on mount, missing
 * translation keys, and — most importantly — whether the daily summary counts
 * the right sessions.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { PomodoroProvider } from './hooks/pomodoro/PomodoroContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

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
  it('首次打开渲染中文界面并显示默认 25 分钟倒计时', () => {
    renderApp();

    expect(screen.getByText('番茄钟')).toBeTruthy();
    // Mode indicator label
    expect(screen.getByText('专注学习')).toBeTruthy();
    // Default work duration rendered as MM:SS
    expect(screen.getByText('25:00')).toBeTruthy();
    // Navigation
    expect(screen.getByText('计时')).toBeTruthy();
    expect(screen.getByText('总结')).toBeTruthy();
    // The landscape nudge exists in the DOM (CSS decides when to show it)
    expect(screen.getByText('横屏查看效果更好')).toBeTruthy();
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
});
