import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles, RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissedOffline, setDismissedOffline] = useState(false);

  // Hook Service Worker dari vite-plugin-pwa untuk mendeteksi pembaruan otomatis
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Cek update otomatis setiap 1 jam jika app terus terbuka
        setInterval(() => {
          r.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.debug('SW registration error:', error);
    },
  });

  useEffect(() => {
    // 1. Tangani event status koneksi (Offline / Online)
    const handleOnline = () => {
      setIsOffline(false);
      setDismissedOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissedOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Tangani event PWA Install Prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      // Cek apakah user pernah menolak instalasi dalam 7 hari terakhir
      const lastDismissed = localStorage.getItem('nihongo_pwa_dismissed');
      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10);
        if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
          setDeferredPrompt(promptEvent);
          return;
        }
      }

      setDeferredPrompt(promptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowInstallBanner(false);
      }
    } catch (err) {
      console.debug('Error invoking PWA install prompt:', err);
    }
    setDeferredPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('nihongo_pwa_dismissed', Date.now().toString());
  };

  return (
    <>
      {/* 1. Indikator Offline Mode */}
      {isOffline && !dismissedOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-bounce-subtle pointer-events-auto">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#1c1917] dark:bg-[#27272a] text-white shadow-lg border border-stone-700/60 text-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-sans leading-tight">
                <strong>Mode Offline Aktif</strong> — Seluruh materi Kanji, Kosakata & SRS tetap siap diakses.
              </span>
            </div>
            <button
              onClick={() => setDismissedOffline(true)}
              className="p-1 text-stone-400 hover:text-white transition cursor-pointer"
              aria-label="Tutup notifikasi offline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Banner Pembaruan Versi Baru (Auto Update Prompt) */}
      {needRefresh && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-slideDown pointer-events-auto">
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#1c1917] dark:bg-[#1f1f23] text-white shadow-2xl border border-[#c84b31]/40 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c84b31]/20 text-[#c84b31] dark:text-[#e05d44] flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="leading-tight">
                <strong className="block text-[#f4f4f5] font-bold">Pembaruan Tersedia!</strong>
                <span className="text-stone-300 text-[11px]">Versi baru siap dengan perbaikan & materi terkini.</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setNeedRefresh(false)}
                className="px-2.5 py-1.5 rounded-lg text-stone-400 hover:text-white transition cursor-pointer text-[11px]"
              >
                Nanti
              </button>
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-3 py-1.5 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white font-bold transition cursor-pointer text-[11px] shadow-sm flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Perbarui</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Banner Pasang Aplikasi PWA */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 max-w-sm w-[90%] sm:w-auto animate-slideUp pointer-events-auto">
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] flex items-center justify-center shrink-0 border border-[#c84b31]/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5]">
                    Pasang NihongoMaster
                  </h4>
                  <p className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] leading-tight mt-0.5">
                    Akses cepat dari layar utama & belajar lancar tanpa internet.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismissInstall}
                className="text-[#78716c] hover:text-[#1c1917] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] p-1 cursor-pointer"
                aria-label="Tutup penawaran pasang aplikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#e7e5e4] dark:border-[#27272a]">
              <button
                onClick={handleDismissInstall}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] hover:bg-[#faf8f5] dark:hover:bg-[#27272a] transition cursor-pointer"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white text-xs font-sans font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:translate-y-px"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
