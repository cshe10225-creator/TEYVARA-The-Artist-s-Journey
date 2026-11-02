import React, { useState } from 'react';
import { Lock, CheckCircle2, Sparkles, Award, Play, ChevronRight, Compass, Info } from 'lucide-react';
import { Mission, PlayerProfile, Character } from '../types/game';
import { MISSIONS } from '../data/missions';
import { soundService } from '../services/soundService';

interface WorldMapProps {
  profile: PlayerProfile;
  activeCharacter: Character;
  onStartMission: (missionId: number) => void;
  onOpenCertificate: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  profile,
  activeCharacter,
  onStartMission,
  onOpenCertificate,
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<number>(() => {
    // Select first unlocked and incomplete mission, or mission 1
    const firstIncomplete = MISSIONS.find(
      (m) => profile.unlockedRegions.includes(m.id) && !profile.completedMissions.includes(m.id)
    );
    return firstIncomplete ? firstIncomplete.id : 1;
  });

  const selectedMission = MISSIONS.find((m) => m.id === selectedMissionId) || MISSIONS[0];
  const isSelectedUnlocked = profile.unlockedRegions.includes(selectedMission.id);
  const isSelectedCompleted = profile.completedMissions.includes(selectedMission.id);

  // Coordinates for the 5 regions on the interactive map (percentage x, y)
  const regionCoords = [
    { id: 1, x: 18, y: 72 },
    { id: 2, x: 38, y: 38 },
    { id: 3, x: 55, y: 70 },
    { id: 4, x: 74, y: 44 },
    { id: 5, x: 88, y: 22 },
  ];

  const handleNodeClick = (id: number) => {
    soundService.playButtonClick();
    setSelectedMissionId(id);
  };

  const handleLaunchMission = () => {
    if (!isSelectedUnlocked) {
      soundService.playWrongSound();
      return;
    }
    soundService.playButtonClick();
    onStartMission(selectedMission.id);
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] max-w-7xl mx-auto p-4 md:p-6 flex flex-col justify-between">
      {/* Realm Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shadow-md">
            <img
              src={activeCharacter.imagePath}
              alt={activeCharacter.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Peta Pengembaraan Dunia</div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>ALAM FANTASI TEYVARA</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Tahun 3
              </span>
            </h1>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-center">
            <div className="text-slate-400 font-medium">Kemajuan Misi</div>
            <div className="text-base font-extrabold text-cyan-400 tabular-nums">
              {profile.completedMissions.length} / 5
            </div>
          </div>

          <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl px-3 py-2 text-center">
            <div className="text-slate-400 font-medium">Serpihan Kristal</div>
            <div className="text-base font-extrabold text-amber-300 tabular-nums">
              {profile.crystalsCount} / 5
            </div>
          </div>

          {profile.crystalsCount >= 5 && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold hover:brightness-110 shadow-md shadow-amber-400/30 transition-all cursor-pointer animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>Sijil Agung</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map & Side Mission Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-stretch">
        {/* Left: The Map Canvas / Graphic Viewport (8 Cols) */}
        <div className="lg:col-span-8 relative aspect-[16/10] min-h-[380px] rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-950">
          {/* Map Art Background */}
          <img
            src="/src/assets/images/teyvara_world_landscape_1793628365981.jpg"
            alt="Peta Teyvara"
            className="w-full h-full object-cover filter brightness-[0.75] contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* SVG Connecting Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points="18%,72% 38%,38% 55%,70% 74%,44% 88%,22%"
              fill="none"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* 5 Region Nodes Placed On Map */}
          {MISSIONS.map((mission) => {
            const coord = regionCoords.find((c) => c.id === mission.id) || { x: 50, y: 50 };
            const isUnlocked = profile.unlockedRegions.includes(mission.id);
            const isCompleted = profile.completedMissions.includes(mission.id);
            const isSelected = selectedMissionId === mission.id;

            return (
              <div
                key={mission.id}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => handleNodeClick(mission.id)}
                  className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                >
                  {/* Glowing Node Circle */}
                  <div
                    className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${
                      isSelected
                        ? 'bg-cyan-400 border-white text-slate-950 ring-4 ring-cyan-400/50 shadow-cyan-400/60'
                        : isCompleted
                        ? 'bg-emerald-600/90 border-emerald-300 text-white shadow-emerald-500/40'
                        : isUnlocked
                        ? 'bg-slate-900/90 border-cyan-400 text-cyan-300 hover:border-white shadow-cyan-500/30'
                        : 'bg-slate-950/80 border-slate-700 text-slate-500 opacity-70'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white stroke-[2.5]" />
                    ) : isUnlocked ? (
                      <Sparkles className="w-5 h-5 text-current animate-pulse" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  {/* Node Label Below */}
                  <div
                    className={`mt-1.5 px-2.5 py-0.5 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap shadow-md backdrop-blur-md transition-colors ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 border border-white'
                        : isCompleted
                        ? 'bg-slate-900/90 text-emerald-300 border border-emerald-500/40'
                        : isUnlocked
                        ? 'bg-slate-900/90 text-slate-200 border border-cyan-500/30'
                        : 'bg-slate-950/90 text-slate-500 border border-slate-800'
                    }`}
                  >
                    Misi {mission.id}: {mission.regionName}
                  </div>
                </button>
              </div>
            );
          })}

          {/* Map Compass Rose Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-cyan-300 backdrop-blur-md">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '24s' }} />
            <span>Peta Teyvara</span>
          </div>
        </div>

        {/* Right: Selected Mission Detail Drawer / Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900/90 border-2 border-slate-700/90 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
          <div>
            {/* Header / Subtitle */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                MISI {selectedMission.id} · {selectedMission.regionName}
              </span>
              {isSelectedCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Selesai
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
              {selectedMission.title}
            </h2>
            <p className="text-xs font-medium text-amber-300 mb-3">{selectedMission.subtitle}</p>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedMission.description}</p>

            {/* Learning Objectives List (DSKP PSV Tahun 3) */}
            <div className="mb-4 bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Objektif Pembelajaran (PSV Tahun 3):</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300 leading-normal">
                {selectedMission.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold shrink-0">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rewards info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20">
                <div className="text-slate-400 font-medium">Ganjaran Kristal:</div>
                <div className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{selectedMission.shardName}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <div className="text-slate-400 font-medium">Lencana:</div>
                <div className="font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>{selectedMission.badgeReward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {isSelectedUnlocked ? (
              <button
                onClick={handleLaunchMission}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSelectedCompleted ? 'Main Semula Misi' : 'Mulakan Misi ' + selectedMission.id}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center gap-2 text-center">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Selesaikan Misi {selectedMission.id - 1} untuk Membuka Kawasan Ini</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation Tip */}
      <div className="text-center text-xs text-slate-400 font-medium">
        Klik mana-mana titik pada peta untuk menyemak tugasan dan mulakan pengembaraan seni kamu!
      </div>
    </div>
  );
};
