export type CharacterId = 'aira' | 'kael' | 'mira';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  bio: string;
  specialty: string;
  tool: string;
  quote: string;
  imagePath: string;
  colorScheme: {
    primary: string;
    glow: string;
    border: string;
  };
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'basic' | 'skilled' | 'legendary';
  topic: 'alat_media' | 'jenis_garisan' | 'rupa_bentuk' | 'teknik_lorekan' | 'langkah_lukisan' | 'apresiasi';
  visualHint?: string;
}

export interface Mission {
  id: number;
  title: string;
  regionName: string;
  subtitle: string;
  description: string;
  learningObjectives: string[];
  shardName: string;
  badgeReward: string;
  badgeDescription: string;
  accentColor: string;
}

export interface SavedArtwork {
  id: string;
  title: string;
  date: string;
  dataUrl: string;
  subject: string;
  pupilNotes?: string;
  rubricScores: {
    garisan: number;
    bentuk: number;
    ton: number;
    kreativiti: number;
  };
}

export interface PlayerProfile {
  name: string;
  schoolName: string;
  selectedCharacterId: CharacterId;
  level: number;
  xp: number;
  crystalsCount: number;
  completedMissions: number[];
  unlockedRegions: number[];
  badges: string[];
  highScores: Record<number, number>;
  savedArtworks: SavedArtwork[];
}

export type GameScreen =
  | 'TITLE_MENU'
  | 'CHAR_SELECT'
  | 'WORLD_MAP'
  | 'MISSION_PLAY'
  | 'GALLERY'
  | 'CERTIFICATE'
  | 'SETTINGS'
  | 'ABOUT';
