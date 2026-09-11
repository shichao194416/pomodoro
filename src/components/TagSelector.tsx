import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PomodoroMode } from '../types/pomodoro.types';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './TagSelector.module.css';
import { ConfirmModal } from './ConfirmModal';
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';

interface TagSelectorProps {
  tag: string;
  setTag: (tag: string) => void;
  mode: PomodoroMode;
}

export function TagSelector({ tag, setTag, mode }: TagSelectorProps) {
  const { translations } = useLanguage();
  const {renameTag} =usePomodoro();
  const [tags, setTags] = useState<string[]>(() => {  
	const saved = localStorage.getItem('pomodoroTags');
	if (saved) {
	  try { return JSON.parse(saved);} catch (error) {/*ignore*/}
	}
	return [];
  });
  const [showAddTag, setShowAddTag] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
	localStorage.setItem('pomodoroTags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
	if (editingTag && editInputRef.current) {
	  editInputRef.current.focus();
	}
  }, [editingTag]);

  useEffect(() => {
	if (!tag || tag.trim() === '') {
	  setTag('General');
	  return;
	}

	setTags((prev) => prev.includes(tag) ? prev : [tag, ...prev]);
  }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTag = () => {
	const trimmedTag = newTagName.trim();

	if (trimmedTag && !tags.includes(trimmedTag)) {
	  setTags([...tags, trimmedTag]);
	  setTag(trimmedTag);
	  setNewTagName('');
	  setShowAddTag(false);
	}
  };

  const handleSelectTag = (selectedTag: string) => {
	setTag(selectedTag);
  };

  const handleDeleteTag = () => { 
	// Don't delete if it's the only tag
	if (tags.length <= 1) return;
	// Remove the selected tag
	const newTags =tags.filter(t => t !== tag);
	setTags(newTags);
	// Select the first remaining tag
	setTag(newTags[0]);
  };

  const handleDoubleClick = (tagName: string) => { 
	if (mode === 'break') return;
	setEditingTag(tagName);
	setEditValue(tagName);
  }; 

  const handleRenameConfirm = () => { 
	const trimmed = editValue.trim();
	if (!trimmed) {
	  setEditingTag(null);
	  return;
	}
	if (trimmed !== editingTag && tags.includes(trimmed)){
	  setEditingTag(null);
	  return;
	}
	if (trimmed !== editingTag) {
	  setTags((prev) => prev.map((t) => (t === editingTag ? trimmed : t)));
	  renameTag(editingTag!, trimmed);
	  if (tag === editingTag) {
		setTag(trimmed);
	  }
	}
	setEditingTag(null);
  } 
  return (
	<div className={styles.tagSelector}>
	  <h3>{translations.selectCategory}</h3>

	  <div className={styles.addTagSection}>
		{!showAddTag ? (
		  <div className={ styles.tagActions }>
			<button
			  type="button"
			  className={styles.addTagBtn}
			  onClick={() => {
				console.log('Vi alklakis butonon! (Add Tag)');
				setShowAddTag(true);
			  }}
			  disabled={mode === 'break'}
			>
			  <Plus size={16} /> {translations.addTag}
			</button>
			<button
			  type="button"
			  className={styles.deleteTagBtn}
			  onClick={() => {
				console.log('Vi alklakis butonon! (Delete Tag)');
				setShowDeleteConfirm(true);
			  }}
			  disabled={mode === 'break' || tags.length <= 1}
			  aria-label='Delete tag'
			>
			  <Trash2 size={16} />
			</button>
		  </div>
		) : (
		  <div className={styles.addTagForm}>
			<input
			  type="text"
			  value={newTagName}
			  onChange={(e) => setNewTagName(e.target.value)}
			  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
			  placeholder={translations.tagPlaceholder}
			  autoFocus
			/>

			<button type="button" onClick={() => {
			  console.log('Vi alklakis butonon! (Add Tag - Confirm)');
			  handleAddTag();
			}}>
			  {translations.add}
			</button>

			<button
			  type="button"
			  onClick={() => {
				console.log('Vi alklakis butonon! (Add Tag - Cancel)');
				setShowAddTag(false);
				setNewTagName('');
			  }}
			>
			  {translations.cancel}
			</button>
		  </div>
		)}
	  </div>

	  <div className={styles.tagsList}>
		{tags.map((t) => (
		  editingTag === t ? (
			<input 
			  key={t}
			  ref={editInputRef}
			  className={styles.editInput}
			  value={editValue }
			  onChange={(e) => setEditValue(e.target.value)}
			  onBlur={handleRenameConfirm}
			  onKeyDown={(e)=> {
				if (e.key === 'Enter') handleRenameConfirm();
				if (e.key === 'Escape') setEditingTag(null);
			  }}
			/>
		  ) : ( 
			<button
			  key={t}
			  type="button"
			  className={[styles.tagBtn, t === tag ? styles.active : ''].join(' ')}
			  onClick={() => {
				handleSelectTag(t);
			  }}
			  onDoubleClick={() => handleDoubleClick(t)}
			  disabled={mode === 'break'}
			  aria-pressed={t === tag}
			>
			  {t}
			</button>
			  )))}
	  </div>
	  <ConfirmModal
		isOpen={showDeleteConfirm}
		title={translations.deleteTagTitle}
		message={`${translations.deleteTagMessage} "${tag}"?`}
		onConfirm={() => {
		  handleDeleteTag();
		  setShowDeleteConfirm(false);
		}}
		onCancel={() => setShowDeleteConfirm(false)}
	  />
	</div>
  );
}
