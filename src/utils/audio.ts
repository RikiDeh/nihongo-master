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
 * Robust Japanese speech playback.
 * 1. Primary: Native Japanese voice streaming via Google TTS audio.
 *    Works 100% reliably on Linux, Windows, Mac, Android, iOS without needing OS Japanese TTS voices!
 * 2. Fallback: Browser Web Speech API (speechSynthesis) if offline.
 */
let currentAudioInstance: HTMLAudioElement | null = null;

export function speakJapanese(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !text.trim()) {
      resolve();
      return;
    }

    const cleanText = text.trim();

    // Stop currently playing audio if any
    if (currentAudioInstance) {
      try {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
      } catch (_) {}
      currentAudioInstance = null;
    }

    // Try Google Translate Japanese TTS endpoint
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    
    let audio = audioCache.get(cleanText);
    if (!audio) {
      audio = new Audio(ttsUrl);
      audio.preload = 'auto';
      audioCache.set(cleanText, audio);
    } else {
      audio.currentTime = 0;
    }

    currentAudioInstance = audio;

    let hasResolved = false;
    const cleanup = () => {
      if (!hasResolved) {
        hasResolved = true;
        resolve();
      }
    };

    audio.onended = cleanup;
    
    audio.onerror = () => {
      // If network fails (e.g. offline), fall back to Web Speech API
      fallbackSpeechSynthesis(cleanText).then(cleanup);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or error, fallback to Web Speech API
        fallbackSpeechSynthesis(cleanText).then(cleanup);
      });
    }
  });
}

function fallbackSpeechSynthesis(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
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
      const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.name.includes('Japanese') || v.name.includes('Kyoko') || v.name.includes('Otoya'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

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
      resolve();
    }
  });
}
