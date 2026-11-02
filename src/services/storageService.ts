import { PlayerProfile, CharacterId, SavedArtwork } from '../types/game';

const STORAGE_KEY = 'teyvara_player_profile_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Pengembara Cilik',
  schoolName: 'SK Teyvara Indah',
  selectedCharacterId: 'aira',
  level: 1,
  xp: 0,
  crystalsCount: 0,
  completedMissions: [],
  unlockedRegions: [1], // Mission 1 is unlocked initially
  badges: [],
  highScores: {},
  savedArtworks: [],
};

export const storageService = {
  loadProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          // Ensure unlocked regions always at least contains [1]
          unlockedRegions: parsed.unlockedRegions?.length ? parsed.unlockedRegions : [1],
        };
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: PlayerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  },

  resetProfile(): PlayerProfile {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  },

  addArtwork(artwork: SavedArtwork): PlayerProfile {
    const profile = this.loadProfile();
    profile.savedArtworks = [artwork, ...(profile.savedArtworks || [])];
    this.saveProfile(profile);
    return profile;
  },

  updateCharacter(charId: CharacterId): PlayerProfile {
    const profile = this.loadProfile();
    profile.selectedCharacterId = charId;
    this.saveProfile(profile);
    return profile;
  },

  completeMission(missionId: number, score: number, xpGained: number, shardReward: string, badgeReward: string): PlayerProfile {
    const profile = this.loadProfile();

    if (!profile.completedMissions.includes(missionId)) {
      profile.completedMissions.push(missionId);
      profile.crystalsCount = Math.min(5, profile.crystalsCount + 1);
    }

    // Unlock next region if available (1 -> 2, 2 -> 3, etc.)
    const nextMissionId = missionId + 1;
    if (nextMissionId <= 5 && !profile.unlockedRegions.includes(nextMissionId)) {
      profile.unlockedRegions.push(nextMissionId);
    }

    if (badgeReward && !profile.badges.includes(badgeReward)) {
      profile.badges.push(badgeReward);
    }

    profile.xp += xpGained;
    // Calculate level (100 XP per level, max level 5)
    profile.level = Math.min(5, 1 + Math.floor(profile.xp / 150));

    const currentHigh = profile.highScores[missionId] || 0;
    if (score > currentHigh) {
      profile.highScores[missionId] = score;
    }

    this.saveProfile(profile);
    return profile;
  },
};
