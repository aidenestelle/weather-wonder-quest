
import { useState, useEffect } from 'react';
import { WeatherData, WeatherLocation, WeatherError } from '@/types/weather';
import { getWeatherByCoords, getMockWeatherData } from '@/utils/weatherApi';
import { getSelectedLocation } from '@/utils/storage';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: WeatherError | null;
  refreshWeather: () => Promise<void>;
  setLocation: (location: WeatherLocation) => Promise<void>;
}

export function useWeather(): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<WeatherError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);

  // Initialize with the selected location
  useEffect(() => {
    const location = getSelectedLocation();
    setSelectedLocation(location);
  }, []);

  // Fetch weather data when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchWeatherData = async (location: WeatherLocation) => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data in development to avoid API rate limits
      const useMockData = process.env.NODE_ENV === 'development';
      
      let data: WeatherData;
      if (useMockData) {
        data = getMockWeatherData();
        data.location = location;
      } else {
        data = await getWeatherByCoords(location.lat, location.lon);
      }

      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError({
        message: 'Failed to fetch weather data. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (selectedLocation) {
      await fetchWeatherData(selectedLocation);
    }
  };

  const setLocation = async (location: WeatherLocation) => {
    setSelectedLocation(location);
    return fetchWeatherData(location);
  };

  return {
    weatherData,
    loading,
    error,
    refreshWeather,
    setLocation,
  };
}
