import { Play, Pause, Minimize2 } from 'lucide-react';
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../hooks/useSound';
import { formatTimeMMSS } from '../utils/formatTime';
import styles from './FocusTimer.module.css';

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface FocusTimerProps {
  /** Leaves focus mode and reveals the full interface again. */
  onExit: () => void;
}

/**
 * Landscape focus screen: nothing on it except the countdown and a way out.
 *
 * A web app cannot lock the device orientation on iOS, so "leaving landscape"
 * means leaving this immersive mode — the phone is still sideways, but the
 * full interface (tags, notes, stats, settings) comes back.
 */
export function FocusTimer({ onExit }: FocusTimerProps) {
  const { timeLeft, isRunning, startTimer, pauseTimer, mode, phaseTotal, defaultWorkTime, defaultBreakTime } =
    usePomodoro();
  const { translations: t } = useLanguage();
  const { unlock } = useSound();

  const fallbackTotal = mode === 'work' ? defaultWorkTime : defaultBreakTime;
  const total = phaseTotal > 0 ? phaseTotal : fallbackTotal;
  const elapsed = total > 0 ? Math.min(1, Math.max(0, (total - timeLeft) / total)) : 0;

  const isWork = mode === 'work';

  const handleToggle = () => {
    if (isRunning) {
      pauseTimer();
      return;
    }
    // iOS only unlocks audio inside a user gesture.
    unlock();
    startTimer();
  };

  return (
    <div className={styles.overlay} data-mode={mode}>
      <div className={styles.aura} aria-hidden="true" />

      <button type="button" className={styles.exitBtn} onClick={onExit} aria-label={t.exitFocus}>
        <Minimize2 size={15} aria-hidden="true" />
        <span>{t.exitFocus}</span>
      </button>

      <div className={styles.stage}>
        <span className={styles.modePill}>{isWork ? t.workSession : t.breakTime}</span>

        <div className={styles.ringWrap}>
          <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id="focusRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={styles.gradientFrom} />
                <stop offset="100%" className={styles.gradientTo} />
              </linearGradient>
            </defs>
            <circle className={styles.ringTrack} cx="100" cy="100" r={RADIUS} />
            <circle
              className={styles.ringProgress}
              cx="100"
              cy="100"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * elapsed}
            />
          </svg>

          <div className={styles.time}>{formatTimeMMSS(timeLeft)}</div>
        </div>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleToggle}
          aria-label={isRunning ? t.pause : t.start}
        >
          {isRunning ? <Pause size={26} /> : <Play size={26} />}
        </button>
      </div>
    </div>
  );
}
