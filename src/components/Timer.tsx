import { Play, Pause, RotateCcw, Square, Sun } from "lucide-react";
import { usePomodoro } from "../hooks/pomodoro/PomodoroContext";
import { useTimerCompletion } from "../hooks/pomodoro/useTimerCompletion";
import { useFinishSession } from "../hooks/pomodoro/useFinishSession";
import { useTimerEdit } from "../hooks/pomodoro/useTimerEdit";
import { useWakeLock } from "../hooks/useWakeLock";
import { useLanguage } from "../contexts/LanguageContext";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import { ModeIndicator } from "./ModeIndicator";
import { SessionAlert } from "./SessionAlert";
import styles from './Timer.module.css';
import { requestNotificationPermission } from '../utils/notifications';
import { useSound } from '../hooks/useSound';

export const Timer = () => {
  const {
	timeLeft,
	setTimeLeft,
	isRunning,
	startTimer,
	pauseTimer,
	stopTimer,
	resetTimer,
	tag,
	mode,
	setMode,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	saveSession,
	sessionDuration,
  } = usePomodoro();

  const { translations } = useLanguage();
  const { unlock } = useSound();

  // Keeps the screen on while a phase runs — this is what makes the
  // end-of-phase alarm land on time on iPhone.
  const wakeLockActive = useWakeLock(isRunning);

  const { alert, closeAlert } = useTimerCompletion({
	timeLeft,
	mode,
	tag,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	sessionDuration,
	stopTimer,
	setMode,
	setTimeLeft,
	saveSession,
  });

  const { handleFinishSession, confirmFinishSession, cancelFinishSession } = useFinishSession();

  const {
	isEditing,
	editValue,
	inputRef,
	startEditing,
	confirmEdit,
	handleEditChange,
	handleEditKeyDown,
  } = useTimerEdit({
	isRunning,
	timeLeft,
	setTimeLeft,
  });

  return (
	<div className={styles.timer}>
	  <ModeIndicator />

	  <div className={styles.timeWrapper}>
		{isEditing ? (
		  <input
			ref={inputRef}
			className={styles.timeInput}
			value={editValue}
			onChange={(e) => handleEditChange(e.target.value)}
			onBlur={confirmEdit}
			onKeyDown={handleEditKeyDown}
			aria-label="Edit timer duration"
			maxLength={5}
		  />
		) : (
		  <div
			className={`${styles.timeDisplay} ${isRunning ? styles.timeDisplayDisabled : ''}`}
			onClick={startEditing}
			role="button"
			tabIndex={0}
			aria-label={isRunning ? 'Timer running' : 'Click to edit duration'}
		  >
			{formatTimeMMSS(timeLeft)}
		  </div>
		)}
	  </div>

	  <div className={styles.timerControls}>
		<button
		  onClick={() => {
			if (!isRunning) {
			  // Must happen inside the tap: iOS only unlocks audio on a gesture.
			  unlock();
			  requestNotificationPermission();
			}
			if (isRunning) {
			  pauseTimer();
			} else {
			  startTimer();
			}
		  }}
		  disabled={showConfirmModal}
		  className={`${styles.iconBtn} ${styles.iconBtnPrimary}`}
		  aria-label={isRunning ? translations.pause : translations.start}
		>
		  {isRunning ? <Pause size={20} /> : <Play size={20} />}
		</button>

		<button
		  onClick={resetTimer}
		  className={styles.iconBtn}
		  aria-label={translations.reset}
		>
		  <RotateCcw size={20} />
		</button>

		<button
		  onClick={handleFinishSession}
		  className={styles.iconBtn}
		  aria-label={translations.finish}
		>
		  <Square size={20} />
		</button>
	  </div>

	  {isRunning && wakeLockActive && (
		<p className={styles.awakeBadge}>
		  <Sun size={13} aria-hidden="true" /> {translations.keepingAwake}
		</p>
	  )}

	  <ConfirmModal
		isOpen={showConfirmModal}
		onConfirm={confirmFinishSession}
		onCancel={cancelFinishSession}
		title={translations.confirmFinish}
		message={translations.confirmFinishMessage}
	  />

	  <SessionAlert
		data={alert}
		onStartNext={() => {
		  // The completion hook already queued up the next phase's duration.
		  startTimer();
		  closeAlert();
		}}
		onDismiss={closeAlert}
	  />
	</div>
  );
};
