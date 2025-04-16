
import React from 'react';
import { Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message = 'Loading weather data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute animate-spin-slow opacity-30">
          <Sun className="w-24 h-24 text-yellow-400" />
        </div>
        
        <div className="animate-bounce-gentle opacity-80">
          <Cloud className="w-16 h-16 text-blue-300" />
        </div>
        
        <div className="absolute bottom-0 right-0 animate-pulse-gentle">
          <CloudRain className="w-10 h-10 text-blue-400" />
        </div>
        
        <div className="absolute top-0 left-0 animate-pulse-gentle">
          <CloudLightning className="w-8 h-8 text-purple-400" />
        </div>
      </div>
      
      <p className="text-lg font-medium text-gray-600 animate-pulse-gentle">{message}</p>
    </div>
  );
};

export default LoadingAnimation;
