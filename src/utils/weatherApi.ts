
import axios from 'axios';
import { CurrentWeather, ForecastItem, WeatherLocation, WeatherData } from '@/types/weather';

// Replace with your API key
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Get weather data by coordinates
export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Get current weather
    const currentResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast/daily`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 5,
      },
    });

    const current: CurrentWeather = {
      temp: currentResponse.data.main.temp,
      feels_like: currentResponse.data.main.feels_like,
      temp_min: currentResponse.data.main.temp_min,
      temp_max: currentResponse.data.main.temp_max,
      pressure: currentResponse.data.main.pressure,
      humidity: currentResponse.data.main.humidity,
      description: currentResponse.data.weather[0].description,
      icon: currentResponse.data.weather[0].icon,
      main: currentResponse.data.weather[0].main,
      wind_speed: currentResponse.data.wind.speed,
      wind_deg: currentResponse.data.wind.deg,
      clouds: currentResponse.data.clouds.all,
      dt: currentResponse.data.dt,
      sunrise: currentResponse.data.sys.sunrise,
      sunset: currentResponse.data.sys.sunset,
      visibility: currentResponse.data.visibility,
      rain: currentResponse.data.rain,
      snow: currentResponse.data.snow,
    };

    const forecast: ForecastItem[] = forecastResponse.data.list;

    const location: WeatherLocation = {
      id: `${lat}-${lon}`,
      name: currentResponse.data.name,
      lat,
      lon,
      country: currentResponse.data.sys.country,
    };

    return {
      current,
      forecast,
      location,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Search for locations
export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((item: any) => ({
      id: `${item.lat}-${item.lon}`,
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

// Mock data for development to avoid API rate limits
export function getMockWeatherData(): WeatherData {
  const mockCurrent: CurrentWeather = {
    temp: 22.5,
    feels_like: 23.1,
    temp_min: 20.2,
    temp_max: 24.8,
    pressure: 1012,
    humidity: 65,
    description: 'scattered clouds',
    icon: '03d',
    main: 'Clouds',
    wind_speed: 3.6,
    wind_deg: 220,
    clouds: 40,
    dt: Math.floor(Date.now() / 1000),
    sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
    sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
    visibility: 10000,
  };

  const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow'];
  const icons = ['01d', '02d', '03d', '10d', '11d', '13d'];

  const mockForecast: ForecastItem[] = Array.from({ length: 5 }, (_, i) => {
    const randomWeather = Math.floor(Math.random() * weatherTypes.length);
    const randomIcon = Math.floor(Math.random() * icons.length);
    
    return {
      dt: Math.floor(Date.now() / 1000) + 86400 * (i + 1),
      temp: {
        day: 20 + Math.random() * 10,
        min: 15 + Math.random() * 5,
        max: 25 + Math.random() * 5,
        night: 15 + Math.random() * 5,
        eve: 18 + Math.random() * 7,
        morn: 16 + Math.random() * 4,
      },
      feels_like: {
        day: 20 + Math.random() * 10,
        night: 15 + Math.random() * 5,
        eve: 18 + Math.random() * 7,
        morn: 16 + Math.random() * 4,
      },
      pressure: 1010 + Math.random() * 10,
      humidity: 50 + Math.random() * 30,
      weather: [
        {
          id: 800 + Math.floor(Math.random() * 100),
          main: weatherTypes[randomWeather],
          description: `${weatherTypes[randomWeather].toLowerCase()} weather`,
          icon: icons[randomIcon],
        },
      ],
      speed: 2 + Math.random() * 5,
      deg: Math.floor(Math.random() * 360),
      clouds: Math.floor(Math.random() * 100),
      pop: Math.random(),
      rain: Math.random() > 0.7 ? Math.random() * 10 : undefined,
      snow: Math.random() > 0.9 ? Math.random() * 5 : undefined,
    };
  });

  const mockLocation: WeatherLocation = {
    id: 'mock-location',
    name: 'New York',
    lat: 40.7128,
    lon: -74.006,
    country: 'US',
  };

  return {
    current: mockCurrent,
    forecast: mockForecast,
    location: mockLocation,
    lastUpdated: Date.now(),
  };
}
