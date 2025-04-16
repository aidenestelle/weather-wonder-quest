
import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Achievement, Challenge } from '@/types/game';
import { WeatherData } from '@/types/weather';
import {
  loadUserProgress,
  saveUserProgress,
  loadSavedLocations,
  getSelectedLocation,
  setSelectedLocation as setStoredSelectedLocation,
  addLocation,
  removeLocation,
} from '@/utils/storage';

interface UseGameProgressReturn {
  userProgress: UserProgress;
  checkIn: () => void;
  unlockAchievement: (id: string) => void;
  completeChallenge: (id: string) => void;
  addPoints: (points: number) => void;
  setGameLocation: (locationId: string) => void;
  addGameLocation: (locationId: string) => void;
  removeGameLocation: (locationId: string) => void;
  updateWeatherAchievements: (weatherData: WeatherData) => void;
}

// Points needed for each level (increases with each level)
const getPointsForLevel = (level: number) => 100 * level;

export function useGameProgress(): UseGameProgressReturn {
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());

  // Save progress whenever it changes
  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  // Check if we need to update streak
  useEffect(() => {
    const checkStreak = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const lastCheckIn = userProgress.streak.lastCheckIn;
      
      if (lastCheckIn === 0) {
        // First check-in
        return;
      }
      
      const lastCheckDate = new Date(lastCheckIn);
      const lastCheckDay = new Date(
        lastCheckDate.getFullYear(),
        lastCheckDate.getMonth(),
        lastCheckDate.getDate()
      ).getTime();
      
      const dayDiff = Math.floor((today - lastCheckDay) / (24 * 60 * 60 * 1000));
      
      if (dayDiff > 1) {
        // Streak broken
        setUserProgress(prev => ({
          ...prev,
          streak: {
            ...prev.streak,
            current: 0,
          },
        }));
      }
    };
    
    checkStreak();
  }, []);

  // Update level if we have enough points
  useEffect(() => {
    if (userProgress.points >= userProgress.pointsToNextLevel) {
      setUserProgress(prev => ({
        ...prev,
        level: prev.level + 1,
        pointsToNextLevel: getPointsForLevel(prev.level + 1),
      }));
    }
  }, [userProgress.points, userProgress.level, userProgress.pointsToNextLevel]);

  // Daily check-in to update streak
  const checkIn = useCallback(() => {
    const now = Date.now();
    const lastCheckIn = userProgress.streak.lastCheckIn;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If already checked in today, don't update streak
    if (lastCheckIn >= today.getTime()) {
      return;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1; // Default to 1 for a new streak
    
    // Check if checked in yesterday to continue streak
    if (lastCheckIn >= yesterday.getTime() && lastCheckIn < today.getTime()) {
      newStreak = userProgress.streak.current + 1;
    }
    
    // Update streak data
    setUserProgress(prev => {
      const updatedStreak = {
        current: newStreak,
        longest: Math.max(newStreak, prev.streak.longest),
        lastCheckIn: now,
      };
      
      // Check for streak achievements
      const updatedAchievements = [...prev.achievements];
      
      // 3-day streak achievement
      if (newStreak >= 3) {
        const threeDayStreakAchievement = updatedAchievements.find(a => a.id === 'three-day-streak');
        if (threeDayStreakAchievement && !threeDayStreakAchievement.unlocked) {
          threeDayStreakAchievement.unlocked = true;
          threeDayStreakAchievement.unlockedAt = now;
          threeDayStreakAchievement.progress = 3;
        }
      }
      
      // 7-day streak achievement
      if (newStreak >= 7) {
        const sevenDayStreakAchievement = updatedAchievements.find(a => a.id === 'seven-day-streak');
        if (sevenDayStreakAchievement && !sevenDayStreakAchievement.unlocked) {
          sevenDayStreakAchievement.unlocked = true;
          sevenDayStreakAchievement.unlockedAt = now;
          sevenDayStreakAchievement.progress = 7;
        }
      }
      
      // Update daily-check challenge
      const updatedChallenges = [...prev.challenges];
      const dailyCheckChallenge = updatedChallenges.find(c => c.id === 'daily-check');
      if (dailyCheckChallenge && !dailyCheckChallenge.completed) {
        dailyCheckChallenge.completed = true;
        dailyCheckChallenge.completedAt = now;
        dailyCheckChallenge.progress = 1;
      }
      
      // First check achievement
      const firstCheckAchievement = updatedAchievements.find(a => a.id === 'first-check');
      if (firstCheckAchievement && !firstCheckAchievement.unlocked) {
        firstCheckAchievement.unlocked = true;
        firstCheckAchievement.unlockedAt = now;
      }
      
      return {
        ...prev,
        streak: updatedStreak,
        achievements: updatedAchievements,
        challenges: updatedChallenges,
        points: prev.points + 5, // 5 points for checking in
      };
    });
  }, [userProgress.streak]);

  // Unlock an achievement
  const unlockAchievement = useCallback((id: string) => {
    setUserProgress(prev => {
      const achievement = prev.achievements.find(a => a.id === id);
      if (!achievement || achievement.unlocked) {
        return prev; // Already unlocked or doesn't exist
      }
      
      const updatedAchievements = prev.achievements.map(a =>
        a.id === id
          ? { ...a, unlocked: true, unlockedAt: Date.now() }
          : a
      );
      
      return {
        ...prev,
        achievements: updatedAchievements,
        points: prev.points + achievement.points,
      };
    });
  }, []);

  // Complete a challenge
  const completeChallenge = useCallback((id: string) => {
    setUserProgress(prev => {
      const challenge = prev.challenges.find(c => c.id === id);
      if (!challenge || challenge.completed) {
        return prev; // Already completed or doesn't exist
      }
      
      const updatedChallenges = prev.challenges.map(c =>
        c.id === id
          ? { 
              ...c, 
              completed: true, 
              completedAt: Date.now(),
              progress: c.maxProgress,
            }
          : c
      );
      
      // Check for perfect week achievement
      const completedDailyChallenges = updatedChallenges.filter(
        c => c.type === 'daily' && c.completed
      ).length;
      
      const updatedAchievements = [...prev.achievements];
      const perfectWeekAchievement = updatedAchievements.find(a => a.id === 'perfect-week');
      
      if (perfectWeekAchievement) {
        perfectWeekAchievement.progress = completedDailyChallenges;
        
        if (completedDailyChallenges >= 7 && !perfectWeekAchievement.unlocked) {
          perfectWeekAchievement.unlocked = true;
          perfectWeekAchievement.unlockedAt = Date.now();
        }
      }
      
      return {
        ...prev,
        challenges: updatedChallenges,
        achievements: updatedAchievements,
        points: prev.points + challenge.points,
      };
    });
  }, []);

  // Add points
  const addPoints = useCallback((points: number) => {
    setUserProgress(prev => ({
      ...prev,
      points: prev.points + points,
    }));
  }, []);

  // Set current location
  const setGameLocation = useCallback((locationId: string) => {
    setStoredSelectedLocation(locationId);
    setUserProgress(prev => ({
      ...prev,
      selectedLocation: locationId,
    }));
  }, []);

  // Add a new location
  const addGameLocation = useCallback((locationId: string) => {
    setUserProgress(prev => {
      // Check if location already exists
      if (prev.locations.includes(locationId)) {
        return prev;
      }
      
      const updatedLocations = [...prev.locations, locationId];
      
      // Check for locations achievement
      const updatedAchievements = [...prev.achievements];
      const locationsAchievement = updatedAchievements.find(a => a.id === 'five-locations');
      
      if (locationsAchievement) {
        locationsAchievement.progress = updatedLocations.length;
        
        if (updatedLocations.length >= 5 && !locationsAchievement.unlocked) {
          locationsAchievement.unlocked = true;
          locationsAchievement.unlockedAt = Date.now();
        }
      }
      
      // Update save-location challenge
      const updatedChallenges = [...prev.challenges];
      const saveLocationChallenge = updatedChallenges.find(c => c.id === 'save-location');
      
      if (saveLocationChallenge && !saveLocationChallenge.completed) {
        saveLocationChallenge.completed = true;
        saveLocationChallenge.completedAt = Date.now();
        saveLocationChallenge.progress = 1;
      }
      
      return {
        ...prev,
        locations: updatedLocations,
        achievements: updatedAchievements,
        challenges: updatedChallenges,
      };
    });
  }, []);

  // Remove a location
  const removeGameLocation = useCallback((locationId: string) => {
    setUserProgress(prev => ({
      ...prev,
      locations: prev.locations.filter(id => id !== locationId),
    }));
  }, []);

  // Update weather-based achievements
  const updateWeatherAchievements = useCallback((weatherData: WeatherData) => {
    if (!weatherData || !weatherData.current) {
      return;
    }
    
    setUserProgress(prev => {
      const now = Date.now();
      const updatedAchievements = [...prev.achievements];
      const weatherMain = weatherData.current.main.toLowerCase();
      
      // Weather condition achievements
      if (weatherMain.includes('rain')) {
        const rainyAchievement = updatedAchievements.find(a => a.id === 'rainy-day');
        if (rainyAchievement && !rainyAchievement.unlocked) {
          rainyAchievement.unlocked = true;
          rainyAchievement.unlockedAt = now;
        }
        
        // Check rain challenge
        const updatedChallenges = [...prev.challenges];
        const rainChallenge = updatedChallenges.find(
          c => c.id === 'rainy-challenge' && !c.completed
        );
        
        if (rainChallenge) {
          rainChallenge.completed = true;
          rainChallenge.completedAt = now;
          rainChallenge.progress = 1;
          
          return {
            ...prev,
            achievements: updatedAchievements,
            challenges: updatedChallenges,
            points: prev.points + (rainyAchievement && !rainyAchievement.unlocked ? rainyAchievement.points : 0) + 
                    (rainChallenge ? rainChallenge.points : 0),
          };
        }
      } else if (weatherMain.includes('clear')) {
        const sunnyAchievement = updatedAchievements.find(a => a.id === 'sunny-day');
        if (sunnyAchievement && !sunnyAchievement.unlocked) {
          sunnyAchievement.unlocked = true;
          sunnyAchievement.unlockedAt = now;
          
          return {
            ...prev,
            achievements: updatedAchievements,
            points: prev.points + sunnyAchievement.points,
          };
        }
      } else if (weatherMain.includes('snow')) {
        const snowyAchievement = updatedAchievements.find(a => a.id === 'snowy-day');
        if (snowyAchievement && !snowyAchievement.unlocked) {
          snowyAchievement.unlocked = true;
          snowyAchievement.unlockedAt = now;
          
          return {
            ...prev,
            achievements: updatedAchievements,
            points: prev.points + snowyAchievement.points,
          };
        }
      } else if (weatherMain.includes('thunderstorm')) {
        const stormyAchievement = updatedAchievements.find(a => a.id === 'stormy-day');
        if (stormyAchievement && !stormyAchievement.unlocked) {
          stormyAchievement.unlocked = true;
          stormyAchievement.unlockedAt = now;
          
          return {
            ...prev,
            achievements: updatedAchievements,
            points: prev.points + stormyAchievement.points,
          };
        }
      }
      
      // Update forecast challenge
      const updatedChallenges = [...prev.challenges];
      const forecastChallenge = updatedChallenges.find(
        c => c.id === 'check-forecast' && !c.completed
      );
      
      if (forecastChallenge) {
        forecastChallenge.completed = true;
        forecastChallenge.completedAt = now;
        forecastChallenge.progress = 1;
        
        return {
          ...prev,
          achievements: updatedAchievements,
          challenges: updatedChallenges,
          points: prev.points + forecastChallenge.points,
        };
      }
      
      return {
        ...prev,
        achievements: updatedAchievements,
      };
    });
  }, []);

  return {
    userProgress,
    checkIn,
    unlockAchievement,
    completeChallenge,
    addPoints,
    setGameLocation,
    addGameLocation,
    removeGameLocation,
    updateWeatherAchievements,
  };
}
