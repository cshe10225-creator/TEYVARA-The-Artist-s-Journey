import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Map, Image as ImageIcon, Award, Settings, Sparkles } from 'lucide-react';
import { PlayerProfile, Character, GameScreen } from '../types/game';
import { soundService } from '../services/soundService';

interface TopGameHUDProps {
  profile: PlayerProfile;
  activeCharacter: Character;
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onOpenSettings: () => void;
}

export const TopGameHUD: React.FC<TopGameHUDProps> = ({
  profile,
  activeCharacter,
  currentScreen,
  onNavigate,
  onOpenSettings,
}) => {
  const [isMuted, setIsMuted] = useState(soundService.getMuted());
  const [isBgmPlaying, setIsBgmPlaying] = useState(soundService.getIsPlaying());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [bgmVol, setBgmVol] = useState(soundService.getBgmVolume());

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundService.setBgmVolume(val);
  };

  // XP progress to next level (out of 150)
  const currentXpInLevel = profile.xp % 150;
  const xpPercent = Math.min(100, Math.round((currentXpInLevel / 150) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 px-3 py-2 md:px-6 md:py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Player Profile & Character Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundService.playButtonClick();
              onNavigate('CHAR_SELECT');
            }}
            className="group relative flex items-center gap-2.5 p-1 pr-3 rounded-full bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
            title="Tukar Watak Pengembara"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow-sm shadow-cyan-500/40">
              <img
                src={activeCharacter.imagePath}
                alt={activeCharacter.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-bold text-white tracking-wide">
                  {profile.name || activeCharacter.name}
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-cyan-300 tabular-nums">
                  Lv.{profile.level}
                </span>
              </div>
              {/* Mini XP bar */}
              <div className="w-20 md:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5 border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* Inspiration Crystals Gauge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-200">Kristal Inspirasi:</span>
            <div className="flex items-center gap-1 ml-1">
              {[0, 1, 2, 3, 4].map((idx) => {
                const collected = idx < profile.crystalsCount;
                return (
                  <div
                    key={idx}
                    title={collected ? `Kristal Misi ${idx + 1} Diperoleh!` : `Belum Terbuka (Misi ${idx + 1})`}
                    className={`w-3.5 h-4.5 rounded-sm transform rotate-45 transition-all duration-300 ${
                      collected
                        ? 'bg-gradient-to-tr from-cyan-400 to-amber-300 shadow-sm shadow-cyan-400/80 scale-110'
                        : 'bg-slate-800 border border-slate-700 opacity-40'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-300 tabular-nums ml-1">
              {profile.crystalsCount}/5
            </span>
          </div>
        </div>

        {/* Center: Current Realm or Screen Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-cyan-400 font-bold">TEYVARA</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">
            {currentScreen === 'TITLE_MENU' && 'Skrin Utama'}
            {currentScreen === 'CHAR_SELECT' && 'Bilik Pemilihan Watak'}
            {currentScreen === 'WORLD_MAP' && 'Peta Pengembaraan Alam'}
            {currentScreen === 'MISSION_PLAY' && 'Misi Pendidikan PSV'}
            {currentScreen === 'GALLERY' && 'Galeri Seni Murid'}
            {currentScreen === 'CERTIFICATE' && 'Sijil Pengembara Seni'}
            {currentScreen === 'SETTINGS' && 'Tetapan & Bantuan'}
            {currentScreen === 'ABOUT' && 'Tentang Game & DSKP'}
          </span>
        </div>

        {/* Right: Quick Navigation & Audio Controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {currentScreen !== 'WORLD_MAP' && currentScreen !== 'TITLE_MENU' && (
            <button
              onClick={() => {
                soundService.playButtonClick();
                onNavigate('WORLD_MAP');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-900/40 text-cyan-200 hover:bg-cyan-800/60 border border-cyan-500/40 transition-colors"
              title="Kembali ke Peta Dunia"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Peta Dunia</span>
            </button>
          )}

          <button
            onClick={() => {
              soundService.playButtonClick();
              onNavigate('GALLERY');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-200 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 transition-colors"
            title="Galeri Lukisan Saya"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Galeri</span>
          </button>

          {profile.crystalsCount >= 5 && (
            <button
              onClick={() => {
                soundService.playButtonClick();
                onNavigate('CERTIFICATE');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 hover:from-amber-400 hover:to-yellow-500 border border-amber-300 shadow-sm shadow-amber-400/30 transition-all animate-pulse"
              title="Lihat Sijil Penghargaan"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sijil</span>
            </button>
          )}

          {/* Audio Controls */}
          <div className="relative flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1">
            <button
              onClick={handleToggleBgm}
              className={`p-1.5 rounded-md transition-colors ${
                isBgmPlaying
                  ? 'text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isBgmPlaying ? 'Jeda Muzik Latar' : 'Mainkan Muzik Latar Fantasi'}
            >
              <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
            </button>

            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-md transition-colors ${
                isMuted
                  ? 'text-red-400 bg-red-950/40 hover:bg-red-900/50'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Nyahbisu Audio' : 'Bisu Semua Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="hidden md:block text-[10px] font-mono text-slate-400 px-1 hover:text-cyan-300"
              title="Laras Kelantangan"
            >
              {Math.round(bgmVol * 100)}%
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-48 z-50">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex justify-between">
                  <span>Kelantangan Muzik</span>
                  <span className="text-cyan-400 tabular-nums">{Math.round(bgmVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVol}
                  onChange={handleVolumeChange}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundService.playButtonClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 transition-colors"
            title="Tetapan & Bantuan Kurikulum"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
