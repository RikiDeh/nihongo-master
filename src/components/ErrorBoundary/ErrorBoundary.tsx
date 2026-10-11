import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);

    // Deteksi jika error disebabkan kegagalan download dynamic chunk JS (Deployment version mismatch)
    const errorString = error?.toString() || '';
    const isChunkFailure = 
      errorString.includes('Failed to fetch dynamically imported module') ||
      errorString.includes('Importing a module script failed') ||
      errorString.includes('Loading chunk') ||
      errorString.includes('Loading CSS chunk');

    if (isChunkFailure) {
      const reloadKey = 'nihongo_chunk_reload_attempt';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Hindari infinite reload loop: reload sekali jika belum pernah dalam 10 detik terakhir
      if (!lastAttempt || now - parseInt(lastAttempt, 10) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        console.warn('Dynamic chunk download failed. Auto-refreshing app to grab latest assets...');
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#1f1f23] rounded-3xl border border-[#e7e5e4] dark:border-[#27272a] p-8 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] mb-2">
              Halaman Terkendala Sesaat
            </h2>

            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-6 font-sans">
              Terjadi kendala saat memuat modul ini (kemungkinan karena koneksi internet terputus atau pembaruan versi modul). Data belajar Anda tetap aman.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#c84b31] hover:bg-[#b03f27] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:translate-y-px"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#eae4d9] dark:hover:bg-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
