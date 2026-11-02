import React, { useState, useEffect } from 'react';
import { PlayerProfile, CharacterId, Character, GameScreen, Mission } from './types/game';
import { CHARACTERS } from './data/characters';
import { MISSIONS } from './data/missions';
import { storageService, DEFAULT_PROFILE } from './services/storageService';
import { soundService } from './services/soundService';

import { TopGameHUD } from './components/TopGameHUD';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { WorldMap } from './components/WorldMap';
import { DialogueModal, DialogueLine } from './components/DialogueModal';
import { MissionResultModal } from './components/MissionResultModal';
import { StudentGallery } from './components/StudentGallery';
import { CertificateModal } from './components/CertificateModal';
import { SettingsModal } from './components/SettingsModal';

import { Mission1Tools } from './components/missions/Mission1Tools';
import { Mission2Lines } from './components/missions/Mission2Lines';
import { Mission3Sketch } from './components/missions/Mission3Sketch';
import { Mission4Observation } from './components/missions/Mission4Observation';
import { Mission5Crystal } from './components/missions/Mission5Crystal';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => storageService.loadProfile());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('TITLE_MENU');
  const [activeMissionId, setActiveMissionId] = useState<number>(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active Character
  const activeCharacter =
    CHARACTERS.find((c) => c.id === profile.selectedCharacterId) || CHARACTERS[0];
  const activeMission = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  // Dialogue sequence state
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentDialogues, setCurrentDialogues] = useState<DialogueLine[]>([]);

  // Mission Results Modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [latestResult, setLatestResult] = useState<{
    score: number;
    maxScore: number;
    xpGained: number;
  }>({ score: 100, maxScore: 100, xpGained: 100 });

  // Update profile in state and localStorage
  const handleUpdateProfile = (updated: PlayerProfile) => {
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleSelectCharacter = (charId: CharacterId) => {
    const updated = storageService.updateCharacter(charId);
    setProfile(updated);
  };

  const handleUpdateProfileName = (newName: string, newSchool: string) => {
    const updated = { ...profile, name: newName, schoolName: newSchool };
    handleUpdateProfile(updated);
  };

  const handleResetProgress = () => {
    const reset = storageService.resetProfile();
    setProfile(reset);
    setCurrentScreen('TITLE_MENU');
  };

  // Launch a Mission: load briefing dialogue first
  const handleStartMission = (missionId: number) => {
    setActiveMissionId(missionId);
    const mission = MISSIONS.find((m) => m.id === missionId) || MISSIONS[0];

    // Build RPG briefing dialogue tailored to the mission and character
    const dialogues: DialogueLine[] = [
      {
        speakerName: 'Mentor Mira',
        portraitPath: '/src/assets/images/character_mira_1793628368249.jpg',
        text: `Selamat datang ke ${mission.regionName}! Misi kita kali ini bertajuk "${mission.title}". ${mission.description}`,
      },
      {
        speakerName: activeCharacter.name,
        portraitPath: activeCharacter.imagePath,
        text: `Saya faham, Mentor Mira! Mari kita pelajari objektif seni ini bersama dan pulihkan ${mission.shardName}.`,
      },
      {
        speakerName: 'Mentor Mira',
        portraitPath: '/src/assets/images/character_mira_1793628368249.jpg',
        text: `Ingat petua penting PSV Tahun 3: sentiasa teliti dan jangan terburu-buru. Kejayaan ada dalam setiap usaha kamu!`,
      },
    ];

    setCurrentDialogues(dialogues);
    setShowDialogue(true);
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    setCurrentScreen('MISSION_PLAY');
  };

  // Mission Completion Handler
  const handleMissionFinish = (score: number, maxScore: number, xp: number) => {
    setLatestResult({ score, maxScore, xpGained: xp });
    const updated = storageService.completeMission(
      activeMission.id,
      score,
      xp,
      activeMission.shardName,
      activeMission.badgeReward
    );
    setProfile(updated);
    setShowResultModal(true);
  };

  const handleNextMissionFromModal = () => {
    setShowResultModal(false);
    if (activeMissionId < 5) {
      handleStartMission(activeMissionId + 1);
    } else {
      setCurrentScreen('CERTIFICATE');
    }
  };

  const handleRetryMissionFromModal = () => {
    setShowResultModal(false);
    setCurrentScreen('MISSION_PLAY');
  };

  const handleReturnToMapFromModal = () => {
    setShowResultModal(false);
    setCurrentScreen('WORLD_MAP');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-game select-none">
      {/* Top HUD (Rendered when not on Title Screen, or as top banner) */}
      <TopGameHUD
        profile={profile}
        activeCharacter={activeCharacter}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Screen Body Viewport */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'TITLE_MENU' && (
          <TitleScreen
            profile={profile}
            activeCharacter={activeCharacter}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAbout={() => setIsSettingsOpen(true)}
          />
        )}

        {currentScreen === 'CHAR_SELECT' && (
          <CharacterSelect
            profile={profile}
            onSelectCharacter={handleSelectCharacter}
            onBack={() => setCurrentScreen('TITLE_MENU')}
            onConfirm={() => setCurrentScreen('WORLD_MAP')}
          />
        )}

        {currentScreen === 'WORLD_MAP' && (
          <WorldMap
            profile={profile}
            activeCharacter={activeCharacter}
            onStartMission={handleStartMission}
            onOpenCertificate={() => setCurrentScreen('CERTIFICATE')}
          />
        )}

        {currentScreen === 'MISSION_PLAY' && (
          <div className="flex-1">
            {activeMissionId === 1 && (
              <Mission1Tools
                mission={activeMission}
                activeCharacter={activeCharacter}
                onFinish={handleMissionFinish}
                onExit={() => setCurrentScreen('WORLD_MAP')}
              />
            )}
            {activeMissionId === 2 && (
              <Mission2Lines
                mission={activeMission}
                activeCharacter={activeCharacter}
                onFinish={handleMissionFinish}
                onExit={() => setCurrentScreen('WORLD_MAP')}
              />
            )}
            {activeMissionId === 3 && (
              <Mission3Sketch
                mission={activeMission}
                activeCharacter={activeCharacter}
                onFinish={handleMissionFinish}
                onExit={() => setCurrentScreen('WORLD_MAP')}
              />
            )}
            {activeMissionId === 4 && (
              <Mission4Observation
                mission={activeMission}
                activeCharacter={activeCharacter}
                onFinish={handleMissionFinish}
                onExit={() => setCurrentScreen('WORLD_MAP')}
              />
            )}
            {activeMissionId === 5 && (
              <Mission5Crystal
                mission={activeMission}
                activeCharacter={activeCharacter}
                onFinish={handleMissionFinish}
                onExit={() => setCurrentScreen('WORLD_MAP')}
              />
            )}
          </div>
        )}

        {currentScreen === 'GALLERY' && (
          <StudentGallery
            profile={profile}
            onBack={() => setCurrentScreen('WORLD_MAP')}
            onStartDrawing={() => {
              setActiveMissionId(4);
              setCurrentScreen('MISSION_PLAY');
            }}
          />
        )}

        {currentScreen === 'CERTIFICATE' && (
          <CertificateModal
            profile={profile}
            activeCharacter={activeCharacter}
            onBack={() => setCurrentScreen('WORLD_MAP')}
            onUpdateProfileName={handleUpdateProfileName}
          />
        )}
      </main>

      {/* RPG Dialogue Overlay Box */}
      {showDialogue && (
        <DialogueModal
          dialogues={currentDialogues}
          onComplete={handleDialogueComplete}
          onSkip={handleDialogueComplete}
        />
      )}

      {/* Post-Mission Result Modal */}
      {showResultModal && (
        <MissionResultModal
          mission={activeMission}
          score={latestResult.score}
          maxScore={latestResult.maxScore}
          xpGained={latestResult.xpGained}
          activeCharacter={activeCharacter}
          onRetry={handleRetryMissionFromModal}
          onNextMission={handleNextMissionFromModal}
          onReturnToMap={handleReturnToMapFromModal}
        />
      )}

      {/* Settings & Curriculum Help Modal */}
      <SettingsModal
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
