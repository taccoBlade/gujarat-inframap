import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[ErrorBoundary] Caught error in ${this.props.componentName || 'component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-6 rounded-2xl bg-[#151F30] border-2 border-amber-500/40 text-center space-y-3">
          <p className="text-sm font-bold text-[#FF9418]">
            Interactive map temporarily unavailable
          </p>
          <p className="text-xs text-[#8F9CAE]">
            Please refresh the view or switch to List mode to explore all venues.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded-lg bg-[#FF9418] text-[#101827] text-xs font-bold"
          >
            Retry Map
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
