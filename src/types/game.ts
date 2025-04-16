
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'weather';
  weatherCondition?: string;
  points: number;
  completed: boolean;
  completedAt?: number;
  progress: number;
  maxProgress: number;
  expiresAt?: number;
}

export interface UserProgress {
  level: number;
  points: number;
  pointsToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastCheckIn: number;
  };
  achievements: Achievement[];
  challenges: Challenge[];
  locations: string[];
  selectedLocation: string;
  avatarStyle: {
    color: string;
    accessory: string;
    background: string;
  };
}
