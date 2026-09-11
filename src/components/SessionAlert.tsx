import { CheckCircle2, Coffee } from 'lucide-react';
import type { SessionAlertData } from '../hooks/pomodoro/useTimerCompletion';
import { useLanguage } from '../contexts/LanguageContext';
import { formatStudyTime } from '../utils/formatTime';
import styles from './SessionAlert.module.css';

interface SessionAlertProps {
  data: SessionAlertData | null;
  /** Starts the queued-up phase (break, or the next focus block). */
  onStartNext: () => void;
  onDismiss: () => void;
}

/**
 * Blocking, full-screen end-of-phase alert.
 *
 * It deliberately does NOT auto-dismiss: the whole point is to make sure the
 * "继续学习" nudge cannot be missed while the phone sits on the desk.
 */
export function SessionAlert({ data, onStartNext, onDismiss }: SessionAlertProps) {
  const { translations: t } = useLanguage();

  if (!data) return null;

  const finishedWork = data.finished === 'work';
  const Icon = finishedWork ? CheckCircle2 : Coffee;

  return (
    <div
      className={styles.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-alert-title"
      aria-describedby="session-alert-body"
    >
      <div className={`${styles.card} ${finishedWork ? styles.cardWork : styles.cardBreak}`}>
        <div className={styles.iconRing} aria-hidden="true">
          <span className={styles.pulse} />
          <Icon className={styles.icon} size={40} />
        </div>

        <h2 id="session-alert-title" className={styles.title}>
          {finishedWork ? t.workDoneTitle : t.breakDoneTitle}
        </h2>

        <p id="session-alert-body" className={styles.body}>
          {finishedWork ? t.workDoneBody : t.breakDoneBody}
        </p>

        <p className={styles.duration}>
          {formatStudyTime(data.duration, { hour: t.hourShort, minute: t.minuteShort })}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onStartNext}
            autoFocus
          >
            {finishedWork ? t.startBreak : t.continueStudy}
          </button>
          <button type="button" className={styles.ghostBtn} onClick={onDismiss}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
