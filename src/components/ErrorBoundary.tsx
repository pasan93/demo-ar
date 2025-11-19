"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  componentDidCatch(error: Error) {
    console.error("Viewer failed to render", error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-white/80 p-6 text-center text-slate-800 shadow-lg">
          <p className="text-lg font-semibold">We could not load the model.</p>
          <p className="text-sm text-slate-500">
            Make sure <code className="font-mono text-slate-700">/public/models/sofa.glb</code> exists and reload the
            page.
          </p>
          <button
            type="button"
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600"
            onClick={this.handleReset}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
