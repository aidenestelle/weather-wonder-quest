
import React, { useEffect, useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useGameProgress } from '@/hooks/useGameProgress';
import { getSelectedLocation, loadSavedLocations, addLocation } from '@/utils/storage';
import { WeatherLocation } from '@/types/weather';

import CurrentWeather from '@/components/CurrentWeather';
import WeatherForecast from '@/components/WeatherForecast';
import StreakCounter from '@/components/StreakCounter';
import Achievements from '@/components/Achievements';
import WeatherChallenges from '@/components/WeatherChallenges';
import LocationManager from '@/components/LocationManager';
import LoadingAnimation from '@/components/LoadingAnimation';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sun, 
  Award, 
  Target, 
  MapPin, 
  RefreshCw,
  ThermometerSun,
  CloudRain,
  Droplets,
  Wind
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { weatherData, loading, error, refreshWeather, setLocation } = useWeather();
  const { 
    userProgress, 
    checkIn, 
    unlockAchievement, 
    completeChallenge, 
    addPoints, 
    setGameLocation, 
    addGameLocation, 
    removeGameLocation, 
    updateWeatherAchievements 
  } = useGameProgress();
  
  const [activeTab, setActiveTab] = useState('weather');
  const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load initial data
  useEffect(() => {
    const locations = loadSavedLocations();
    const selected = getSelectedLocation();
    
    setSavedLocations(locations);
    setSelectedLocation(selected);
    
    if (selected) {
      setLocation(selected);
    }
    
    // Register check-in
    checkIn();
  }, []);

  // Update achievements and challenges when weather data changes
  useEffect(() => {
    if (weatherData) {
      updateWeatherAchievements(weatherData);
    }
  }, [weatherData]);

  const handleRefreshWeather = () => {
    refreshWeather();
    toast({
      title: 'Weather Updated',
      description: 'Latest weather data has been loaded.',
    });
  };

  const handleLocationSelect = (location: WeatherLocation) => {
    setSelectedLocation(location);
    setLocation(location);
    setGameLocation(location.id);
  };

  const handleAddLocation = (location: WeatherLocation) => {
    const updatedLocations = addLocation(location);
    setSavedLocations(updatedLocations);
    addGameLocation(location.id);
  };

  const handleRemoveLocation = (locationId: string) => {
    const updatedLocations = loadSavedLocations().filter(loc => loc.id !== locationId);
    setSavedLocations(updatedLocations);
    removeGameLocation(locationId);
    
    // If the removed location was selected, select another one
    if (selectedLocation?.id === locationId && updatedLocations.length > 0) {
      handleLocationSelect(updatedLocations[0]);
    }
  };

  const handleChallengeComplete = (challengeId: string) => {
    completeChallenge(challengeId);
    
    toast({
      title: 'Challenge Completed!',
      description: 'You earned points and made progress towards achievements.',
    });
  };

  // If loading
  if (loading && !weatherData) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <LoadingAnimation message="Gathering weather data and achievements..." />
      </div>
    );
  }

  // If error
  if (error && !weatherData) {
    return (
      <div className="container mx-auto px-4 pt-8 text-center">
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <CloudRain className="w-20 h-20 text-red-400" />
          <h2 className="text-xl font-bold text-gray-800">Oops! Weather data is unavailable</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={refreshWeather}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ThermometerSun className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          <span>Weather Wonder Quest</span>
        </h1>
        
        <Button 
          onClick={handleRefreshWeather}
          className="mt-2 md:mt-0"
          size={isMobile ? "sm" : "default"}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Weather
        </Button>
      </div>

      {weatherData && (
        <>
          <div className="mb-4 md:mb-6">
            <CurrentWeather 
              weather={weatherData.current}
              city={weatherData.location.name}
              country={weatherData.location.country}
              onRefresh={handleRefreshWeather}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="lg:col-span-3">
              <WeatherForecast forecast={weatherData.forecast} />
            </div>
            
            <div className="lg:col-span-1">
              <StreakCounter 
                currentStreak={userProgress.streak.current}
                longestStreak={userProgress.streak.longest}
                level={userProgress.level}
                points={userProgress.points}
                pointsToNextLevel={userProgress.pointsToNextLevel}
              />
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4 md:mb-6">
            <TabsList className="grid grid-cols-3 mb-4 w-full md:w-[400px]">
              <TabsTrigger value="weather" className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Weather
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1">
                <Award className="h-4 w-4" /> Achievements
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1">
                <Target className="h-4 w-4" /> Challenges
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weather" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3">
                  <div className="bg-blue-200/50 p-1.5 md:p-2 rounded-full">
                    <ThermometerSun className="h-4 w-4 md:h-6 md:w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-700 font-medium">Temperature</div>
                    <div className="text-lg md:text-xl font-bold">{Math.round(weatherData.current.temp)}°C</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3">
                  <div className="bg-indigo-200/50 p-1.5 md:p-2 rounded-full">
                    <Droplets className="h-4 w-4 md:h-6 md:w-6 text-indigo-700" />
                  </div>
                  <div>
                    <div className="text-xs text-indigo-700 font-medium">Humidity</div>
                    <div className="text-lg md:text-xl font-bold">{weatherData.current.humidity}%</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3">
                  <div className="bg-purple-200/50 p-1.5 md:p-2 rounded-full">
                    <Wind className="h-4 w-4 md:h-6 md:w-6 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-xs text-purple-700 font-medium">Wind Speed</div>
                    <div className="text-lg md:text-xl font-bold">{Math.round(weatherData.current.wind_speed * 3.6)} km/h</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3">
                  <div className="bg-cyan-200/50 p-1.5 md:p-2 rounded-full">
                    <CloudRain className="h-4 w-4 md:h-6 md:w-6 text-cyan-700" />
                  </div>
                  <div>
                    <div className="text-xs text-cyan-700 font-medium">Conditions</div>
                    <div className="text-lg md:text-xl font-bold capitalize truncate">{weatherData.current.main}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <LocationManager 
                  savedLocations={savedLocations}
                  selectedLocation={selectedLocation || weatherData.location}
                  onSelectLocation={handleLocationSelect}
                  onAddLocation={handleAddLocation}
                  onRemoveLocation={handleRemoveLocation}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Achievements achievements={userProgress.achievements} />
            </TabsContent>
            
            <TabsContent value="challenges">
              <WeatherChallenges 
                challenges={userProgress.challenges}
                onComplete={handleChallengeComplete}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
