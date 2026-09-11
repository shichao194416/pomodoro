import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  fallbackResetLabel?: string;
  fullPage?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const {
      fallbackTitle = 'Something went wrong',
      fallbackMessage = 'This section encountered an error. You can try again or reload the page.',
      fallbackResetLabel = 'Try Again',
      fullPage = false,
    } = this.props;

    const containerClass = fullPage
      ? styles.errorContainerFullPage
      : styles.errorContainer;

    return (
      <div className={containerClass} role="alert">
        <AlertTriangle size={40} className={styles.icon} />
        <h2 className={styles.title}>{fallbackTitle}</h2>
        <p className={styles.message}>{fallbackMessage}</p>
        <button
          type="button"
          className={styles.resetButton}
          onClick={this.handleReset}
        >
          <RefreshCw size={16} />
          {fallbackResetLabel}
        </button>
      </div>
    );
  }
}

export { ErrorBoundary };
