import { useEffect } from "react";
import { CheckCircle, Coffee, X } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  isVisible: boolean;
  message: string;
  duration?: number;
  type?: 'work' | 'break';
  onClose: () => void;
};

export const Toast =({
  isVisible,
  message,
  duration,
  type = 'work',
	onClose
}: ToastProps) => {
  useEffect(() => {
	if (isVisible) {
	  const timer = setTimeout( () => { 
		onClose();
	  }, 4000); // Auto-dismiss after 4 seconds
	  return () => clearTimeout(timer);
	}
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;

	if (mins === 0) return `${secs} seconds` ;
	if (secs === 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;

	return `${mins}m ${secs}s`;
  };

  return (
	<div 
	  className={[
	  styles.toast,
	  type === 'work' ? styles.toastWork : styles.toastBreak
	  ].join(' ')}
	  role="alert"
	  aria-live="polite"
	>
	  <div className={ styles.toastContent }>
		<span className={ styles.toastIcon } aria-hidden="true">
		  {type === 'work' ? <CheckCircle size={20} /> : <Coffee size={20} />}
		</span>
		<div className={ styles.toastText }>
		  <span className={ styles.toastMessage }>{message}</span>
		  {duration !== undefined && (
			<span className={ styles.toastDuration }>
			  Duration: {formatDuration(duration)}
			</span>
		  )}
		</div>
	  </div>
	  <button 
		className={ styles.toastClose }
		onClick={onClose}
		aria-label="Close notification"
	  >
		<X size={16} />
	  </button>
	</div>
  );
};
