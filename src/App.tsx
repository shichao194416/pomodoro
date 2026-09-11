import { useEffect, useRef, useState } from 'react';
import { Menu, Timer as TimerIcon, BarChart3, RotateCw, Maximize2 } from 'lucide-react';
import { usePomodoro } from './hooks/pomodoro/PomodoroContext';
import { useTimerCompletion } from './hooks/pomodoro/useTimerCompletion';
import { useLanguage } from './contexts/LanguageContext';
import { useMediaQuery, LANDSCAPE_PHONE_QUERY } from './hooks/useMediaQuery';
import { useWakeLock } from './hooks/useWakeLock';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { Stats } from './components/Stats';
import { DailySummary } from './components/DailySummary';
import { SessionAlert } from './components/SessionAlert';
import { FocusTimer } from './components/FocusTimer';
import './App.css';
import {SessionNote} from './components/SessionNote';
import {Logo} from './components/Logo';
import {ErrorBoundary} from './components/ErrorBoundary';
import {SettingsPanel} from './components/SettingsPanel';

type ViewType = 'timer' | 'stats';

function App() {
  const {
	tag,
	setTag,
	mode,
	isRunning,
	timeLeft,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	sessionDuration,
	stopTimer,
	setMode,
	setTimeLeft,
	setPhaseTotal,
	saveSession,
	startTimer,
  } = usePomodoro();

  const [activeView, setActiveView] = useState<ViewType>('timer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { translations } = useLanguage();

  /**
   * End-of-phase handling lives here rather than inside <Timer>, so the alarm
   * and the blocking alert still fire when the timer panel is not mounted —
   * on the stats tab, or in the landscape focus screen.
   */
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
	setPhaseTotal,
	saveSession,
  });

  /**
   * Screen wake lock is owned here too: it must stay on for the whole session
   * regardless of which panel or view happens to be mounted.
   */
  const wakeLockActive = useWakeLock(isRunning);

  // Landscape phones get the immersive screen by default.
  const isLandscapePhone = useMediaQuery(LANDSCAPE_PHONE_QUERY);
  const [focusMode, setFocusMode] = useState(true);
  const wasLandscape = useRef(isLandscapePhone);

  useEffect(() => {
	// Turning the phone sideways again should bring the focus screen back.
	if (isLandscapePhone && !wasLandscape.current) setFocusMode(true);
	wasLandscape.current = isLandscapePhone;
  }, [isLandscapePhone]);

  const showFocus = activeView === 'timer' && isLandscapePhone && focusMode;

  return (
	<div className="app">
	  {showFocus ? (
		/* Everything else is unmounted, so the focus screen really is the
		   only thing on screen — no hidden controls, no stray chrome. */
		<FocusTimer onExit={() => setFocusMode(false)} />
	  ) : (
		<>
		  <header className="app-header">
			<h1 className="logo-title"><Logo size={40} /> {translations.appName}</h1>
			<div className="header-controls">
			  {activeView === 'timer' && isLandscapePhone && (
				<button
				  className="theme-toggle"
				  onClick={() => setFocusMode(true)}
				  aria-label={translations.enterFocus}
				  title={translations.enterFocus}
				>
				  <Maximize2 size={18} />
				</button>
			  )}
			  <button
				className="theme-toggle"
				onClick={() => setSettingsOpen(true)}
				aria-label={translations.settingsTitle}
			  >
				<Menu size={20} />
			  </button>
			</div>
		  </header>

		  <main className="main-content">
			{activeView === 'timer' && (
			  <ErrorBoundary
				fallbackTitle={translations.errorBoundaryTitle}
				fallbackMessage={translations.errorBoundaryMessage}
				fallbackResetLabel={translations.errorBoundaryReset}
			  >
				<div className="timer-view">
				  {/*
					Portrait-only nudge. A web app cannot force an orientation
					lock on iOS, so the landscape layout simply takes over once
					the phone is turned.
				  */}
				  <p className="rotate-hint">
					<RotateCw size={14} aria-hidden="true" /> {translations.rotateHint}
				  </p>

				  <div className="card timer-card">
					<Timer wakeLockActive={wakeLockActive} />
				  </div>

				  <div className="card tagselector-card">
					<TagSelector tag={tag} setTag={setTag} mode={mode} />
				  </div>

				  <div className="card session-note-slot">
					<SessionNote />
				  </div>
				</div>
			  </ErrorBoundary>
			)}

			{activeView === 'stats' && (
			  <ErrorBoundary
				fallbackTitle={translations.errorBoundaryTitle}
				fallbackMessage={translations.errorBoundaryMessage}
				fallbackResetLabel={translations.errorBoundaryReset}
			  >
				<div className="stats-view">
				  <DailySummary />
				  <div className="card stats-card">
					<Stats />
				  </div>
				</div>
			  </ErrorBoundary>
			)}
		  </main>

		  <footer className="bottom-nav">
			<button
			  type="button"
			  className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
			  onClick={() => {
				setActiveView('timer');
			  }}
			  aria-label='Timer view'
			>
			  <TimerIcon size={20} /> {translations.timerTab}
			</button>

			<button
			  type="button"
			  className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
			  onClick={() => {
				setActiveView('stats');
			  }}
			  aria-label='Stats view'
			>
			  <BarChart3 size={20} /> {translations.statsTab}
			</button>
		  </footer>
		</>
	  )}

	  <SessionAlert
		data={alert}
		onStartNext={() => {
		  // The completion hook already queued up the next phase's duration.
		  startTimer();
		  closeAlert();
		}}
		onDismiss={closeAlert}
	  />

	  <SettingsPanel
		isOpen={settingsOpen}
		onClose={() => setSettingsOpen(false)}
	  />
	</div>
  );
}

export default App;
