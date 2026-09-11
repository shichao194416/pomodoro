import { useState } from 'react';
import { Menu, Timer as TimerIcon, BarChart3, RotateCw } from 'lucide-react';
import { usePomodoro } from './hooks/pomodoro/PomodoroContext';
import { useLanguage } from './contexts/LanguageContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { Stats } from './components/Stats';
import { DailySummary } from './components/DailySummary';
import './App.css';
import {SessionNote} from './components/SessionNote';
import {Logo} from './components/Logo';
import {ErrorBoundary} from './components/ErrorBoundary';
import {SettingsPanel} from './components/SettingsPanel';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag, setTag, mode } = usePomodoro();
  const [activeView, setActiveView] = useState<ViewType>('timer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { translations } = useLanguage();

  return (
	<div className="app">
	  <header className="app-header">
		<h1 className="logo-title"><Logo size={40} /> {translations.appName}</h1>
		<div className="header-controls">
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
				Portrait-only nudge. A web app cannot force an orientation lock
				on iOS, so the landscape layout simply takes over once the
				phone is turned.
			  */}
			  <p className="rotate-hint">
				<RotateCw size={14} aria-hidden="true" /> {translations.rotateHint}
			  </p>

			  <div className="card timer-card">
				<Timer />
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
	  <SettingsPanel
		isOpen={settingsOpen}
		onClose={() => setSettingsOpen(false)}
	  />
	</div>
  );
}

export default App;
