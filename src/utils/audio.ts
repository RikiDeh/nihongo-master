// Web Audio API sound synthesizer + Dual-Engine Japanese Audio (Online TTS + SpeechSynthesis Fallback)

let audioCtx: AudioContext | null = null;
const audioCache = new Map<string, HTMLAudioElement>();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Pleasant high melodic chime (E5 -> B5)
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.08);

    osc2.frequency.setValueAtTime(1318.51, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.04);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.18, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.45);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

/**
// Auto-unlock AudioContext on user gesture (fixes Firefox Linux suspended state)
if (typeof window !== 'undefined') {
  const unlockAudioContext = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', unlockAudioContext, { passive: true });
  window.addEventListener('keydown', unlockAudioContext, { passive: true });
  window.addEventListener('touchstart', unlockAudioContext, { passive: true });
}

/**
 * Robust Multi-Tier Japanese Audio Engine.
 * Tier 1: Youdao Native Japanese Pronunciation CDN (Bypass CORS/Referer restriction, 100% works on Firefox Linux).
 * Tier 2: Google TTS endpoint (with no-referrer policy).
 * Tier 3: Browser SpeechSynthesis API fallback.
 */
let currentAudioInstance: HTMLAudioElement | null = null;

export function speakJapanese(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !text.trim()) {
      resolve();
      return;
    }

    const cleanText = text.trim();

    // Hentikan audio yang sedang diputar jika ada
    if (currentAudioInstance) {
      try {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
      } catch {}
      currentAudioInstance = null;
    }

    // Daftar sumber audio berurutan (Primary -> Secondary -> Fallback)
    const audioUrls = [
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&le=jap`,
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(cleanText)}`
    ];

    let hasResolved = false;
    const cleanup = () => {
      if (!hasResolved) {
        hasResolved = true;
        resolve();
      }
    };

    let urlIndex = 0;

    const tryNextAudioSource = () => {
      if (urlIndex < audioUrls.length) {
        const url = audioUrls[urlIndex];
        urlIndex++;

        try {
          const audio = new Audio();
          (audio as any).referrerPolicy = 'no-referrer';
          audio.crossOrigin = 'anonymous';
          audio.preload = 'auto';
          audio.src = url;

          currentAudioInstance = audio;

          audio.onended = cleanup;
          audio.onerror = () => {
            tryNextAudioSource();
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              tryNextAudioSource();
            });
          }
        } catch {
          tryNextAudioSource();
        }
      } else {
        // Jika semua CDN jaringan gagal (misal offline), beralih ke Web Speech API
        fallbackSpeechSynthesis(cleanText).then(cleanup);
      }
    };

    tryNextAudioSource();
  });
}

let lastToastTime = 0;

/**
 * Menampilkan notifikasi banner / toast ramah jika perangkat tidak memiliki suara ja-JP
 */
export function showTtsWarningToast(customMsg?: string) {
  if (typeof document === 'undefined') return;
  const now = Date.now();
  if (now - lastToastTime < 5000) return; // Debounce 5s
  lastToastTime = now;

  const msg = customMsg || 'Perangkat Anda belum memiliki paket suara Bahasa Jepang (ja-JP). Silakan aktifkan di Pengaturan Text-to-Speech perangkat Anda.';

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('japanese-tts-warning', { detail: { message: msg } }));
  }

  let toastContainer = document.getElementById('tts-toast-banner');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'tts-toast-banner';
    toastContainer.className = 'fixed bottom-5 right-5 z-[9999] max-w-sm p-4 bg-amber-950/95 border border-amber-500/50 text-amber-200 text-xs rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 flex items-start gap-3 pointer-events-auto';
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML = `
    <div class="text-amber-400 mt-0.5 text-base flex-shrink-0">⚠️</div>
    <div class="flex-1">
      <div class="font-bold text-amber-300 mb-0.5">Paket Suara Jepang Tidak Ditemukan</div>
      <div>${msg}</div>
    </div>
    <button id="tts-toast-close" class="text-amber-400 hover:text-white text-sm font-bold ml-1 p-1">✕</button>
  `;

  toastContainer.style.opacity = '1';
  toastContainer.style.transform = 'translateY(0)';

  const closeBtn = document.getElementById('tts-toast-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (toastContainer) toastContainer.style.opacity = '0';
    };
  }

  setTimeout(() => {
    if (toastContainer) {
      toastContainer.style.opacity = '0';
      toastContainer.style.transform = 'translateY(10px)';
    }
  }, 6000);
}

/**
 * Memeriksa apakah browser memiliki suara bahasa Jepang yang terinstal
 */
export function hasJapaneseVoiceSupport(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some(v => 
    v.lang.startsWith('ja') || 
    v.lang.includes('ja-JP') || 
    v.lang.includes('ja_JP') || 
    v.name.toLowerCase().includes('japanese') ||
    v.name.includes('Kyoko') ||
    v.name.includes('Otoya')
  );
}

function fallbackSpeechSynthesis(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showTtsWarningToast();
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => 
        v.lang.startsWith('ja') || 
        v.lang.includes('ja-JP') || 
        v.lang.includes('ja_JP') || 
        v.name.includes('Japanese') || 
        v.name.includes('Kyoko') || 
        v.name.includes('Otoya')
      );

      if (jaVoice) {
        utterance.voice = jaVoice;
      } else {
        // Jika voices sudah termuat namun tidak ada suara ja
        if (voices.length > 0) {
          showTtsWarningToast();
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => {
        showTtsWarningToast();
        resolve();
      };

      window.speechSynthesis.speak(utterance);

      // Chrome speech synthesis freeze workaround (safety timer)
      setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
        resolve();
      }, 1500);
    } catch (e) {
      console.debug('Fallback speech error:', e);
      showTtsWarningToast();
      resolve();
    }
  });
}
