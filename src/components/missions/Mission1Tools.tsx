import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle, Check, Award } from 'lucide-react';
import { Character, Mission } from '../../types/game';
import { soundService } from '../../services/soundService';

interface Mission1ToolsProps {
  mission: Mission;
  activeCharacter: Character;
  onFinish: (score: number, maxScore: number, xp: number) => void;
  onExit: () => void;
}

interface ToolCard {
  id: string;
  name: string;
  category: 'Lakaran' | 'Lorekan' | 'Pembersihan' | 'Permukaan' | 'Warna Kering' | 'Bantuan Garisan';
  description: string;
  kssrTip: string;
  iconName: string;
}

const TOOLS_INFO: ToolCard[] = [
  {
    id: 'hb_pencil',
    name: 'Pensel HB',
    category: 'Lakaran',
    description: 'Pensel bermata keras yang menghasilkan garisan kelabu cerah dan nipis.',
    kssrTip: 'Sesuai untuk membuat lakaran asas awal kerana mudah dipadam jika tersilap.',
    iconName: '✏️',
  },
  {
    id: '6b_pencil',
    name: 'Pensel 4B / 6B',
    category: 'Lorekan',
    description: 'Pensel bermata lembut dan pekat warna hitamnya.',
    kssrTip: 'Pilihan terbaik untuk melorek bayang gelap dan ton pekat pada objek 3D.',
    iconName: '🖋️',
  },
  {
    id: 'eraser',
    name: 'Pemadam Seni',
    category: 'Pembersihan',
    description: 'Bahan getah sintetik untuk memadam kesan grafit pensel.',
    kssrTip: 'Bukan sahaja memadam silap, malah boleh mencipta kesan pantulan cahaya (highlight)!',
    iconName: '🧹',
  },
  {
    id: 'paper',
    name: 'Kertas Lukisan',
    category: 'Permukaan',
    description: 'Kertas putih bersaiz piawai dengan permukaan rata.',
    kssrTip: 'Permukaan utama untuk mengaplikasikan pelbagai jenis media kering.',
    iconName: '📄',
  },
  {
    id: 'oil_pastels',
    name: 'Pastel Minyak / Pensel Warna',
    category: 'Warna Kering',
    description: 'Media warna berpigmen tanpa memerlukan campuran air.',
    kssrTip: 'Memberi warna terang dan jalinan tebal pada lukisan Tahun 3.',
    iconName: '🖍️',
  },
  {
    id: 'ruler',
    name: 'Pembaris',
    category: 'Bantuan Garisan',
    description: 'Alat pengukur bersenggat lurus.',
    kssrTip: 'Membantu melukis garisan lurus tegak atau mendatar dengan kemas.',
    iconName: '📏',
  },
];

interface MatchingTask {
  situation: string;
  targetToolId: string;
  explanation: string;
}

const MATCHING_TASKS: MatchingTask[] = [
  {
    situation: 'Kamu mahu memulakan lakaran asas bentuk pasu bunga dengan garisan halus yang tidak meninggalkan comot.',
    targetToolId: 'hb_pencil',
    explanation: 'Tepat! Pensel HB menghasilkan garisan cerah dan nipis yang mudah dipadam.',
  },
  {
    situation: 'Kamu mahu melorek bahagian bayang paling gelap di belakang buah epal agar tampak bulat (3D).',
    targetToolId: '6b_pencil',
    explanation: 'Hebat! Pensel 4B atau 6B menghasilkan ton hitam yang pekat untuk bayang.',
  },
  {
    situation: 'Kamu ingin menghasilkan kesan kilauan cahaya (highlight) putih pada permukaan buah yang terkena lampu.',
    targetToolId: 'eraser',
    explanation: 'Pintar! Pemadam boleh memadam sedikit lorekan untuk menghasilkan kilauan cahaya.',
  },
  {
    situation: 'Kamu ingin mewarnakan kelopak bunga menggunakan media kering yang tidak memerlukan bancuhan air.',
    targetToolId: 'oil_pastels',
    explanation: 'Betul sekali! Pastel minyak dan pensel warna ialah media warna kering.',
  },
];

export const Mission1Tools: React.FC<Mission1ToolsProps> = ({
  mission,
  activeCharacter,
  onFinish,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [selectedTool, setSelectedTool] = useState<ToolCard>(TOOLS_INFO[0]);

  // Quiz state
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);

  const currentTask = MATCHING_TASKS[taskIndex];

  const handleSelectToolAnswer = (toolId: string) => {
    if (isAnswerChecked) return;
    soundService.playButtonClick();
    setSelectedAnswer(toolId);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || isAnswerChecked) return;
    setIsAnswerChecked(true);

    if (selectedAnswer === currentTask.targetToolId) {
      soundService.playCorrectAnswer();
      setScore((prev) => prev + 25);
    } else {
      soundService.playWrongSound();
    }
  };

  const handleNextTask = () => {
    soundService.playButtonClick();
    if (taskIndex < MATCHING_TASKS.length - 1) {
      setTaskIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      // Completed all tasks
      const finalScore = score + (selectedAnswer === currentTask.targetToolId ? 0 : 0);
      onFinish(finalScore, 100, 100);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Top Mission Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            MISI 1 · {mission.regionName}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">{mission.title}</h1>
          <p className="text-xs text-slate-300">{mission.subtitle}</p>
        </div>

        {/* Tab switch between Explore and Quiz */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveTab('explore');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Terokai Alat Seni
          </button>
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Ujian Padanan Alat ({score}/100)
          </button>
        </div>
      </div>

      {/* Mode 1: Exploration of Tools */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Tool Selection Grid (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {TOOLS_INFO.map((tool) => {
              const isSelected = selectedTool.id === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    soundService.playButtonClick();
                    setSelectedTool(tool);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-102'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-3xl mb-1">{tool.iconName}</span>
                  <span className="text-xs font-bold text-white text-center">{tool.name}</span>
                  <span className="text-[10px] text-emerald-400/90 font-medium">{tool.category}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Tool Showcase Panel (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  {selectedTool.category}
                </span>
                <span className="text-3xl">{selectedTool.iconName}</span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{selectedTool.name}</h2>
              <p className="text-sm text-slate-200 leading-relaxed mb-4">{selectedTool.description}</p>

              {/* DSKP Tip Box */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Petua Penting PSV Tahun 3:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedTool.kssrTip}</p>
              </div>

              {/* Visual Distinction note */}
              <div className="bg-slate-950/50 rounded-xl p-3 text-[11px] text-slate-400">
                Media Kering tidak memerlukan air untuk menghasilkan kesan seni. Ini membezakannya dengan media basah seperti cat poster atau cat air.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Mentor Mira: "Sudah faham fungsi setiap alat? Jom cuba Ujian Padanan!"
              </span>
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTab('quiz');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-md transition-all cursor-pointer"
              >
                <span>Mula Ujian</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Matching Challenge Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">
                SOALAN {taskIndex + 1} DARIPADA {MATCHING_TASKS.length}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-300">
              Markah Terkumpul: <span className="tabular-nums text-sm">{score}</span>
            </div>
          </div>

          {/* Situation Prompt */}
          <div className="mb-6 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">Situasi Melukis:</div>
            <div className="text-base md:text-lg font-bold text-white leading-relaxed">
              "{currentTask.situation}"
            </div>
          </div>

          <div className="text-xs font-bold text-slate-300 mb-3">
            Pilih alat atau media yang paling tepat untuk situasi di atas:
          </div>

          {/* Tool Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {TOOLS_INFO.map((tool) => {
              const isSelected = selectedAnswer === tool.id;
              const isCorrectTarget = tool.id === currentTask.targetToolId;

              let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isSelected && !isAnswerChecked) {
                btnStyle = 'bg-emerald-950/50 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40';
              } else if (isAnswerChecked) {
                if (isCorrectTarget) {
                  btnStyle = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrectTarget) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={tool.id}
                  disabled={isAnswerChecked}
                  onClick={() => handleSelectToolAnswer(tool.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="text-2xl">{tool.iconName}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{tool.name}</div>
                    <div className="text-[11px] text-slate-400">{tool.category}</div>
                  </div>
                  {isAnswerChecked && isCorrectTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrectTarget && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl border mb-6 animate-fade-in ${
                selectedAnswer === currentTask.targetToolId
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {selectedAnswer === currentTask.targetToolId ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Jawapan Tepat! (+25 Markah)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Penerangan Guru Mira:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{currentTask.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                soundService.playButtonClick();
                setActiveTab('explore');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              Semak Rujukan Alat
            </button>

            {!isAnswerChecked ? (
              <button
                disabled={!selectedAnswer}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
              >
                Sahkan Jawapan
              </button>
            ) : (
              <button
                onClick={handleNextTask}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <span>{taskIndex === MATCHING_TASKS.length - 1 ? 'Tamatkan Misi 1' : 'Soalan Seterusnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
