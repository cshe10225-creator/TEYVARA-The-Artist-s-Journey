import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, PenTool, Check, Wand2 } from 'lucide-react';
import { Character, Mission } from '../../types/game';
import { soundService } from '../../services/soundService';

interface Mission2LinesProps {
  mission: Mission;
  activeCharacter: Character;
  onFinish: (score: number, maxScore: number, xp: number) => void;
  onExit: () => void;
}

interface LineConcept {
  id: string;
  name: string;
  feeling: string;
  natureExample: string;
  strokeSvg: React.ReactNode;
}

const LINE_TYPES: LineConcept[] = [
  {
    id: 'lurus',
    name: 'Garisan Lurus',
    feeling: 'Teguh, kukuh, dan stabil',
    natureExample: 'Batang pokok tinggi, tiang rumah, dan laluan ufuk.',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <line x1="10" y1="20" x2="190" y2="20" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'beralun',
    name: 'Garisan Beralun',
    feeling: 'Lembut, mengalir, dan tenang',
    natureExample: 'Ombak laut, rabung bukit, dan rambut berkibar.',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <path d="M 10 20 Q 35 5 60 20 T 110 20 T 160 20 T 190 20" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'zigzag',
    name: 'Garisan Bergerigi (Zigzag)',
    feeling: 'Tajam, cemas, tenaga pantas',
    natureExample: 'Kilat di langit, duri kaktus, dan gigi raksasa.',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <path d="M 10 30 L 35 10 L 60 30 L 85 10 L 110 30 L 135 10 L 160 30 L 185 10" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'berlingkar',
    name: 'Garisan Berlingkar',
    feeling: 'Berpusing, dinamik, dan berpusar',
    natureExample: 'Cengkerang siput, pusaran air, dan kepulan asap.',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <path d="M 100 20 m -30 0 a 30 30 0 1 0 60 0 a 20 20 0 1 0 -40 0 a 10 10 0 1 0 20 0" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'putus',
    name: 'Garisan Putus-putus',
    feeling: 'Berperingkat dan tidak berterusan',
    natureExample: 'Laluan pergerakan semut dan jahitan baju.',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <line x1="10" y1="20" x2="190" y2="20" stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tebal_nipis',
    name: 'Garisan Tebal & Nipis',
    feeling: 'Menimbulkan kesan ruang dekat dan jauh',
    natureExample: 'Objek dekat (garisan tebal), objek jauh (garisan nipis).',
    strokeSvg: (
      <svg className="w-full h-12" viewBox="0 0 200 40">
        <line x1="10" y1="20" x2="80" y2="20" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
        <line x1="100" y1="20" x2="190" y2="20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface LineQuizItem {
  question: string;
  imageHint: string;
  correctType: string;
  options: string[];
}

const LINE_QUIZZES: LineQuizItem[] = [
  {
    question: 'Aira mahu melukis bukit bukau dan ombak air terjun di Hutan Garisan. Garisan manakah yang paling sesuai?',
    imageHint: '🌊',
    correctType: 'Garisan Beralun',
    options: ['Garisan Beralun', 'Garisan Bergerigi', 'Garisan Lurus Menegak', 'Garisan Putus-putus'],
  },
  {
    question: 'Kael ingin melukis kilat yang menyambar pokok purba semasa ribut petir. Garisan manakah yang patut digunakan?',
    imageHint: '⚡',
    correctType: 'Garisan Bergerigi (Zigzag)',
    options: ['Garisan Berlingkar', 'Garisan Bergerigi (Zigzag)', 'Garisan Beralun', 'Garisan Bulat'],
  },
  {
    question: 'Untuk melukis kulit siput kristal ajaib yang berputar dari dalam ke luar, jenis garisan apakah ini?',
    imageHint: '🐌',
    correctType: 'Garisan Berlingkar',
    options: ['Garisan Berlingkar', 'Garisan Lurus', 'Garisan Putus-putus', 'Garisan Melintang'],
  },
];

export const Mission2Lines: React.FC<Mission2LinesProps> = ({
  mission,
  activeCharacter,
  onFinish,
  onExit,
}) => {
  const [activeStep, setActiveStep] = useState<'study' | 'trace' | 'quiz'>('study');
  const [selectedLine, setSelectedLine] = useState<LineConcept>(LINE_TYPES[0]);

  // Tracing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracedPointsCount, setTracedPointsCount] = useState(0);
  const [isTraceComplete, setIsTraceComplete] = useState(false);
  const [traceType, setTraceType] = useState<'wavy' | 'zigzag' | 'spiral'>('wavy');

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [score, setScore] = useState(0);

  // Setup tracing canvas background guide
  useEffect(() => {
    if (activeStep !== 'trace') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set internal resolution
    canvas.width = 600;
    canvas.height = 300;

    drawGuide(ctx, traceType);
  }, [activeStep, traceType]);

  const drawGuide = (ctx: CanvasRenderingContext2D, type: 'wavy' | 'zigzag' | 'spiral') => {
    ctx.clearRect(0, 0, 600, 300);

    // Guide background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 600, 300);

    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';

    if (type === 'wavy') {
      ctx.beginPath();
      ctx.moveTo(40, 150);
      for (let x = 40; x <= 560; x += 10) {
        const y = 150 + Math.sin((x - 40) * 0.03) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (type === 'zigzag') {
      ctx.beginPath();
      ctx.moveTo(40, 200);
      const stepW = 65;
      for (let i = 0; i < 8; i++) {
        const x = 40 + i * stepW;
        const y = i % 2 === 0 ? 100 : 200;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (type === 'spiral') {
      ctx.beginPath();
      const cx = 300;
      const cy = 150;
      for (let a = 0; a < Math.PI * 8; a += 0.1) {
        const r = 5 + a * 4;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startTrace = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    soundService.playSketchSound();
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawTrace = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#38bdf8'; // Glowing azure
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.lineTo(x, y);
    ctx.stroke();

    setTracedPointsCount((prev) => {
      const next = prev + 1;
      if (next >= 50 && !isTraceComplete) {
        setIsTraceComplete(true);
        soundService.playCorrectAnswer();
      }
      return next;
    });
  };

  const stopTrace = () => {
    setIsDrawing(false);
  };

  const resetTraceCanvas = () => {
    soundService.playButtonClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGuide(ctx, traceType);
    setTracedPointsCount(0);
    setIsTraceComplete(false);
  };

  // Quiz Handling
  const currentQuiz = LINE_QUIZZES[quizIdx];

  const handleSelectQuiz = (opt: string) => {
    if (isQuizChecked) return;
    soundService.playButtonClick();
    setSelectedAnswer(opt);
  };

  const handleCheckQuiz = () => {
    if (!selectedAnswer || isQuizChecked) return;
    setIsQuizChecked(true);

    if (selectedAnswer === currentQuiz.correctType) {
      soundService.playCorrectAnswer();
      setScore((s) => s + 30);
    } else {
      soundService.playWrongSound();
    }
  };

  const handleNextQuiz = () => {
    soundService.playButtonClick();
    if (quizIdx < LINE_QUIZZES.length - 1) {
      setQuizIdx((q) => q + 1);
      setSelectedAnswer(null);
      setIsQuizChecked(false);
    } else {
      // Completed Mission 2 (max score 100: 10 trace bonus + 90 quiz)
      const finalScore = score + (isTraceComplete ? 10 : 0);
      onFinish(Math.min(100, finalScore), 100, 110);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            MISI 2 · {mission.regionName}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">{mission.title}</h1>
          <p className="text-xs text-slate-300">{mission.subtitle}</p>
        </div>

        {/* 3 Steps Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveStep('study');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeStep === 'study' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Jenis Garisan
          </button>
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveStep('trace');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeStep === 'trace' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Ikut Laluan Garisan
          </button>
          <button
            onClick={() => {
              soundService.playButtonClick();
              setActiveStep('quiz');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeStep === 'quiz' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Ujian Garisan
          </button>
        </div>
      </div>

      {/* Step 1: Study Line Types */}
      {activeStep === 'study' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {LINE_TYPES.map((line) => {
              const isSelected = selectedLine.id === line.id;
              return (
                <button
                  key={line.id}
                  onClick={() => {
                    soundService.playButtonClick();
                    setSelectedLine(line);
                  }}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full mb-1">{line.strokeSvg}</div>
                  <span className="text-xs font-bold text-white text-center">{line.name}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Unsur Seni PSV Tahun 3
                </span>
                <span className="text-xs font-semibold text-slate-400">Garisan & Bentuk</span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{selectedLine.name}</h2>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/30 mb-4">
                {selectedLine.strokeSvg}
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-amber-300 font-bold mb-0.5">Kesan Visual / Perasaan:</div>
                  <div className="text-xs text-slate-200">{selectedLine.feeling}</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-cyan-300 font-bold mb-0.5">Contoh dalam Alam Semula Jadi:</div>
                  <div className="text-xs text-slate-200">{selectedLine.natureExample}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Aira: "Jom kita cuba lakarkan laluan garisan ini di atas kanvas ajaib!"
              </span>
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveStep('trace');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer shadow-md"
              >
                <span>Uji Melukis Garisan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Interactive Tracing Activity */}
      {activeStep === 'trace' && (
        <div className="max-w-4xl mx-auto bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-cyan-400" />
                <span>Aktiviti Ikut Laluan Garisan Ajaib</span>
              </h2>
              <p className="text-xs text-slate-300">
                Gunakan jari atau tetikus untuk menyambung laluan garisan mengikut titik panduan.
              </p>
            </div>

            {/* Line Type Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setTraceType('wavy');
                  setTracedPointsCount(0);
                  setIsTraceComplete(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  traceType === 'wavy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Beralun
              </button>
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setTraceType('zigzag');
                  setTracedPointsCount(0);
                  setIsTraceComplete(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  traceType === 'zigzag' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Zigzag
              </button>
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setTraceType('spiral');
                  setTracedPointsCount(0);
                  setIsTraceComplete(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  traceType === 'spiral' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Berlingkar
              </button>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner flex items-center justify-center touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startTrace}
              onMouseMove={drawTrace}
              onMouseUp={stopTrace}
              onMouseLeave={stopTrace}
              onTouchStart={startTrace}
              onTouchMove={drawTrace}
              onTouchEnd={stopTrace}
              className="w-full h-full cursor-crosshair"
            />

            {/* Victory Badge once completed */}
            {isTraceComplete && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black shadow-lg animate-bounce pointer-events-none">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Tahniah! Garisan Berjaya Dipulihkan</span>
              </div>
            )}
          </div>

          {/* Canvas Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={resetTraceCanvas}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Lakar Semula</span>
            </button>

            <button
              onClick={() => {
                soundService.playButtonClick();
                setActiveStep('quiz');
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md transition-all cursor-pointer"
            >
              <span>Teruskan ke Ujian Garisan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quiz on Lines */}
      {activeStep === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
            <span className="text-xs font-bold text-cyan-400">
              SOALAN {quizIdx + 1} DARIPADA {LINE_QUIZZES.length}
            </span>
            <span className="text-xs font-bold text-amber-300">
              Markah: <span className="tabular-nums">{score}</span> / 90
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6 flex items-start gap-4">
            <span className="text-4xl p-2 bg-slate-900 rounded-xl border border-slate-700">
              {currentQuiz.imageHint}
            </span>
            <div className="text-base font-bold text-white leading-relaxed">
              "{currentQuiz.question}"
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQuiz.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isTarget = opt === currentQuiz.correctType;

              let style = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isSelected && !isQuizChecked) {
                style = 'bg-cyan-950/60 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30';
              } else if (isQuizChecked) {
                if (isTarget) {
                  style = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected && !isTarget) {
                  style = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isQuizChecked}
                  onClick={() => handleSelectQuiz(opt)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                soundService.playButtonClick();
                setActiveStep('study');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              Semak Nota Garisan
            </button>

            {!isQuizChecked ? (
              <button
                disabled={!selectedAnswer}
                onClick={handleCheckQuiz}
                className="px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none shadow-md transition-all cursor-pointer"
              >
                Sahkan Jawapan
              </button>
            ) : (
              <button
                onClick={handleNextQuiz}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <span>{quizIdx === LINE_QUIZZES.length - 1 ? 'Tamatkan Misi 2' : 'Soalan Seterusnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
