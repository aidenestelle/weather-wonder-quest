
import { Challenge, UserProgress } from '@/types/game';
import { WeatherLocation } from '@/types/weather';

const STORAGE_KEYS = {
  USER_PROGRESS: 'weather-wonder-user-progress',
  SAVED_LOCATIONS: 'weather-wonder-saved-locations',
  SELECTED_LOCATION: 'weather-wonder-selected-location',
};

// Default achievements list
const defaultAchievements = [
  {
    id: 'first-check',
    title: 'Weather Novice',
    description: 'Check the weather for the first time',
    icon: 'award',
    condition: 'Check weather once',
    points: 10,
    unlocked: false,
  },
  {
    id: 'three-day-streak',
    title: 'Consistent Observer',
    description: 'Check the weather for 3 days in a row',
    icon: 'calendar-check',
    condition: '3-day streak',
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'seven-day-streak',
    title: 'Weather Enthusiast',
    description: 'Check the weather for 7 days in a row',
    icon: 'calendar-check',
    condition: '7-day streak',
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'all-seasons',
    title: 'Season Tracker',
    description: 'Experience all four weather seasons',
    icon: 'sun',
    condition: 'Experience all seasons',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 4,
  },
  {
    id: 'rainy-day',
    title: 'Rain Watcher',
    description: 'Check the weather on a rainy day',
    icon: 'cloud-rain',
    condition: 'Rain',
    points: 15,
    unlocked: false,
  },
  {
    id: 'sunny-day',
    title: 'Sun Seeker',
    description: 'Check the weather on a sunny day',
    icon: 'sun',
    condition: 'Clear sky',
    points: 15,
    unlocked: false,
  },
  {
    id: 'snowy-day',
    title: 'Snow Observer',
    description: 'Check the weather on a snowy day',
    icon: 'cloud-snow',
    condition: 'Snow',
    points: 15,
    unlocked: false,
  },
  {
    id: 'stormy-day',
    title: 'Storm Chaser',
    description: 'Check the weather during a thunderstorm',
    icon: 'cloud-lightning',
    condition: 'Thunderstorm',
    points: 25,
    unlocked: false,
  },
  {
    id: 'five-locations',
    title: 'Globe Trotter',
    description: 'Save 5 different locations',
    icon: 'map-pin',
    condition: '5 locations',
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all daily challenges for a week',
    icon: 'trophy',
    condition: '7 daily challenges',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
];

// Default challenges list - these will be regenerated daily/weekly
const defaultChallenges: Challenge[] = [
  {
    id: 'daily-check',
    title: 'Daily Observer',
    description: 'Check today\'s weather',
    icon: 'calendar',
    type: 'daily',
    points: 5,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: getEndOfDay(),
  },
  {
    id: 'save-location',
    title: 'Location Hunter',
    description: 'Save a new location',
    icon: 'map-pin',
    type: 'daily',
    points: 10,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: getEndOfDay(),
  },
  {
    id: 'check-forecast',
    title: 'Future Planner',
    description: 'Check the 5-day forecast',
    icon: 'calendar-days',
    type: 'daily',
    points: 5,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: getEndOfDay(),
  },
  {
    id: 'rainy-challenge',
    title: 'Rain Tracker',
    description: 'Find a location with rain in the forecast',
    icon: 'cloud-rain',
    type: 'weather',
    weatherCondition: 'Rain',
    points: 15,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: getEndOfWeek(),
  },
  {
    id: 'temp-contrast',
    title: 'Temperature Explorer',
    description: 'Find locations with a 10°C temperature difference',
    icon: 'thermometer',
    type: 'weekly',
    points: 20,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: getEndOfWeek(),
  },
];

// Default user progress
const defaultUserProgress: UserProgress = {
  level: 1,
  points: 0,
  pointsToNextLevel: 100,
  streak: {
    current: 0,
    longest: 0,
    lastCheckIn: 0,
  },
  achievements: defaultAchievements,
  challenges: defaultChallenges,
  locations: [],
  selectedLocation: '',
  avatarStyle: {
    color: 'blue',
    accessory: 'none',
    background: 'sky',
  },
};

// Default New York location
const defaultLocation: WeatherLocation = {
  id: 'default-new-york',
  name: 'New York',
  lat: 40.7128,
  lon: -74.006,
  country: 'US',
};

// Helper functions
function getEndOfDay() {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return endOfDay.getTime();
}

function getEndOfWeek() {
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek.getTime();
}

// Load user progress
export function loadUserProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Reset expired challenges
      const now = Date.now();
      parsed.challenges = parsed.challenges.filter((challenge: Challenge) => 
        !challenge.expiresAt || challenge.expiresAt > now
      );
      
      // Ensure we have some challenges
      if (parsed.challenges.length < 3) {
        parsed.challenges = [...parsed.challenges, ...defaultChallenges.slice(0, 3)];
      }
      
      return parsed as UserProgress;
    }
  } catch (error) {
    console.error('Error loading user progress:', error);
  }
  return { ...defaultUserProgress };
}

// Save user progress
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

// Load saved locations
export function loadSavedLocations(): WeatherLocation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading saved locations:', error);
  }
  return [defaultLocation];
}

// Save locations
export function saveLocations(locations: WeatherLocation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
  } catch (error) {
    console.error('Error saving locations:', error);
  }
}

// Get selected location
export function getSelectedLocation(): WeatherLocation | null {
  try {
    const locations = loadSavedLocations();
    if (locations.length === 0) {
      return defaultLocation;
    }
    
    const selectedId = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
    if (selectedId) {
      const selected = locations.find(loc => loc.id === selectedId);
      if (selected) {
        return selected;
      }
    }
    
    return locations[0];
  } catch (error) {
    console.error('Error getting selected location:', error);
    return defaultLocation;
  }
}

// Set selected location
export function setSelectedLocation(locationId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, locationId);
  } catch (error) {
    console.error('Error setting selected location:', error);
  }
}

// Add a new location
export function addLocation(location: WeatherLocation): WeatherLocation[] {
  try {
    const locations = loadSavedLocations();
    
    // Check if location already exists
    if (!locations.some(loc => loc.id === location.id)) {
      locations.push(location);
      saveLocations(locations);
    }
    
    return locations;
  } catch (error) {
    console.error('Error adding location:', error);
    return [defaultLocation];
  }
}

// Remove a location
export function removeLocation(locationId: string): WeatherLocation[] {
  try {
    let locations = loadSavedLocations();
    
    // Filter out the location to remove
    locations = locations.filter(loc => loc.id !== locationId);
    
    // If we removed the selected location, select the first available
    const selected = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
    if (selected === locationId && locations.length > 0) {
      setSelectedLocation(locations[0].id);
    }
    
    saveLocations(locations);
    return locations;
  } catch (error) {
    console.error('Error removing location:', error);
    return [defaultLocation];
  }
}
