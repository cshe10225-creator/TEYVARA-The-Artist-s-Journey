import React from 'react';
import { Play, Sparkles, UserCheck, Image as ImageIcon, BookOpen, Settings, Compass } from 'lucide-react';
import { PlayerProfile, Character, GameScreen } from '../types/game';
import { soundService } from '../services/soundService';

interface TitleScreenProps {
  profile: PlayerProfile;
  activeCharacter: Character;
  onNavigate: (screen: GameScreen) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  activeCharacter,
  onNavigate,
  onOpenSettings,
  onOpenAbout,
}) => {
  const hasSavedProgress = profile.completedMissions.length > 0 || profile.xp > 0;

  const handleStartNewGame = () => {
    soundService.playButtonClick();
    soundService.startBGM();
    // If first time, let player choose character; otherwise go to map
    if (profile.completedMissions.length === 0) {
      onNavigate('CHAR_SELECT');
    } else {
      onNavigate('WORLD_MAP');
    }
  };

  const handleContinue = () => {
    soundService.playButtonClick();
    soundService.startBGM();
    onNavigate('WORLD_MAP');
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] flex flex-col justify-between items-center text-center px-4 py-8 overflow-hidden select-none">
      {/* Background Anime Fantasy World Illustration */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/teyvara_world_landscape_1793628365981.jpg"
          alt="Alam Fantasi Teyvara"
          className="w-full h-full object-cover object-center filter brightness-95 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette and Cinematic Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/50" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/80" />
      </div>

      {/* Floating Magic Art Particles Layer */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-300/40 blur-[1px] animate-float"
            style={{
              width: `${(i % 3) * 4 + 4}px`,
              height: `${(i % 3) * 4 + 4}px`,
              left: `${(i * 7 + 10) % 95}%`,
              top: `${(i * 8 + 15) % 85}%`,
              animationDelay: `${(i * 0.4).toFixed(1)}s`,
              animationDuration: `${(3 + (i % 4)).toFixed(1)}s`,
            }}
          />
        ))}
      </div>

      {/* Top Banner / Subject Tag */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/30 backdrop-blur-sm text-cyan-200 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Pendidikan Seni Visual Tahun 3 KSSR · Bidang Lukisan</span>
        </div>
      </div>

      {/* Hero Centerpiece & Title Lockup */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center my-auto">
        <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_10px_20px_rgba(6,182,212,0.6)]">
          TEYVARA
        </h1>
        <div className="flex items-center gap-3 my-2">
          <div className="h-0.5 w-12 md:w-24 bg-gradient-to-r from-transparent via-cyan-400 to-amber-300" />
          <h2 className="text-sm md:text-lg lg:text-xl font-bold tracking-[0.25em] text-amber-300 uppercase">
            THE ARTIST'S JOURNEY
          </h2>
          <div className="h-0.5 w-12 md:w-24 bg-gradient-to-l from-transparent via-cyan-400 to-amber-300" />
        </div>

        <p className="mt-3 text-sm md:text-base text-slate-200 max-w-xl font-medium leading-relaxed drop-shadow-md">
          Alam Teyvara menanti kehadiranmu. Kuasai kemahiran melukis, kumpulkan lima serpihan
          <span className="text-cyan-300 font-semibold"> Kristal Inspirasi</span>, dan kembalikan keindahan alam seni!
        </p>

        {/* Selected Hero Preview Card */}
        <div className="mt-6 flex items-center gap-3 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-2.5 pr-4 backdrop-blur-md shadow-xl">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400">
            <img
              src={activeCharacter.imagePath}
              alt={activeCharacter.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-400">Pengembara Dipilih:</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{activeCharacter.name}</span>
              <span className="text-xs text-cyan-300 font-normal">({activeCharacter.specialty})</span>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playButtonClick();
              onNavigate('CHAR_SELECT');
            }}
            className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors"
          >
            Tukar
          </button>
        </div>

        {/* Main Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center">
          <button
            onClick={handleStartNewGame}
            className="group w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base md:text-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/30 border border-cyan-300 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULA PENGEMBARAAN</span>
          </button>

          {hasSavedProgress && (
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm md:text-base bg-slate-900/90 text-amber-300 hover:bg-slate-850 hover:text-amber-200 border border-amber-400/40 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>SAMBUNG (TAHAP {profile.level})</span>
            </button>
          )}
        </div>

        {/* Secondary Navigation Row */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              soundService.playButtonClick();
              onNavigate('CHAR_SELECT');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/80 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pilih Watak</span>
          </button>

          <button
            onClick={() => {
              soundService.playButtonClick();
              onNavigate('GALLERY');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/80 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Galeri Murid</span>
          </button>

          <button
            onClick={() => {
              soundService.playButtonClick();
              onOpenAbout();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/80 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Panduan Guru & DSKP</span>
          </button>

          <button
            onClick={() => {
              soundService.playButtonClick();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/80 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Tetapan & Muzik</span>
          </button>
        </div>
      </div>

      {/* Control Hint Line at Bottom */}
      <div className="relative z-10 pt-4 text-xs text-slate-400 font-medium">
        <span>Gunakan Tetikus / Sentuhan Skrin untuk Bermain · Muzik Fantasi Dikuasakan Web Audio</span>
      </div>
    </div>
  );
};
