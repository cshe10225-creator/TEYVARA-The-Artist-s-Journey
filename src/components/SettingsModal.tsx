import React, { useState } from 'react';
import { Volume2, VolumeX, Music, RotateCcw, Upload, Link, AlertTriangle, Check, BookOpen, X, Info } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { soundService } from '../services/soundService';

interface SettingsModalProps {
  profile: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onResetProgress,
}) => {
  const [bgmVol, setBgmVol] = useState(soundService.getBgmVolume());
  const [sfxVol, setSfxVol] = useState(soundService.getSfxVolume());
  const [isMuted, setIsMuted] = useState(soundService.getMuted());
  const [isBgmPlaying, setIsBgmPlaying] = useState(soundService.getIsPlaying());

  // Custom audio source state
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customAudioStatus, setCustomAudioStatus] = useState<string | null>(null);

  // Confirm Reset modal state
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    soundService.playButtonClick();
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    soundService.playButtonClick();
    const playing = soundService.toggleBGM();
    setIsBgmPlaying(playing);
  };

  const handleBgmVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundService.setBgmVolume(val);
  };

  const handleSfxVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundService.setSfxVolume(val);
  };

  const handleApplyAudioUrl = () => {
    if (!customAudioUrl.trim()) return;
    soundService.playButtonClick();
    try {
      soundService.setCustomAudio(customAudioUrl.trim());
      setCustomAudioStatus('Fail audio tersuai berjaya dimuatkan!');
      if (!isBgmPlaying) {
        soundService.startBGM();
        setIsBgmPlaying(true);
      }
    } catch {
      setCustomAudioStatus('Ralat memuatkan fail audio.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundService.playButtonClick();
    const url = URL.createObjectURL(file);
    soundService.setCustomAudio(url);
    setCustomAudioStatus(`Memainkan fail setempat: ${file.name}`);
    if (!isBgmPlaying) {
      soundService.startBGM();
      setIsBgmPlaying(true);
    }
  };

  const handleResetToProcedural = () => {
    soundService.playButtonClick();
    soundService.setCustomAudio(null);
    setCustomAudioUrl('');
    setCustomAudioStatus('Kembali ke muzik orkestra fantasi asal (Web Audio).');
    soundService.startBGM();
    setIsBgmPlaying(true);
  };

  const handleConfirmReset = () => {
    soundService.playButtonClick();
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playButtonClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-black text-white mb-1 flex items-center gap-2">
          <span>Tetapan Game & Bantuan</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Laraskan audio, masukkan lagu fantasi kegemaran, atau semak panduan kurikulum PSV.
        </p>

        {/* Section 1: Audio Settings */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              <span>Kawalan Audio & Muzik</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBgm}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isBgmPlaying ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isBgmPlaying ? 'Jeda Muzik' : 'Mainkan Muzik'}
              </button>
              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isMuted ? 'bg-red-950/60 border-red-500 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* BGM Slider */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-slate-300 font-semibold w-32">Muzik Latar (BGM):</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgmVol}
              onChange={handleBgmVolChange}
              className="flex-1 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-cyan-400 tabular-nums w-12 text-right">
              {Math.round(bgmVol * 100)}%
            </span>
          </div>

          {/* SFX Slider */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-slate-300 font-semibold w-32">Kesan Bunyi (SFX):</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={handleSfxVolChange}
              className="flex-1 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-cyan-400 tabular-nums w-12 text-right">
              {Math.round(sfxVol * 100)}%
            </span>
          </div>

          {/* Custom Audio Option */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Gunakan Fail Audio Tersuai / Lagu Tema Sendiri</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Anda boleh memasukkan fail audio MP3 pengembaraan atau lagu tema pilihan sendiri jika mempunyai hak yang sah:
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
              <input
                type="text"
                value={customAudioUrl}
                onChange={(e) => setCustomAudioUrl(e.target.value)}
                placeholder="Pautan URL fail audio (.mp3)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleApplyAudioUrl}
                className="w-full sm:w-auto px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 cursor-pointer whitespace-nowrap"
              >
                Gunakan URL
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Muat Naik Fail MP3 Peranti</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetToProcedural}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Pulihkan Muzik Asal Game
              </button>
            </div>

            {customAudioStatus && (
              <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                {customAudioStatus}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Panduan Kurikulum PSV Tahun 3 (DSKP KSSR) */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Penyelarasan DSKP Pendidikan Seni Visual Tahun 3:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            Game ini dibangunkan khusus berdasarkan Dokumen Standard Kurikulum dan Pentaksiran (DSKP) PSV KSSR Semakan Tahun 3:
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li><strong>Modul Menggambar - Lukisan:</strong> Penggunaan media kering (pensel grafit, pastel minyak, pensel warna) di atas permukaan 2 dimensi.</li>
            <li><strong>Bahasa Seni Visual:</strong> Mengenal pasti unsur garisan (lurus, beralun, berlingkar, zigzag), rupa organik dan geometri, serta ilusi bentuk 3D melalui ton.</li>
            <li><strong>Kemahiran Melukis:</strong> Lakaran asas ringan sebelum perincian dan lorekan arah cahaya.</li>
            <li><strong>Apresiasi Seni:</strong> Menghargai dan membuat ulasan mudah terhadap karya sendiri dan rakan sekelas.</li>
          </ul>
        </div>

        {/* Section 3: Reset Game Progress */}
        <div className="p-4 bg-red-950/20 rounded-2xl border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Padam Kemajuan Permainan (Reset)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Padam semua markah, lencana dan kemajuan misi untuk memulakan pengembaraan dari awal.
            </div>
          </div>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-red-900/40 text-red-300 hover:bg-red-800/60 border border-red-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            Padam Kemajuan
          </button>
        </div>

        {/* Confirm Reset Dialog */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-5 max-w-sm text-center shadow-2xl">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white mb-1">Adakah Anda Pasti?</h3>
              <p className="text-xs text-slate-300 mb-4">
                Tindakan ini akan memadam semua data misi, serpihan kristal dan markah yang tersimpan.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                >
                  Ya, Padam Semua
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
