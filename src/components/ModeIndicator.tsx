import { useState, useEffect } from 'react'
import { Briefcase, Coffee } from 'lucide-react';
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles  from './ModeIndicator.module.css'

export const ModeIndicator = () => {
  const { 
	mode,
	setMode,
	isRunning,
	pauseTimer,
	timeLeft,
	setTimeLeft,
	defaultWorkTime,
	defaultBreakTime
  } = usePomodoro();
  const { translations } = useLanguage();

  // Store the time left for each mode separately
  const [ workTimeLeft, setWorkTimeLeft ] = useState(defaultWorkTime);
  const [ breakTimeLeft, setBreakTimeLeft ] = useState(defaultBreakTime);

  // When timeLeft changes, update the appropiate mode's stored time
  useEffect(() => {
	if (mode === 'work') {
	  setWorkTimeLeft(timeLeft);
	} else {
	  setBreakTimeLeft(timeLeft);
	}
  }, [timeLeft, mode]);

  const modeConfig = {
    work: {
      icon: <Briefcase size={18} />,
      label: translations.workSession,
      className: styles.modeIndicatorWork
    },
    break: {
      icon: <Coffee size={18} />,
      label: translations.breakTime,
      className: styles.modeIndicatorBreak
    }
  };

  const handleToggle = () => { 
	// Don't allow toggle while timer is running
	if (isRunning) return;

	// Switch to opposite mode
	const newMode = mode === 'work' ? 'break' : 'work';

	// Restore the saved time for the new mode
	const savedTime = newMode === 'work' ? workTimeLeft : breakTimeLeft;

	// Update mode and restore timer to where it was
	setMode(newMode);
	setTimeLeft(savedTime);
	pauseTimer();
  }; 

  const config = modeConfig[mode];
  const nextMode = mode === 'work' ? 'break' : 'work'

  return (
    <div 
	  className={[
	  styles.modeIndicator,
	  config.className,
	  isRunning ? styles.modeIndicatorDisabled : styles.modeIndicatorClickable].join(' ')}
	  onClick={handleToggle}
	  role="button"
	  tabIndex={isRunning ? -1 : 0}
	  aria-label={isRunning ? 'Timer Running - pause to switch modes' : `Click to switch to ${nextMode} mode`}
	>
      <span className={styles.modeIndicatorIcon} aria-hidden="true">
        {config.icon}
      </span>
      <span className={styles.modeIndicatorLabel}>
        {config.label}
      </span>
    </div>
  );
};
