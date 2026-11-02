import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldCheck, HelpCircle, Flame, Star, Trophy } from 'lucide-react';
import { Character, Mission, Question } from '../../types/game';
import { QUESTION_BANK } from '../../data/questions';
import { soundService } from '../../services/soundService';

interface Mission5CrystalProps {
  mission: Mission;
  activeCharacter: Character;
  onFinish: (score: number, maxScore: number, xp: number) => void;
  onExit: () => void;
}

export const Mission5Crystal: React.FC<Mission5CrystalProps> = ({
  mission,
  activeCharacter,
  onFinish,
  onExit,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'basic' | 'skilled' | 'legendary'>('all');

  // Filter 5 curated challenge questions from bank
  const [challengeQuestions] = useState<Question[]>(() => {
    // Select a balanced mix of 5 questions across categories
    const q1 = QUESTION_BANK.find((q) => q.topic === 'alat_media' && q.id === 3) || QUESTION_BANK[0];
    const q2 = QUESTION_BANK.find((q) => q.topic === 'jenis_garisan' && q.id === 8) || QUESTION_BANK[6];
    const q3 = QUESTION_BANK.find((q) => q.topic === 'rupa_bentuk' && q.id === 15) || QUESTION_BANK[12];
    const q4 = QUESTION_BANK.find((q) => q.topic === 'teknik_lorekan' && q.id === 18) || QUESTION_BANK[17];
    const q5 = QUESTION_BANK.find((q) => q.topic === 'langkah_lukisan' && q.id === 23) || QUESTION_BANK[22];
    return [q1, q2, q3, q4, q5];
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [points, setPoints] = useState(0);

  // Phase 2: Crystal Core Alignment Puzzle
  const [phase, setPhase] = useState<'quiz' | 'crystal_puzzle' | 'victory'>('quiz');
  const [selectedShading, setSelectedShading] = useState<string | null>(null);
  const [puzzleUnlocked, setPuzzleUnlocked] = useState(false);

  const currentQ = challengeQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    soundService.playButtonClick();
    setSelectedOpt(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOpt === null || isAnswerChecked) return;
    setIsAnswerChecked(true);

    if (selectedOpt === currentQ.correctAnswerIndex) {
      soundService.playCorrectAnswer();
      setCorrectCount((c) => c + 1);
      setPoints((p) => p + 20);
    } else {
      soundService.playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    soundService.playButtonClick();
    if (currentIdx < challengeQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswerChecked(false);
    } else {
      // Transition to final Crystal Core Alignment
      setPhase('crystal_puzzle');
    }
  };

  const handleShadingPuzzle = (technique: string) => {
    soundService.playButtonClick();
    setSelectedShading(technique);

    // Correct technique to restore crystal facet is Silang Pangkah or Titikan
    if (technique === 'cross_hatch' || technique === 'hatching') {
      soundService.playVictoryFanfare();
      setPuzzleUnlocked(true);
      setPoints((p) => p + 20);
      setPhase('victory');
    } else {
      soundService.playWrongSound();
    }
  };

  const handleFinalVictory = () => {
    soundService.playVictoryFanfare();
    onFinish(points, 100, 200);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            MISI KEMUNCAK 5 · {mission.regionName}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">{mission.title}</h1>
          <p className="text-xs text-slate-300">{mission.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Markah Ujian: {points}/100</span>
          </div>
        </div>
      </div>

      {/* Phase 1: 5-Question Master Quiz */}
      {phase === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          {/* Question Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400 uppercase">
                CABARAN {currentIdx + 1} / {challengeQuestions.length}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                {currentQ.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Betul: {correctCount} soalan</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 mb-6">
            <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
              "{currentQ.question}"
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isCorrectTarget = i === currentQ.correctAnswerIndex;

              let style = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isSelected && !isAnswerChecked) {
                style = 'bg-purple-950/60 border-purple-400 text-purple-200 ring-2 ring-purple-400/40';
              } else if (isAnswerChecked) {
                if (isCorrectTarget) {
                  style = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrectTarget) {
                  style = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerChecked}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswerChecked && isCorrectTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrectTarget && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if checked */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl border mb-6 animate-fade-in ${
                selectedOpt === currentQ.correctAnswerIndex
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {selectedOpt === currentQ.correctAnswerIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tepat Sekali! (+20 Markah)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Penerangan Guru:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {activeCharacter.name}: "Fikir dengan tenang sebelum mengesahkan jawapan!"
            </span>

            {!isAnswerChecked ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-purple-400 text-slate-950 hover:bg-purple-300 disabled:opacity-40 disabled:pointer-events-none shadow-md transition-all cursor-pointer"
              >
                Sahkan Jawapan
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-purple-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
              >
                <span>
                  {currentIdx === challengeQuestions.length - 1
                    ? 'Buka Teras Kristal Menara'
                    : 'Soalan Seterusnya'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Phase 2: Shading Puzzle on Crystal Core */}
      {phase === 'crystal_puzzle' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Penyatuan Teras Kristal Inspirasi</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">
            Pilih Teknik Lorekan yang Tepat untuk Menghidupkan Kristal
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto mb-6">
            Teras Kristal memerlukan garisan bersilang pangkah (cross-hatching) untuk menghasilkan struktur faset tenaga 3D yang kukuh.
          </p>

          {/* Visual Shading Techniques Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleShadingPuzzle('cross_hatch')}
              className="flex flex-col items-center p-5 rounded-2xl border-2 bg-slate-950/70 border-slate-800 hover:border-purple-400 hover:bg-slate-900 transition-all cursor-pointer"
            >
              <svg className="w-16 h-16 mb-3" viewBox="0 0 60 60">
                <line x1="5" y1="5" x2="55" y2="55" stroke="#c084fc" strokeWidth="2.5" />
                <line x1="15" y1="5" x2="55" y2="45" stroke="#c084fc" strokeWidth="2.5" />
                <line x1="5" y1="15" x2="45" y2="55" stroke="#c084fc" strokeWidth="2.5" />
                <line x1="55" y1="5" x2="5" y2="55" stroke="#c084fc" strokeWidth="2.5" />
                <line x1="45" y1="5" x2="5" y2="45" stroke="#c084fc" strokeWidth="2.5" />
                <line x1="55" y1="15" x2="15" y2="55" stroke="#c084fc" strokeWidth="2.5" />
              </svg>
              <span className="text-xs font-bold text-white">Silang Pangkah</span>
              <span className="text-[10px] text-purple-300 font-mono">(Cross-Hatching)</span>
            </button>

            <button
              onClick={() => handleShadingPuzzle('stippling')}
              className="flex flex-col items-center p-5 rounded-2xl border-2 bg-slate-950/70 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <svg className="w-16 h-16 mb-3" viewBox="0 0 60 60">
                <circle cx="20" cy="20" r="2" fill="#94a3b8" />
                <circle cx="35" cy="15" r="2" fill="#94a3b8" />
                <circle cx="28" cy="30" r="2" fill="#94a3b8" />
                <circle cx="45" cy="28" r="2" fill="#94a3b8" />
                <circle cx="15" cy="40" r="2" fill="#94a3b8" />
                <circle cx="38" cy="45" r="2" fill="#94a3b8" />
              </svg>
              <span className="text-xs font-bold text-white">Titikan Halus</span>
              <span className="text-[10px] text-slate-400 font-mono">(Stippling)</span>
            </button>

            <button
              onClick={() => handleShadingPuzzle('smudging')}
              className="flex flex-col items-center p-5 rounded-2xl border-2 bg-slate-950/70 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <svg className="w-16 h-16 mb-3" viewBox="0 0 60 60">
                <rect x="10" y="10" width="40" height="40" rx="8" fill="url(#smudgeGrad)" />
                <defs>
                  <linearGradient id="smudgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xs font-bold text-white">Gosokan Licin</span>
              <span className="text-[10px] text-slate-400 font-mono">(Smudging)</span>
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: Grand Victory */}
      {phase === 'victory' && (
        <div className="max-w-2xl mx-auto bg-slate-900/95 border-2 border-amber-400/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-cyan-400 to-purple-500 p-0.5 shadow-2xl shadow-cyan-400/50 mb-4 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            TAHNIAH! KRISTAL INSPIRASI TEYVARA TELAH PULIH!
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed mb-6">
            Dengan kemahiran melukis yang telah kamu pelajari dalam Pendidikan Seni Visual Tahun 3, alam Teyvara kini kembali bercahaya dengan warna, jalinan, dan keindahan yang abadi!
          </p>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-400/30 mb-6 text-xs text-amber-200">
            Kamu telah dianugerahkan Lencana Tertinggi: <strong>"Legenda Seni Diraja"</strong> dan membuka Sijil Pengembara Seni Teyvara!
          </div>

          <button
            onClick={handleFinalVictory}
            className="w-full py-3.5 px-6 rounded-xl font-black text-base bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-400/40 transition-all cursor-pointer"
          >
            TERIMA GANJARAN & BUKA SIJIL PENGHARGAAN
          </button>
        </div>
      )}
    </div>
  );
};
