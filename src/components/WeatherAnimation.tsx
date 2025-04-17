
import React from 'react';
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog, Wind, CloudSun, Snowflake, Cloudy } from 'lucide-react';

interface WeatherAnimationProps {
  weatherType: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherType, size = 'md', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-16 h-16';
      case 'lg': return 'w-24 h-24';
      case 'xl': return 'w-32 h-32';
      default: return 'w-16 h-16';
    }
  };

  const renderAnimation = () => {
    const sizeClass = getSizeClass();
    const baseClass = `text-primary ${sizeClass} ${className}`;

    const weather = weatherType.toLowerCase();

    if (weather.includes('thunderstorm')) {
      return (
        <div className="relative">
          <CloudLightning className={`${baseClass} animate-pulse-gentle text-weather-thunder`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-8 bg-yellow-300 rounded-full animate-pulse-gentle opacity-70"></div>
          </div>
        </div>
      );
    }

    if (weather.includes('drizzle') || weather.includes('light rain')) {
      return (
        <div className="relative">
          <CloudDrizzle className={`${baseClass} animate-float text-weather-rain`} />
          <div className="absolute bottom-0 left-1/4 w-0.5 h-3 bg-blue-300 rounded-full animate-raindrop"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-blue-300 rounded-full animate-raindrop delay-300"></div>
          <div className="absolute bottom-0 left-3/4 w-0.5 h-3 bg-blue-300 rounded-full animate-raindrop delay-600"></div>
        </div>
      );
    }

    if (weather.includes('rain')) {
      return (
        <div className="relative">
          <CloudRain className={`${baseClass} animate-float text-weather-rain`} />
          <div className="absolute bottom-0 left-1/4 w-0.5 h-4 bg-blue-400 rounded-full animate-raindrop"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-blue-400 rounded-full animate-raindrop delay-200"></div>
          <div className="absolute bottom-0 left-3/4 w-0.5 h-4 bg-blue-400 rounded-full animate-raindrop delay-400"></div>
          <div className="absolute bottom-0 left-1/3 w-0.5 h-4 bg-blue-400 rounded-full animate-raindrop delay-600"></div>
          <div className="absolute bottom-0 left-2/3 w-0.5 h-4 bg-blue-400 rounded-full animate-raindrop delay-800"></div>
        </div>
      );
    }

    if (weather.includes('snow')) {
      return (
        <div className="relative">
          <CloudSnow className={`${baseClass} animate-float text-weather-snow`} />
          <div className="absolute bottom-0 left-1/4 w-2 h-2 text-blue-100 animate-snowfall">❄</div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 text-blue-100 animate-snowfall delay-500">❄</div>
          <div className="absolute bottom-0 left-3/4 w-2 h-2 text-blue-100 animate-snowfall delay-1000">❄</div>
        </div>
      );
    }

    if (weather.includes('clear')) {
      return (
        <div className="relative">
          <Sun className={`${baseClass} animate-spin-slow text-yellow-400`} />
          <div className="absolute inset-0 rounded-full bg-yellow-200 opacity-20 animate-pulse-gentle"></div>
        </div>
      );
    }

    if (weather.includes('fog') || weather.includes('mist') || weather.includes('haze')) {
      return (
        <div className="relative">
          <CloudFog className={`${baseClass} animate-pulse-gentle text-weather-fog`} />
          <div className="absolute inset-0 bg-gray-200 opacity-20 rounded-full animate-pulse-gentle"></div>
        </div>
      );
    }

    if (weather.includes('wind')) {
      return <Wind className={`${baseClass} animate-pulse-gentle text-weather-wind`} />;
    }

    if (weather.includes('cloud')) {
      return (
        <div className="relative">
          <div className="absolute -top-2 -right-2">
            <Sun className={`${sizeClass} text-yellow-400 opacity-70 animate-pulse-gentle`} />
          </div>
          <CloudSun className={`${baseClass} animate-float text-weather-cloud`} />
        </div>
      );
    }

    // Default fallback
    return (
      <div className="relative">
        <Cloudy className={`${baseClass} animate-float text-weather-cloud`} />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">
      {renderAnimation()}
    </div>
  );
};

export default WeatherAnimation;
