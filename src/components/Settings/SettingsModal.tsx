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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Manajemen Data & Backup</h3>
            <p className="text-xs text-slate-400">Penyimpanan lokal di browser (localStorage)</p>
          </div>
        </div>

        {/* Current status stats */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 mb-6 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Kanji Favorit (⭐):</span>
            <span className="font-bold text-amber-300">{progress.bookmarkedKanjiIds.length} karakter</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Kosakata Favorit (⭐):</span>
            <span className="font-bold text-amber-300">{progress.bookmarkedVocabIds.length} kata</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Riwayat Kuis Tersimpan:</span>
            <span className="font-bold text-emerald-400">{progress.quizHistory.length} sesi</span>
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
        <div className="space-y-3">
          {/* Action 1: Download */}
          <button
            onClick={handleDownloadBackup}
            className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-between transition cursor-pointer border border-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-sky-400" />
              <span>Download File Cadangan (JSON)</span>
            </div>
            <FileJson className="w-4 h-4 text-slate-500" />
          </button>

          {/* Action 2: Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-between transition cursor-pointer border border-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore Data dari File JSON</span>
            </div>
            <span className="text-[10px] text-slate-400">Pilih file...</span>
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
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 space-y-3 animate-fadeIn mt-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-200 block">
                    Yakin ingin mereset seluruh data?
                  </span>
                  <p className="text-[11px] text-rose-300/80 leading-relaxed mt-0.5">
                    Semua progres kanji, kosakata favorit, dan skor kuis akan dihapus permanen dari browser.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-rose-600/30"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingReset(true)}
              className="w-full p-3.5 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-semibold text-xs flex items-center justify-between transition cursor-pointer border border-rose-500/30 mt-4"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Reset Seluruh Data Belajar</span>
              </div>
              <span className="text-[10px] text-rose-400/80">Hapus Permanen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
