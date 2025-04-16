
import React, { useState } from 'react';
import { ForecastItem } from '@/types/weather';
import ForecastCard from './ForecastCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Wind, ThermometerSun, ArrowDownRight, ArrowUpRight, CloudRain } from 'lucide-react';
import WeatherAnimation from './WeatherAnimation';
import { Button } from '@/components/ui/button';

interface WeatherForecastProps {
  forecast: ForecastItem[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedView, setSelectedView] = useState<'detailed' | 'grid'>('grid');

  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
  };

  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-4 animate-slide-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">5-Day Forecast</h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedView === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedView('grid')}
            className="text-xs h-8"
          >
            Grid View
          </Button>
          <Button 
            variant={selectedView === 'detailed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedView('detailed')}
            className="text-xs h-8"
          >
            Detailed View
          </Button>
        </div>
      </div>

      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {forecast.map((day, index) => (
            <ForecastCard 
              key={day.dt} 
              forecast={day} 
              isSelected={selectedDay === index}
              onClick={() => handleDaySelect(index)}
            />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="0" className="w-full" onValueChange={(value) => setSelectedDay(parseInt(value))}>
          <TabsList className="grid grid-cols-5 mb-4">
            {forecast.map((day, index) => (
              <TabsTrigger key={day.dt} value={index.toString()} className="text-xs">
                {formatDay(day.dt).substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {forecast.map((day, index) => (
            <TabsContent key={day.dt} value={index.toString()}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex flex-col items-center p-4">
                      <div className="text-lg font-medium mb-1">
                        {formatDay(day.dt)}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {formatDate(day.dt)}
                      </div>
                      <WeatherAnimation weatherType={day.weather[0].main} size="lg" />
                      <div className="mt-3 text-lg font-bold">{Math.round(day.temp.day)}°C</div>
                      <div className="capitalize text-sm">{day.weather[0].description}</div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full">
                      <div className="border rounded-md p-3 space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Day: {Math.round(day.temp.day)}°C</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Night: {Math.round(day.temp.night)}°C</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-red-400" />
                            <span className="text-sm">Max: {Math.round(day.temp.max)}°C</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Min: {Math.round(day.temp.min)}°C</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-3 space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Details</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Humidity: {day.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Wind: {Math.round(day.speed * 3.6)} km/h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Precipitation: {Math.round(day.pop * 100)}%</span>
                          </div>
                          {(day.rain || day.snow) && (
                            <div className="flex items-center gap-2">
                              <CloudRain className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                {day.rain ? `Rain: ${day.rain.toFixed(1)} mm` : `Snow: ${day.snow!.toFixed(1)} mm`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border rounded-md p-3 col-span-1 sm:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Temperature Feels Like</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <span className="text-xs text-gray-500">Morning</span>
                            <span className="font-medium">{Math.round(day.feels_like.morn)}°C</span>
                          </div>
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <span className="text-xs text-gray-500">Day</span>
                            <span className="font-medium">{Math.round(day.feels_like.day)}°C</span>
                          </div>
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <span className="text-xs text-gray-500">Evening</span>
                            <span className="font-medium">{Math.round(day.feels_like.eve)}°C</span>
                          </div>
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <span className="text-xs text-gray-500">Night</span>
                            <span className="font-medium">{Math.round(day.feels_like.night)}°C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default WeatherForecast;
