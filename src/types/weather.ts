
export interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  dt: number;
  sunrise: number;
  sunset: number;
  visibility: number;
  rain?: { "1h": number };
  snow?: { "1h": number };
}

export interface ForecastItem {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  speed: number;
  deg: number;
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastItem[];
  location: WeatherLocation;
  lastUpdated: number;
}

export interface WeatherError {
  message: string;
  code?: number;
}
