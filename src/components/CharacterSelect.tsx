import React, { useState } from 'react';
import { Check, Sparkles, Wand2, Shield, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { Character, CharacterId, PlayerProfile } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundService } from '../services/soundService';

interface CharacterSelectProps {
  profile: PlayerProfile;
  onSelectCharacter: (charId: CharacterId) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  profile,
  onSelectCharacter,
  onBack,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState<CharacterId>(profile.selectedCharacterId);
  const activeChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];

  const handleChoose = (id: CharacterId) => {
    soundService.playButtonClick();
    setSelectedId(id);
    onSelectCharacter(id);
  };

  const handleContinue = () => {
    soundService.playButtonClick();
    onSelectCharacter(selectedId);
    onConfirm();
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] py-6 px-4 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <button
            onClick={() => {
              soundService.playButtonClick();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Pilih Pengembara Seni Anda</span>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            Setiap watak memiliki kepakaran seni unik untuk membantu memulihkan dunia Teyvara.
          </p>
        </div>

        {/* Selected Confirmation CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sahkan Watak ({activeChar.name})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Character Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-stretch">
        {CHARACTERS.map((char) => {
          const isSelected = char.id === selectedId;
          return (
            <div
              key={char.id}
              onClick={() => handleChoose(char.id)}
              className={`relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? `border-cyan-400 bg-slate-900/90 shadow-2xl shadow-cyan-500/30 scale-[1.02] ring-2 ring-cyan-400/40`
                  : `border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80 opacity-80 hover:opacity-100`
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-xs font-black shadow-md">
                  <Check className="w-3.5 h-3.5" />
                  <span>DIPILIH</span>
                </div>
              )}

              {/* Character Anime Portrait Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                <img
                  src={char.imagePath}
                  alt={char.name}
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Floating specialty badge inside portrait */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700 text-cyan-300 backdrop-blur-sm">
                    {char.specialty}
                  </span>
                </div>
              </div>

              {/* Character Details Box */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900/95">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-white tracking-wide">{char.name}</h3>
                  </div>
                  <div className="text-xs font-semibold text-amber-300 mb-2">{char.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{char.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      Alat: <strong className="text-slate-200">{char.tool}</strong>
                    </span>
                  </div>
                  <div className="italic text-[11px] text-cyan-200/90 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    {char.quote}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoose(char.id);
                  }}
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? 'Watak Aktif' : 'Pilih ' + char.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-slate-400">
        Pilihan watak ini akan mengiringi kamu dalam setiap dialog misi, kanvas lakaran dan paparan sijil tamat permainan.
      </div>
    </div>
  );
};
