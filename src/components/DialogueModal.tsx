import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, FastForward, Sparkles } from 'lucide-react';
import { Character } from '../types/game';
import { soundService } from '../services/soundService';

export interface DialogueLine {
  speakerName: string;
  portraitPath: string;
  text: string;
  accent?: string;
}

interface DialogueModalProps {
  dialogues: DialogueLine[];
  onComplete: () => void;
  onSkip?: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  dialogues,
  onComplete,
  onSkip,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLine = dialogues[currentIndex] || dialogues[0];

  const handleNext = () => {
    soundService.playButtonClick();
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    soundService.playButtonClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    soundService.playButtonClick();
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900/95 border-2 border-cyan-400/50 rounded-3xl shadow-2xl p-4 md:p-6 backdrop-blur-md relative">
        {/* Skip button top right */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-cyan-300 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Langkau Dialog</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
          {/* Character Portrait */}
          <div className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/30">
            <img
              src={currentLine.portraitPath}
              alt={currentLine.speakerName}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </div>

          {/* Dialogue Text Content */}
          <div className="flex-1 text-left w-full">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm md:text-base font-extrabold text-cyan-300 tracking-wide uppercase">
                {currentLine.speakerName}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-mono">
                ({currentIndex + 1}/{dialogues.length})
              </span>
            </div>

            <div className="min-h-[70px] md:min-h-[85px] text-slate-100 text-sm md:text-base leading-relaxed font-medium">
              "{currentLine.text}"
            </div>

            {/* Navigation buttons inside RPG box */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 text-xs md:text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-400/30 transition-all cursor-pointer"
              >
                <span>{currentIndex === dialogues.length - 1 ? 'Mula Belajar & Bermain' : 'Seterusnya'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
