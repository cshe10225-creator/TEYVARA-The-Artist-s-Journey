import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, Eye, Layers, Brush, SunMedium, Sparkle, ArrowUp, ArrowDown } from 'lucide-react';
import { Character, Mission } from '../../types/game';
import { soundService } from '../../services/soundService';

interface Mission3SketchProps {
  mission: Mission;
  activeCharacter: Character;
  onFinish: (score: number, maxScore: number, xp: number) => void;
  onExit: () => void;
}

interface StepItem {
  id: number;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const INITIAL_STEPS: StepItem[] = [
  {
    id: 1,
    label: '1. Pemerhatian Objek',
    desc: 'Memerhatikan rupa bentuk, perkadaran, jalinan, dan dari mana datangnya arah punca cahaya.',
    icon: <Eye className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 2,
    label: '2. Lakaran Asas Rupa Mudah',
    desc: 'Menggunakan pensel HB dan garisan halus untuk melakar rupa geometri/organik asas (contoh: bulatan atau bujur).',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 3,
    label: '3. Memperincikan Rupa Bentuk',
    desc: 'Menambah butiran objek seperti tangkai, lekukan kelopak atau muncung pasu.',
    icon: <Brush className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 4,
    label: '4. Melorek Ton & Jalinan',
    desc: 'Melorek bahagian terlindung cahaya dengan pensel 2B/4B/6B daripada cerah ke gelap untuk ilusi 3 dimensi.',
    icon: <SunMedium className="w-4 h-4 text-indigo-400" />,
  },
  {
    id: 5,
    label: '5. Kemasan Akhir',
    desc: 'Membersihkan kesan comot pensel dengan pemadam, mempertegas garisan penting, dan membingkai karya.',
    icon: <Sparkle className="w-4 h-4 text-purple-400" />,
  },
];

export const Mission3Sketch: React.FC<Mission3SketchProps> = ({
  mission,
  activeCharacter,
  onFinish,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sequence_game' | 'quiz'>('pipeline');
  const [pipelineStep, setPipelineStep] = useState(1);

  // Sequencing game state: shuffled steps
  const [userSequence, setUserSequence] = useState<StepItem[]>(() => {
    // Deliberately scrambled initially
    return [INITIAL_STEPS[2], INITIAL_STEPS[0], INITIAL_STEPS[4], INITIAL_STEPS[1], INITIAL_STEPS[3]];
  });
  const [isSequenceChecked, setIsSequenceChecked] = useState(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState(false);

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSequenceChecked) return;
    soundService.playButtonClick();
    const newSeq = [...userSequence];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSeq.length) return;
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setUserSequence(newSeq);
  };

  const handleCheckSequence = () => {
    soundService.playButtonClick();
    setIsSequenceChecked(true);
    const correct = userSequence.every((item, i) => item.id === i + 1);
    setIsSequenceCorrect(correct);
    if (correct) {
      soundService.playCorrectAnswer();
    } else {
      soundService.playWrongSound();
    }
  };

  const handleResetSequence = () => {
    soundService.playButtonClick();
    setIsSequenceChecked(false);
    setIsSequenceCorrect(false);
    setUserSequence([INITIAL_STEPS[2], INITIAL_STEPS[0], INITIAL_STEPS[4], INITIAL_STEPS[1], INITIAL_STEPS[3]]);
  };

  const handleCheckQuiz = (selectedIdx: number) => {
    if (isQuizChecked) return;
    setQuizAnswer(selectedIdx);
    setIsQuizChecked(true);

    if (selectedIdx === 0) {
      soundService.playCorrectAnswer();
      setQuizScore(50);
    } else {
      soundService.playWrongSound();
      setQuizScore(20);
    }
  };

  const handleCompleteMission = () => {
    soundService.playButtonClick();
    const totalScore = (isSequenceCorrect ? 50 : 25) + quizScore;
    onFinish(totalScore, 100, 120);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            MISI 3 · {mission.regionName}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">{mission.title}</h1>
          <p className="text-xs text-slate-300">{mission.subtitle}</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveTab('pipeline');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pipeline' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Proses 5 Langkah
          </button>
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveTab('sequence_game');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sequence_game' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Permainan Susun Langkah
          </button>
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Ujian Konsep
          </button>
        </div>
      </div>

      {/* Tab 1: Pipeline Interactive Visual Progression */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Step Selector Buttons (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {INITIAL_STEPS.map((st) => {
              const isActive = pipelineStep === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    soundService.playButtonClick();
                    setPipelineStep(st.id);
                  }}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {st.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{st.label}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{st.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Progression Stage (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                  Langkah {pipelineStep} daripada 5: {INITIAL_STEPS[pipelineStep - 1].label}
                </span>
                <span className="text-xs text-slate-400">Contoh: Melukis Pasu Ajaib</span>
              </div>

              {/* Dynamic SVG Demonstration based on step */}
              <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center p-6 overflow-hidden">
                <svg className="w-64 h-64" viewBox="0 0 200 200">
                  {/* Step 1: Eye & Light Ray indicator */}
                  {pipelineStep >= 1 && (
                    <g opacity="0.6">
                      <line x1="20" y1="20" x2="60" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx="20" cy="20" r="8" fill="#f59e0b" />
                      <text x="32" y="24" fill="#f59e0b" fontSize="10" fontWeight="bold">Punca Cahaya</text>
                    </g>
                  )}

                  {/* Step 2: Light Base Geometry Guide (Oval & Cylinder Box) */}
                  {pipelineStep >= 2 && (
                    <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray={pipelineStep === 2 ? '4 4' : 'none'} fill="none" opacity={pipelineStep === 2 ? '0.9' : '0.3'}>
                      <ellipse cx="100" cy="50" rx="30" ry="10" />
                      <ellipse cx="100" cy="120" rx="50" ry="40" />
                      <ellipse cx="100" cy="170" rx="35" ry="10" />
                    </g>
                  )}

                  {/* Step 3: Detailed Outline */}
                  {pipelineStep >= 3 && (
                    <path
                      d="M 70 50 Q 85 80 50 120 Q 60 165 70 170 L 130 170 Q 140 165 150 120 Q 115 80 130 50 Z"
                      fill={pipelineStep >= 4 ? 'url(#vaseShading)' : 'rgba(56, 189, 248, 0.05)'}
                      stroke="#f8fafc"
                      strokeWidth={pipelineStep === 5 ? '3' : '2'}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Step 4: Shading & Ton (Gradients and Hatching) */}
                  {pipelineStep >= 4 && (
                    <defs>
                      <radialGradient id="vaseShading" cx="35%" cy="35%" r="70%">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="40%" stopColor="#0284c7" />
                        <stop offset="85%" stopColor="#0f172a" />
                      </radialGradient>
                    </defs>
                  )}

                  {/* Step 5: Final highlight and clean ground shadow */}
                  {pipelineStep === 5 && (
                    <g>
                      {/* Cast shadow on floor */}
                      <ellipse cx="120" cy="176" rx="45" ry="8" fill="rgba(0,0,0,0.6)" />
                      {/* Highlight stroke made with eraser */}
                      <path d="M 75 90 Q 65 115 72 135" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
                    </g>
                  )}
                </svg>

                {/* Step Caption */}
                <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 text-xs text-center text-slate-200">
                  {pipelineStep === 1 && 'Langkah 1: Perhatikan objek dan kedudukan punca cahaya di sebelah atas kiri.'}
                  {pipelineStep === 2 && 'Langkah 2: Lakar rupa asas geometri (bujur & bulatan) dengan garisan halus.'}
                  {pipelineStep === 3 && 'Langkah 3: Sambung dan perincikan lengkungan bibir dan badan pasu.'}
                  {pipelineStep === 4 && 'Langkah 4: Melorek ton gelap di bahagian kanan bertentangan dengan cahaya.'}
                  {pipelineStep === 5 && 'Langkah 5: Kemasan akhir, kilauan highlight dan bayang pada lantai.'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Kael: "Hebat! Sekarang uji kemahiranmu dalam Permainan Susun Langkah!"
              </span>
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTab('sequence_game');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
              >
                <span>Main Susun Langkah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sequencing Mini-Game */}
      {activeTab === 'sequence_game' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Susun Semula 5 Langkah Penghasilan Lukisan</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Langkah-langkah di bawah berselerak. Gunakan butang anak panah ke atas (▲) atau ke bawah (▼) untuk menyusunnya mengikut urutan yang betul dari Langkah 1 hingga Langkah 5.
            </p>
          </div>

          <div className="space-y-2.5 my-5">
            {userSequence.map((item, idx) => {
              const isCorrectPosition = isSequenceChecked && item.id === idx + 1;
              const isWrongPosition = isSequenceChecked && item.id !== idx + 1;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                    isCorrectPosition
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : isWrongPosition
                      ? 'bg-red-950/40 border-red-500 text-red-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-300">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>

                  {/* Reorder Buttons */}
                  {!isSequenceChecked && (
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Alih ke atas"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === userSequence.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Alih ke bawah"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isSequenceChecked && isCorrectPosition && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Validation Banner */}
          {isSequenceChecked && (
            <div
              className={`p-4 rounded-2xl border mb-5 ${
                isSequenceCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isSequenceCorrect ? 'Tahniah! Susunan 100% Tepat!' : 'Ada langkah yang belum tepat.'}
              </div>
              <p className="text-xs">
                {isSequenceCorrect
                  ? 'Kamu telah menguasai aliran proses penghasilan lukisan mengikut kurikulum PSV Tahun 3!'
                  : 'Ingat kembali: Kita mesti mulakan dengan Pemerhatian objek, diikuti Lakaran asas, Perincian, Lorekan ton, dan Kemasan akhir.'}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleResetSequence}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Susun Semula</span>
            </button>

            {!isSequenceChecked ? (
              <button
                onClick={handleCheckSequence}
                className="px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
              >
                Sahkan Susunan
              </button>
            ) : (
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTab('quiz');
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                <span>Teruskan ke Ujian Konsep</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Concept Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-5 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Ujian Penguasaan Bengkel Lakaran
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              Mengapakah lakaran asas perlu dilukis dengan garisan yang HALUS dan RINGAN?
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {[
              {
                text: 'Supaya mudah dibetulkan dan dipadam tanpa merosakkan permukaan kertas lukisan',
                correct: true,
              },
              {
                text: 'Supaya orang lain tidak dapat melihat lukisan kita',
                correct: false,
              },
              {
                text: 'Kerana pensel akan terus patah jika ditekan kuat',
                correct: false,
              },
              {
                text: 'Supaya kita tidak perlu melukis bayang gelap lagi',
                correct: false,
              },
            ].map((opt, i) => {
              const isSelected = quizAnswer === i;
              let style = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700';

              if (isQuizChecked) {
                if (opt.correct) {
                  style = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected && !opt.correct) {
                  style = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isQuizChecked}
                  onClick={() => handleCheckQuiz(i)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${style}`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {isQuizChecked && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-xs text-slate-300 leading-relaxed">
              Mentor Mira: "Tepat sekali! Garisan ringan membolehkan kita merancang perkadaran tanpa mencacatkan kertas lukisan."
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              disabled={!isQuizChecked}
              onClick={handleCompleteMission}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <span>Selesaikan Misi 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
