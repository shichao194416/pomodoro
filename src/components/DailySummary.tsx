import { useMemo } from 'react';
import { CalendarDays, Flame, Target, Timer } from 'lucide-react';
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatStudyTime } from '../utils/formatTime';
import styles from './DailySummary.module.css';

interface DayBucket {
  key: string;
  seconds: number;
  count: number;
}

/** Local-time day key, e.g. "2026-09-11". */
const toDayKey = (ts: number): string => {
  const d = new Date(ts);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const shiftDayKey = (key: string, delta: number): string => {
  const [y, m, d] = key.split('-').map(Number);
  return toDayKey(new Date(y, m - 1, d + delta).getTime());
};

const isSameDay = (a: string, b: string) => a === b;

/**
 * Builds one summary row per calendar day.
 * Only focus ('work') sessions count as study time.
 */
function groupByDay(sessions: { timestamp: number; duration: number; mode?: string }[]): DayBucket[] {
  const map = new Map<string, DayBucket>();

  for (const session of sessions) {
    if ((session.mode ?? 'work') !== 'work') continue;
    const key = toDayKey(session.timestamp);
    const bucket = map.get(key) ?? { key, seconds: 0, count: 0 };
    bucket.seconds += session.duration;
    bucket.count += 1;
    map.set(key, bucket);
  }

  return [...map.values()].sort((a, b) => (a.key < b.key ? 1 : -1));
}

/** Consecutive days ending today (or yesterday, so an unstarted day doesn't break it). */
function computeStreak(days: DayBucket[]): number {
  const keys = new Set(days.map((d) => d.key));
  const todayKey = toDayKey(Date.now());
  let cursor = keys.has(todayKey) ? todayKey : shiftDayKey(todayKey, -1);
  let streak = 0;
  while (keys.has(cursor)) {
    streak += 1;
    cursor = shiftDayKey(cursor, -1);
  }
  return streak;
}

export function DailySummary() {
  const { sessions } = usePomodoro();
  const { translations: t } = useLanguage();

  const units = { hour: t.hourShort, minute: t.minuteShort };

  const { days, today, streak, totalSeconds, maxSeconds } = useMemo(() => {
    const grouped = groupByDay(sessions);
    const todayKey = toDayKey(Date.now());
    const todayBucket = grouped.find((d) => isSameDay(d.key, todayKey)) ?? {
      key: todayKey,
      seconds: 0,
      count: 0,
    };

    return {
      days: grouped,
      today: todayBucket,
      streak: computeStreak(grouped),
      totalSeconds: grouped.reduce((sum, d) => sum + d.seconds, 0),
      maxSeconds: grouped.reduce((max, d) => Math.max(max, d.seconds), 0),
    };
  }, [sessions]);

  const formatDayLabel = (key: string): string => {
    const todayKey = toDayKey(Date.now());
    if (key === todayKey) return t.todayStudyDay;
    if (key === shiftDayKey(todayKey, -1)) return t.yesterdayLabel;
    const [, m, d] = key.split('-');
    return t.monthDayLabel.replace('{m}', String(Number(m))).replace('{d}', String(Number(d)));
  };

  return (
    <section className={styles.wrap}>
      <h2 className={styles.heading}>
        <CalendarDays size={20} aria-hidden="true" /> {t.dailySummary}
      </h2>

      <div className={styles.todayCard}>
        <span className={styles.todayLabel}>{t.todayStudy}</span>
        <strong className={styles.todayValue}>
          {formatStudyTime(today.seconds, units)}
        </strong>
        <span className={styles.todaySub}>
          {t.todayPomodoros} · {today.count} {t.times}
        </span>
      </div>

      <div className={styles.statRow}>
        <div className={styles.stat}>
          <Flame size={18} aria-hidden="true" className={styles.statIconHot} />
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>{t.streakDays}</span>
        </div>
        <div className={styles.stat}>
          <Target size={18} aria-hidden="true" className={styles.statIcon} />
          <span className={styles.statValue}>{days.length}</span>
          <span className={styles.statLabel}>{t.activeDays}</span>
        </div>
        <div className={styles.stat}>
          <Timer size={18} aria-hidden="true" className={styles.statIcon} />
          <span className={styles.statValue}>{formatStudyTime(totalSeconds, units)}</span>
          <span className={styles.statLabel}>{t.totalTime.replace(':', '')}</span>
        </div>
      </div>

      <h3 className={styles.subHeading}>{t.dailyHistory}</h3>

      {days.length === 0 ? (
        <p className={styles.empty}>{t.noRecordToday}</p>
      ) : (
        <ul className={styles.dayList}>
          {days.map((day) => {
            const pct = maxSeconds > 0 ? Math.max(6, Math.round((day.seconds / maxSeconds) * 100)) : 0;
            const isToday = isSameDay(day.key, toDayKey(Date.now()));
            return (
              <li key={day.key} className={`${styles.dayRow} ${isToday ? styles.dayRowToday : ''}`}>
                <div className={styles.dayTop}>
                  <span className={styles.dayLabel}>{formatDayLabel(day.key)}</span>
                  <span className={styles.dayValue}>
                    {formatStudyTime(day.seconds, units)}
                    <span className={styles.dayCount}>
                      {' '}
                      · {day.count} {t.times}
                    </span>
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
