// ErrorCatcher-Komponente, die ErrorBoundary kapselt und Fehler an Callback weitergibt
import React from "react";

export function ErrorCatcher({ children }: { children: React.ReactNode }) {
  // Diese Komponente kann erweitert werden, um Fehler zu melden
  // Aktuell wird nur ErrorBoundary verwendet
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error /* errorInfo: React.ErrorInfo */) {
    this.props.onError?.(error);
    // Optional: Logging
    // console.error('ErrorBoundary caught an error');
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      // Fehler wird im App angezeigt, nicht hier
      return this.props.children;
    }
    return this.props.children;
  }
}
