import React, { useState, useRef } from 'react';
import { exportProgressJSON, importProgressJSON, getUserProgress } from '../../utils/storage';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  FileJson
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const progress = getUserProgress();

  // 1. Download Backup JSON
  const handleDownloadBackup = () => {
    try {
      const jsonString = exportProgressJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `nihongo_master_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'File cadangan JSON berhasil diunduh ke komputermu!',
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Gagal mengunduh file cadangan.',
      });
    }
  };

  // 2. Upload Restore JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importProgressJSON(content);

      if (success) {
        setStatusMessage({
          type: 'success',
          text: 'Data belajar berhasil dipulihkan (Restore Berhasil)!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Format file JSON tidak valid atau rusak.',
        });
      }
    };
    reader.readAsText(file);
    // Reset file input agar bisa upload file yang sama kembali jika diperlukan
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Reset All Data via inline UI
  const handleExecuteReset = () => {
    localStorage.removeItem('nihongo_master_progress_v1');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nihongo_storage_updated'));
    }
    setIsConfirmingReset(false);
    setStatusMessage({
      type: 'success',
      text: 'Semua progres belajar telah berhasil direset ke kondisi awal.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl max-w-md w-full p-6 shadow-xl relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#c84b31]/10 border border-[#c84b31]/20 flex items-center justify-center text-[#c84b31] dark:text-[#e05d44]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5]">Manajemen Data & Backup</h3>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa]">Penyimpanan lokal di browser (localStorage)</p>
          </div>
        </div>

        {/* Current status stats */}
        <div className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] mb-5 text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span>Kanji Favorit:</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">{progress.bookmarkedKanjiIds.length} karakter</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Kosakata Favorit:</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">{progress.bookmarkedVocabIds.length} kata</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Riwayat Kuis:</span>
            <span className="font-bold text-[#2e7d32] dark:text-[#4ade80]">{progress.quizHistory.length} sesi</span>
          </div>
        </div>

        {/* Feedback message banner */}
        {statusMessage && (
          <div className={`p-3.5 rounded-xl border text-xs mb-5 flex items-start gap-2.5 animate-pop ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Action 1: Download */}
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="w-full p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] hover:bg-black/5 dark:hover:bg-white/5 text-[#1c1917] dark:text-[#f4f4f5] font-medium text-xs flex items-center justify-between transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a]"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" />
              <span>Download File Cadangan (JSON)</span>
            </div>
            <FileJson className="w-3.5 h-3.5 text-[#78716c]" />
          </button>

          {/* Action 2: Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] hover:bg-black/5 dark:hover:bg-white/5 text-[#1c1917] dark:text-[#f4f4f5] font-medium text-xs flex items-center justify-between transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a]"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Restore Data dari File JSON</span>
            </div>
            <span className="text-[10px] font-mono text-[#78716c]">Pilih file...</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          {/* Action 3: Inline Confirmation Reset */}
          {isConfirmingReset ? (
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 space-y-2.5 animate-fadeIn mt-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                    Yakin ingin mereset seluruh data?
                  </span>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300/80 leading-relaxed mt-0.5">
                    Semua progres kanji, kosakata favorit, dan riwayat kuis akan dihapus permanen.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-3 py-1 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3 py-1 rounded-md bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold transition cursor-pointer"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              className="w-full p-3 rounded-lg bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-medium text-xs flex items-center justify-between transition cursor-pointer border border-rose-300 dark:border-rose-900/60 mt-3"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Seluruh Data Belajar</span>
              </div>
              <span className="text-[10px] font-mono">Hapus Permanen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
