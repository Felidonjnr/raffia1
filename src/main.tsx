import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party extension errors (e.g. MetaMask in sandboxed iframes)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg =
      typeof reason === 'string'
        ? reason
        : reason?.message || reason?.stack || '';
    if (
      msg.toLowerCase().includes('metamask') ||
      msg.toLowerCase().includes('ethereum') ||
      msg.toLowerCase().includes('solana') ||
      msg.toLowerCase().includes('web3')
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    const src = event?.filename || '';
    if (
      msg.toLowerCase().includes('metamask') ||
      msg.toLowerCase().includes('ethereum') ||
      src.toLowerCase().includes('chrome-extension') ||
      src.toLowerCase().includes('moz-extension')
    ) {
      event.preventDefault();
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Raffia Legacy Application Notice:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#181513] flex flex-col items-center justify-center p-8 text-center font-sans">
          <div className="max-w-md border border-[#181513]/15 bg-[#FAF7F2] p-8 shadow-sm space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
              Dance Ville Archival System
            </span>
            <h1 className="font-serif text-3xl font-light text-[#181513]">
              Raffia Legacy
            </h1>
            <p className="text-xs text-[#57524E] leading-relaxed">
              The archive encountered a momentary state issue. Click below to refresh the collection experience.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '';
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
            >
              Reload Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
