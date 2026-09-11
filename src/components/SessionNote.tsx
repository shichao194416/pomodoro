import { usePomodoro } from "../hooks/pomodoro/PomodoroContext"
import { useLanguage } from "../contexts/LanguageContext"
import styles from "./SessionNote.module.css"


export function SessionNote()  {

  const { sessionNote,setSessionNote } = usePomodoro();
  const { translations } = useLanguage();
  return (
	<div className={styles.sessionNote}>
	  <textarea 
		className={styles.textarea}
		value={sessionNote} 
		onChange={(e)=> setSessionNote(e.target.value)} 
		placeholder={translations.sessionNotePlaceholder}
		onKeyDown={(e) => {
		  if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			e.currentTarget.blur();
		  }
		} }
	  />
	</div>
  )
}
