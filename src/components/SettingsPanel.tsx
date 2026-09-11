import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../utils/translations";
import { LANGUAGES, LANGUAGE_LABELS } from "../utils/translations";
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({isOpen, onClose}: SettingsPanelProps) {
  const { translations: t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const {
	workDuration,
	breakDuration,
	soundEnabled,
	setWorkDuration,
	setBreakDuration,
	setSoundEnabled,
	clearAllData
  } = useSettings();

  const [localWorkMinutes, setLocalWorkMinutes] = useState(workDuration / 60);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakDuration / 60);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
	setWorkDuration(localWorkMinutes * 60);
	setBreakDuration(localBreakMinutes * 60);
	setSoundEnabled(localSoundEnabled);
	onClose();
  };

  const handleClearData = () => {
	if ( showClearConfirm ) {
	  clearAllData();
	} else {
	  setShowClearConfirm(true);
	}
  };

  return (
	<div className={ styles.overlay } onClick={onClose}>
	  <div
		className={ styles.panel }
		onClick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="settings-title"
	  >
		<h2 id="settings-title" className={ styles.title }>
		  {t.settingsTitle}
		</h2>

		<div className={ styles.settingGroup }>
		  <label className={ styles.toggleLabel }>
			<span>{t.darkMode || 'Dark Mode'}</span>
			<button
			  className={styles.toggleBtn}
			  onClick={toggleTheme}
			  aria-label="Toggle dark mode"
			>
			  <span className={`${styles.toggleTrack} ${theme === 'dark' ? styles.toggleActive : ''}`}>
				<span className={styles.toggleThumb} />
			  </span>
			</button>
		  </label>
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.label }>
			{t.workDuration} ({t.minutes})
		  </label>
		  <input
			type="number"
			min="1"
			max="60"
			value={ localWorkMinutes }
			onChange={(e)=> setLocalWorkMinutes(Number(e.target.value))}
			className={styles.input}
		  />
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.label } >
			{t.breakDuration} ({t.minutes})
		  </label>
		  <input
			type="number"
			min="1"
			max="30"
			value={localBreakMinutes}
			onChange={(e) => setLocalBreakMinutes(Number(e.target.value))}
			className={styles.input}
		  />
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.label }>
			{t.language || 'Language'}
		  </label>
		  <select
			className={styles.input}
			value={language}
			onChange={(e) => setLanguage(e.target.value as Language)}
		  >
			{LANGUAGES.map((lang) => (
			  <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>
			))}
		  </select>
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.toggleLabel }>
			<span>{t.soundEffects}</span>
			<input
			  type="checkbox"
			  checked={localSoundEnabled}
			  onChange={(e) => setLocalSoundEnabled(e.target.checked)}
			  className={styles.checkbox}
			/>
			<span className={styles.toggleSwitch}></span>
		  </label>
		</div>

		<div className={ styles.divider }></div>
		<div className={ styles.settingGroup }>
		  <button
			className={ styles.dangerButton }
			onClick={handleClearData}
		  >
			{showClearConfirm ? t.clearDataConfirm : t.clearData}
		  </button>
		</div>

		<div className={ styles.actions }>
		  <button
			className={ styles.cancelButton }
			onClick={onClose}
		  >
			{t.close}
		  </button>
		  <button
		  className={ styles.saveButton }
			onClick={handleSave}
		  >
			{t.save}
		  </button>
		</div>
	  </div>
	</div>
  );
}
