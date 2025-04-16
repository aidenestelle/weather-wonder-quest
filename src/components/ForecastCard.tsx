
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ForecastItem } from '@/types/weather';
import WeatherAnimation from './WeatherAnimation';
import { Droplets, Wind, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastItem;
  isSelected: boolean;
  onClick: () => void;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, isSelected, onClick }) => {
  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  // Get the main weather condition from the first weather item
  const weatherMain = forecast.weather[0].main;
  
  // Determine if it's a precipitation day (rain or snow)
  const hasPrecipitation = forecast.pop > 0.3;
  
  const precipitationAmount = forecast.rain ? 
    `${forecast.rain.toFixed(1)} mm rain` : 
    forecast.snow ? 
    `${forecast.snow.toFixed(1)} mm snow` : 
    '';

  return (
    <Card 
      className={`
        transition-all duration-300 cursor-pointer transform hover:scale-105
        ${isSelected ? 
          'border-primary shadow-lg scale-105' : 
          'hover:shadow-md'}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-500 mb-1">{formatDay(forecast.dt)}</div>
          <div className="text-xs text-gray-400 mb-2">{formatDate(forecast.dt)}</div>
          
          <div className="my-2">
            <WeatherAnimation weatherType={weatherMain} size="sm" />
          </div>
          
          <div className="text-lg font-bold mb-1">{Math.round(forecast.temp.day)}°C</div>
          
          <div className="flex justify-between w-full text-xs text-gray-500 mb-1">
            <div className="flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-blue-400" />
              <span>{Math.round(forecast.temp.min)}°</span>
            </div>
            <div className="flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-red-400" />
              <span>{Math.round(forecast.temp.max)}°</span>
            </div>
          </div>
          
          <div className="w-full flex justify-between text-xs mt-2">
            <div className="flex items-center">
              <Droplets className="h-3 w-3 mr-1 text-blue-500" />
              <span>{forecast.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="h-3 w-3 mr-1 text-blue-400" />
              <span>{Math.round(forecast.speed * 3.6)} km/h</span>
            </div>
          </div>
          
          {hasPrecipitation && (
            <div className="w-full text-center mt-2 text-xs">
              <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                {Math.round(forecast.pop * 100)}% chance
              </div>
              {precipitationAmount && (
                <div className="text-blue-600 mt-1">{precipitationAmount}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
