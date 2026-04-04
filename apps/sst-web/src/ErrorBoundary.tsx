// ErrorCatcher-Komponente, die ErrorBoundary kapselt und Fehler an Callback weitergibt
import React from "react";

interface ErrorCatcherProps {
  children: React.ReactNode;
  onError?: (error: Error, info?: React.ErrorInfo) => void;
}

export function ErrorCatcher({ children, onError }: ErrorCatcherProps) {
  return <ErrorBoundary onError={onError}>{children}</ErrorBoundary>;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, info?: React.ErrorInfo) => void;
  fallback?: React.ReactNode;
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

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
