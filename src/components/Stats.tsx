import {useState} from 'react';
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatTimeDuration } from '../utils/formatTime';
import styles from './Stats.module.css';

export function Stats() {
  const { sessions } = usePomodoro();
  const { translations } = useLanguage();

    // Calculate overall statistics
  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Filter: selected tag (null = show all)
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tags from sessions
  const uniqueTags = [...new Set(sessions.map(s => s.tag))];

  // Filter sessions based on selected tag
  const filteredSessions = selectedTag
  		? sessions.filter(s => s.tag === selectedTag)
		: sessions;

  return (
	<div className={styles.statsContainer}>
	  <h2>{translations.statsTitle}</h2>

	  <div className={styles.statsContent}>
		<div className={styles.overallStats}>
		  <h3>{translations.overall}</h3>
		  <p>
			{translations.totalSessions} <strong>{totalSessions}</strong>
		  </p>
		  <p>
			{translations.totalTime} <strong>{formatTimeDuration(totalSeconds)}</strong>
		  </p>
		</div>
		{sessions.length === 0 ? (
		  <p className={styles.emptyState}>
			{translations.noSessionsYet}
		  </p>
		) : (
		  <>
			<div className={styles.tagFilter}>
			  <button 
				className={`${styles.tagFilterBtn} ${selectedTag === null
				  ? styles.tagFilterBtnActive : ''}`}
				onClick={() => setSelectedTag(null)}
			  >
				{translations.allSessions}
			  </button>
			  {uniqueTags.map(tag => (
			  <button
				key={tag}
				className={`${styles.tagFilterBtn} ${selectedTag === tag
				  ? styles.tagFilterBtnActive : ''}`}
				onClick={()=> setSelectedTag(tag)}
			  >
				{tag}
			  </button>
			  ))}
			</div>

			<div className={ styles.sessionList }>
			  {[...filteredSessions].reverse().map((session, index) => (
				<div 
				  key={`${session.timestamp}-${index}`}
				  className={ styles.sessionItem }>
				  <div className={ styles.sessionHeader }>
					<span className={ styles.sessionDate }>
					  {new Date(session.timestamp).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					  })}
					</span>
					<span className={ styles.sessionTag }>
					  {session.tag}
					</span>
					<span className={ styles.sessionDuration }>
					  {formatTimeDuration(session.duration)}
					</span>
				  </div>
				  {session.note && (
					<p className={ styles.sessionNote }>{session.note}</p>
				  )}
				</div>
			  ))}
			</div>
		  </>
		)}
	  </div>
	</div>
  );
}
