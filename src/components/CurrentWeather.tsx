
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CurrentWeather as CurrentWeatherType } from '@/types/weather';
import WeatherAnimation from './WeatherAnimation';
import { 
  Droplets, 
  Wind, 
  ThermometerSun, 
  Sunrise, 
  Sunset, 
  Eye, 
  CloudRain 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  city: string;
  country?: string;
  onRefresh: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  weather, 
  city, 
  country, 
  onRefresh 
}) => {
  const isMobile = useIsMobile();
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeatherColor = () => {
    const weatherType = weather.main.toLowerCase();
    if (weatherType.includes('clear')) return 'bg-gradient-to-b from-blue-300 to-blue-50';
    if (weatherType.includes('cloud')) return 'bg-gradient-to-b from-gray-300 to-blue-50';
    if (weatherType.includes('rain')) return 'bg-gradient-to-b from-blue-400 to-blue-100';
    if (weatherType.includes('thunder')) return 'bg-gradient-to-b from-purple-500 to-purple-200';
    if (weatherType.includes('snow')) return 'bg-gradient-to-b from-blue-100 to-white';
    if (weatherType.includes('fog') || weatherType.includes('mist')) return 'bg-gradient-to-b from-gray-300 to-gray-100';
    return 'bg-gradient-to-b from-blue-300 to-blue-50';
  };

  return (
    <Card className={`overflow-hidden shadow-lg ${getWeatherColor()} border-none relative`}>
      {/* Weather Animation Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <WeatherAnimation weatherType={weather.main} size="xl" />
        </div>
        <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <WeatherAnimation weatherType={weather.main} size="xl" />
        </div>
        <div className="absolute bottom-1/4 left-2/3 transform -translate-x-1/2 translate-y-1/2">
          <WeatherAnimation weatherType={weather.main} size="lg" />
        </div>
      </div>
      
      <CardContent className="p-4 md:p-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <WeatherAnimation 
              weatherType={weather.main} 
              size={isMobile ? "lg" : "xl"} 
              className="mb-4 md:mb-0" 
            />
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold truncate max-w-[200px] md:max-w-none">{city}{country ? `, ${country}` : ''}</h2>
                <p className="text-md md:text-lg font-medium capitalize truncate max-w-[200px] md:max-w-none">{weather.description}</p>
              </div>
              
              <Badge 
                variant="outline" 
                className="bg-white/50 backdrop-blur-sm text-black font-semibold px-3 py-1.5 text-sm mt-2 md:mt-0 self-center animate-pulse-gentle cursor-pointer"
                onClick={onRefresh}
              >
                Tap to refresh
              </Badge>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-1">
                <div className="text-4xl md:text-5xl font-bold mb-2">{Math.round(weather.temp)}°C</div>
                <div className="flex gap-2 items-center text-sm">
                  <ThermometerSun className="h-4 w-4" />
                  <span>Feels like {Math.round(weather.feels_like)}°C</span>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-2 md:gap-3">
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span>{Math.round(weather.humidity)}%</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span>{Math.round(weather.wind_speed * 3.6)} km/h</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Sunrise className="h-4 w-4 text-yellow-500" />
                  <span>{formatTime(weather.sunrise)}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Sunset className="h-4 w-4 text-orange-500" />
                  <span>{formatTime(weather.sunset)}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span>{(weather.visibility / 1000).toFixed(1)} km</span>
                </div>
                
                {weather.rain && (
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="h-4 w-4 text-blue-500" />
                    <span>{Math.round(weather.rain['1h'])} mm</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
