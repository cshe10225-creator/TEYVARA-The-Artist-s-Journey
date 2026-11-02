import React, { useState } from 'react';
import { ArrowLeft, Download, Trash2, Calendar, Star, Sparkles, PenTool, Image as ImageIcon } from 'lucide-react';
import { PlayerProfile, SavedArtwork } from '../types/game';
import { soundService } from '../services/soundService';

interface StudentGalleryProps {
  profile: PlayerProfile;
  onBack: () => void;
  onStartDrawing: () => void;
}

export const StudentGallery: React.FC<StudentGalleryProps> = ({
  profile,
  onBack,
  onStartDrawing,
}) => {
  const [artworks, setArtworks] = useState<SavedArtwork[]>(profile.savedArtworks || []);
  const [selectedArt, setSelectedArt] = useState<SavedArtwork | null>(artworks[0] || null);

  const handleDownload = (art: SavedArtwork) => {
    soundService.playButtonClick();
    const link = document.createElement('a');
    link.download = `${art.title.replace(/\s+/g, '_')}.png`;
    link.href = art.dataUrl;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in min-h-[calc(100vh-56px)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20 mb-6">
        <div>
          <button
            onClick={() => {
              soundService.playButtonClick();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Peta</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <span>Galeri Karya Seni Murid</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-300">
            Koleksi lukisan yang dihasilkan oleh {profile.name} sepanjang pengembaraan di Teyvara.
          </p>
        </div>

        <button
          onClick={() => {
            soundService.playButtonClick();
            onStartDrawing();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer shadow-md shadow-cyan-400/30"
        >
          <PenTool className="w-4 h-4" />
          <span>Buka Kanvas Lukisan Baru</span>
        </button>
      </div>

      {artworks.length === 0 ? (
        /* Empty State */
        <div className="my-auto py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <ImageIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Galeri Masih Kosong</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Kamu belum menyimpan sebarang hasil lukisan. Masuk ke Misi 4 (Lembah Pemerhati) untuk mula melukis objek mengikut pemerhatian dan menyimpannya di sini!
          </p>
          <button
            onClick={onStartDrawing}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
          >
            Mulakan Lukisan Sekarang
          </button>
        </div>
      ) : (
        /* Gallery Grid & Showcase */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Thumbnail list (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {artworks.map((art) => {
              const isSelected = selectedArt?.id === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => {
                    soundService.playButtonClick();
                    setSelectedArt(art);
                  }}
                  className={`flex flex-col p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-400/20'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white mb-2 border border-slate-700">
                    <img src={art.dataUrl} alt={art.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs font-bold text-white truncate">{art.title}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{art.date}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Artwork Viewport (7 cols) */}
          {selectedArt && (
            <div className="lg:col-span-7 bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedArt.title}</h2>
                    <span className="text-xs text-cyan-300 font-medium">Model: {selectedArt.subject}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedArt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Muat Turun</span>
                  </button>
                </div>

                {/* Big Preview Frame */}
                <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-white border-4 border-slate-800 p-2 shadow-inner mb-4 flex items-center justify-center">
                  <img
                    src={selectedArt.dataUrl}
                    alt={selectedArt.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Rubric scores */}
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-3">
                  <div className="text-xs font-bold text-amber-300 mb-2">Penilaian Apresiasi Kendiri:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <div className="bg-slate-900 p-2 rounded-xl text-center border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Garisan</div>
                      <div className="text-amber-400 font-bold">
                        {'★'.repeat(selectedArt.rubricScores?.garisan || 4)}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl text-center border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Bentuk 3D</div>
                      <div className="text-amber-400 font-bold">
                        {'★'.repeat(selectedArt.rubricScores?.bentuk || 4)}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl text-center border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Ton Lorekan</div>
                      <div className="text-amber-400 font-bold">
                        {'★'.repeat(selectedArt.rubricScores?.ton || 3)}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl text-center border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Kekemasan</div>
                      <div className="text-amber-400 font-bold">
                        {'★'.repeat(selectedArt.rubricScores?.kreativiti || 4)}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedArt.pupilNotes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                    "{selectedArt.pupilNotes}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Note */}
      <div className="pt-4 text-center text-xs text-slate-400">
        Hasil karya disimpan secara setempat pada pelayar peranti ini.
      </div>
    </div>
  );
};
