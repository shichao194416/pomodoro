import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { PomodoroProvider } from './hooks/pomodoro/PomodoroContext'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import {SettingsProvider} from './contexts/SettingsContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'

// Eruda DevTools para desarrollo móvil
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => {
	const erudaModule = eruda.default
	erudaModule.init()

	// Habilitar componentes útiles
	console.log('%c[Eruda] DevTools habilitadas', 'color: #00ff00; font-weight: bold')
	console.log('%cUsa el ícono en la esquina para abrir las DevTools', 'color: #00aaff')
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
)
