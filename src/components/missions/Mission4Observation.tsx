import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Save,
  Pen,
  Brush,
  Eraser,
  Grid,
  Eye,
  CheckCircle2,
  Award,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { Character, Mission, SavedArtwork } from '../../types/game';
import { soundService } from '../../services/soundService';
import { storageService } from '../../services/storageService';

interface Mission4ObservationProps {
  mission: Mission;
  activeCharacter: Character;
  onFinish: (score: number, maxScore: number, xp: number) => void;
  onExit: () => void;
}

interface ReferenceSubject {
  id: string;
  name: string;
  category: string;
  lightSource: string;
  tips: string;
  svgIcon: React.ReactNode;
}

const SUBJECTS: ReferenceSubject[] = [
  {
    id: 'apple',
    name: 'Buah Epal Merah',
    category: 'Flora & Buah',
    lightSource: 'Cahaya dari Kiri Atas',
    tips: 'Bentuk asas bulatan/organik. Perhatikan bayang gelap di bahagian kanan bawah.',
    svgIcon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="appleGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="90%" stopColor="#7f1d1d" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="92" rx="25" ry="5" fill="rgba(0,0,0,0.3)" />
        <path d="M 50 25 C 30 18, 15 35, 18 60 C 20 85, 45 90, 50 82 C 55 90, 80 85, 82 60 C 85 35, 70 18, 50 25 Z" fill="url(#appleGrad)" stroke="#991b1b" strokeWidth="2" />
        <path d="M 50 25 Q 52 10 60 8" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <path d="M 54 18 Q 70 12 65 22 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        <ellipse cx="38" cy="40" rx="6" ry="12" fill="#ffffff" opacity="0.4" transform="rotate(-20 38 40)" />
      </svg>
    ),
  },
  {
    id: 'vase',
    name: 'Pasu Bunga Seramik',
    category: 'Objek Buatan Manusia',
    lightSource: 'Cahaya dari Kanan Atas',
    tips: 'Bina garisan simetri tengah terlebih dahulu sebelum melorek badan pasu.',
    svgIcon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="vaseGrad" cx="65%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="60%" stopColor="#0891b2" />
            <stop offset="95%" stopColor="#164e63" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.3)" />
        <path d="M 35 25 Q 40 45 28 65 Q 26 85 35 88 L 65 88 Q 74 85 72 65 Q 60 45 65 25 Z" fill="url(#vaseGrad)" stroke="#155e75" strokeWidth="2" />
        <ellipse cx="50" cy="25" rx="15" ry="4" fill="#0891b2" stroke="#155e75" strokeWidth="1.5" />
        <ellipse cx="50" cy="88" rx="15" ry="3" fill="#164e63" />
      </svg>
    ),
  },
  {
    id: 'leaf',
    name: 'Daun Keladi Semulajadi',
    category: 'Alam Semula Jadi',
    lightSource: 'Cahaya Menyeluruh',
    tips: 'Gunakan garisan melengkung untuk urat daun dan garisan berombak untuk tepinya.',
    svgIcon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <path d="M 50 15 Q 85 40 70 80 Q 50 90 50 85 Q 50 90 30 80 Q 15 40 50 15 Z" fill="#15803d" stroke="#14532d" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="85" stroke="#86efac" strokeWidth="2.5" />
        <line x1="50" y1="35" x2="68" y2="45" stroke="#86efac" strokeWidth="1.5" />
        <line x1="50" y1="35" x2="32" y2="45" stroke="#86efac" strokeWidth="1.5" />
        <line x1="50" y1="52" x2="65" y2="62" stroke="#86efac" strokeWidth="1.5" />
        <line x1="50" y1="52" x2="35" y2="62" stroke="#86efac" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'crystal',
    name: 'Kristal Teyvara',
    category: 'Fantasi',
    lightSource: 'Bercahaya dari Dalam',
    tips: 'Gunakan garisan lurus bersilang untuk membentuk permukaan faset berkilau.',
    svgIcon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="crysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <polygon points="50,10 78,35 68,85 32,85 22,35" fill="url(#crysGrad)" stroke="#cffafe" strokeWidth="2" />
        <polyline points="50,10 50,85" stroke="#ecfeff" strokeWidth="1.5" />
        <polyline points="22,35 50,45 78,35" stroke="#ecfeff" strokeWidth="1.5" />
        <polyline points="32,85 50,45 68,85" stroke="#ecfeff" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const PRESET_COLORS = [
  '#000000', // Black
  '#334155', // Slate
  '#64748b', // Light slate
  '#94a3b8', // Gray
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#16a34a', // Green
  '#0284c7', // Blue
  '#4f46e5', // Indigo
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#78350f', // Brown
  '#ffffff', // White
];

export const Mission4Observation: React.FC<Mission4ObservationProps> = ({
  mission,
  activeCharacter,
  onFinish,
  onExit,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<ReferenceSubject>(SUBJECTS[0]);
  const [activeTool, setActiveTool] = useState<'pencil_hb' | 'pencil_6b' | 'brush' | 'eraser'>('pencil_hb');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [showGrid, setShowGrid] = useState(false);
  const [showGuideOutline, setShowGuideOutline] = useState(true);

  // Self-appreciation Rubric state (1 to 4 stars)
  const [rubricScores, setRubricScores] = useState({
    garisan: 4,
    bentuk: 4,
    ton: 3,
    kreativiti: 4,
  });
  const [artworkTitle, setArtworkTitle] = useState('Lukisan Pemerhatian Saya');
  const [artworkSaved, setArtworkSaved] = useState(false);

  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set fixed virtual dimensions
    canvas.width = 750;
    canvas.height = 500;

    // White paper surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state for undo
    const initial = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current = [initial];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Truncate any future redos
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    // Limit history stack
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  };

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return;
    soundService.playButtonClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyIndexRef.current--;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    soundService.playButtonClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyIndexRef.current++;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const handleClear = () => {
    soundService.playButtonClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
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

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pencil_hb') {
      ctx.lineWidth = Math.max(1, brushSize * 0.7);
      ctx.strokeStyle = color === '#000000' ? 'rgba(75, 85, 99, 0.6)' : color;
    } else if (activeTool === 'pencil_6b') {
      ctx.lineWidth = brushSize * 1.5;
      ctx.strokeStyle = color === '#000000' ? '#111827' : color;
    } else if (activeTool === 'brush') {
      ctx.lineWidth = brushSize * 2.5;
      ctx.strokeStyle = color;
    } else if (activeTool === 'eraser') {
      ctx.lineWidth = brushSize * 3.5;
      ctx.strokeStyle = '#ffffff';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  // Save to student gallery in localStorage
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundService.playCorrectAnswer();

    const dataUrl = canvas.toDataURL('image/png');
    const artwork: SavedArtwork = {
      id: 'art_' + Date.now(),
      title: artworkTitle || `${selectedSubject.name} oleh Murid`,
      date: new Date().toLocaleDateString('ms-MY'),
      dataUrl,
      subject: selectedSubject.name,
      rubricScores,
      pupilNotes: `Lukisan bertemakan ${selectedSubject.name} berpandukan punca ${selectedSubject.lightSource}.`,
    };

    storageService.addArtwork(artwork);
    setArtworkSaved(true);
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundService.playButtonClick();
    const link = document.createElement('a');
    link.download = `Teyvara_Lukisan_${selectedSubject.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleFinishMission = () => {
    if (!artworkSaved) {
      handleSaveToGallery();
    }
    soundService.playVictoryFanfare();
    onFinish(100, 100, 150);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            MISI 4 · {mission.regionName}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">{mission.title}</h1>
          <p className="text-xs text-slate-300">{mission.subtitle}</p>
        </div>

        {/* Action Save & Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Muat Turun Gambar PNG"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Muat Turun PNG</span>
          </button>

          <button
            onClick={handleSaveToGallery}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{artworkSaved ? 'Tersimpan di Galeri ✓' : 'Simpan ke Galeri'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reference Model & Subject Selector (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 pb-2 border-b border-slate-800">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Model Rujukan Pemerhatian:</span>
          </div>

          {/* Subject Selector Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    soundService.playButtonClick();
                    setSelectedSubject(sub);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-400 text-indigo-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs truncate">{sub.name}</div>
                  <div className="text-[10px] text-slate-500">{sub.category}</div>
                </button>
              );
            })}
          </div>

          {/* Active Reference Display */}
          <div className="flex flex-col items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="mb-2">{selectedSubject.svgIcon}</div>
            <div className="text-sm font-bold text-white text-center">{selectedSubject.name}</div>
            <div className="text-[11px] text-amber-300 font-medium mt-1">
              {selectedSubject.lightSource}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2 leading-relaxed">
              {selectedSubject.tips}
            </p>
          </div>

          {/* Rubric Apresiasi Kendiri */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-2">Apresiasi Kendiri (Tahun 3):</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Ketepatan Garisan</span>
                <span className="text-amber-400">{'★'.repeat(rubricScores.garisan)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Rupa & Bentuk</span>
                <span className="text-amber-400">{'★'.repeat(rubricScores.bentuk)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ton Terang / Gelap</span>
                <span className="text-amber-400">{'★'.repeat(rubricScores.ton)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Kekemasan Karya</span>
                <span className="text-amber-400">{'★'.repeat(rubricScores.kreativiti)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right: Canvas Workspace (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-3">
          {/* Studio Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
            {/* Tool Selection */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTool('pencil_hb');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'pencil_hb'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
                title="Pensel HB (Lakaran Halus)"
              >
                <Pen className="w-3.5 h-3.5" />
                <span>Pensel HB</span>
              </button>

              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTool('pencil_6b');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'pencil_6b'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
                title="Pensel 6B (Lorekan Gelap)"
              >
                <Pen className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pensel 6B</span>
              </button>

              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTool('brush');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'brush'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
                title="Pastel / Berus Warna"
              >
                <Brush className="w-3.5 h-3.5" />
                <span>Pastel / Berus</span>
              </button>

              <button
                onClick={() => {
                  soundService.playButtonClick();
                  setActiveTool('eraser');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
                title="Pemadam (Padam & Highlight)"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Pemadam</span>
              </button>
            </div>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Saiz:</span>
              <input
                type="range"
                min="1"
                max="16"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-20 md:w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="w-5 text-right font-mono text-cyan-300">{brushSize}px</span>
            </div>

            {/* Undo, Redo, Clear & Grid toggles */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  showGrid
                    ? 'bg-indigo-950 border-indigo-400 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Papar Garis Panduan Grid"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                disabled={!canUndo}
                onClick={handleUndo}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Buat Asal (Undo)"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                disabled={!canRedo}
                onClick={handleRedo}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Buat Semula (Redo)"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-red-400 hover:bg-red-950/40 cursor-pointer"
                title="Kosongkan Kanvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Palette Strip */}
          <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">Warna:</span>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  soundService.playButtonClick();
                  setColor(c);
                  if (activeTool === 'eraser') setActiveTool('pencil_hb');
                }}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full shrink-0 border-2 transition-transform cursor-pointer ${
                  color === c ? 'scale-125 border-cyan-400 ring-2 ring-cyan-400/50' : 'border-slate-700 hover:scale-110'
                }`}
                title={c}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded-full overflow-hidden shrink-0 border-0 cursor-pointer"
              title="Warna Tersuai"
            />
          </div>

          {/* Drawing Canvas Area */}
          <div className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden border-4 border-slate-700 bg-white shadow-2xl touch-none">
            {/* Optional Grid Overlay */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="w-full h-full cursor-crosshair"
            />
          </div>

          {/* Bottom Complete & Submit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-300">Tajuk Karya:</span>
              <input
                type="text"
                value={artworkTitle}
                onChange={(e) => setArtworkTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 flex-1 sm:w-64"
                placeholder="Namakan hasil karya kamu"
              />
            </div>

            <button
              onClick={handleFinishMission}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Simpan Karya & Selesaikan Misi 4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
