import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Award, RotateCcw, ArrowRight, Map, BookOpen, CheckCircle2 } from 'lucide-react';
import { Mission, Character } from '../types/game';
import { soundService } from '../services/soundService';

interface MissionResultModalProps {
  mission: Mission;
  score: number;
  maxScore: number;
  xpGained: number;
  activeCharacter: Character;
  onRetry: () => void;
  onNextMission: () => void;
  onReturnToMap: () => void;
}

export const MissionResultModal: React.FC<MissionResultModalProps> = ({
  mission,
  score,
  maxScore,
  xpGained,
  activeCharacter,
  onRetry,
  onNextMission,
  onReturnToMap,
}) => {
  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#facc15', '#a855f7'],
      });
    } catch {}
  }, []);

  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900/95 border-2 border-cyan-400/60 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative text-center">
        {/* Victory Crest */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-amber-300 p-0.5 shadow-xl shadow-cyan-400/40 mb-3 animate-float">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI {mission.id} SELESAI DENGAN JAYANYA!</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">{mission.title}</h2>
        <p className="text-xs text-slate-300 mb-4">{mission.subtitle}</p>

        {/* Score & Rewards Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold">Markah</div>
            <div className="text-xl font-black text-cyan-400 tabular-nums">
              {score} / {maxScore}
            </div>
            <div className="text-[10px] text-slate-400">{percentage}% Keputusan</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30">
            <div className="text-[11px] text-slate-400 font-semibold">Pengalaman</div>
            <div className="text-xl font-black text-amber-300 tabular-nums">+{xpGained}</div>
            <div className="text-[10px] text-amber-400/80">Mata XP</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/30">
            <div className="text-[11px] text-slate-400 font-semibold">Lencana</div>
            <div className="text-xs font-bold text-emerald-300 truncate mt-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{mission.badgeReward}</span>
            </div>
            <div className="text-[10px] text-emerald-400/80">Diperoleh ✓</div>
          </div>
        </div>

        {/* Shard Showcase */}
        <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-indigo-950/40 rounded-2xl border border-cyan-500/30 mb-5 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase">Serpihan Kristal Dituntut:</div>
            <div className="text-xs font-extrabold text-white">{mission.shardName}</div>
          </div>
        </div>

        {/* Curriculum Takeaways */}
        <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-left mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nota Pembelajaran Penting:</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-300">
            {mission.learningObjectives.slice(0, 2).map((obj, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              soundService.playButtonClick();
              onRetry();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cuba Semula</span>
          </button>

          <button
            onClick={() => {
              soundService.playButtonClick();
              onReturnToMap();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Dunia</span>
          </button>

          {mission.id < 5 ? (
            <button
              onClick={() => {
                soundService.playButtonClick();
                onNextMission();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-cyan-400/30 transition-all cursor-pointer"
            >
              <span>Misi Seterusnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundService.playButtonClick();
                onReturnToMap();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-400/30 transition-all cursor-pointer"
            >
              <span>Lihat Sijil Kemenangan</span>
              <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
