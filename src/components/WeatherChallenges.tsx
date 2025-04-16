
import React from 'react';
import { Challenge } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  Clock, 
  Check, 
  X, 
  AlertTriangle,
  Calendar,
  MapPin,
  CloudRain,
  Thermometer
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface WeatherChallengesProps {
  challenges: Challenge[];
  onComplete: (id: string) => void;
}

const WeatherChallenges: React.FC<WeatherChallengesProps> = ({ challenges, onComplete }) => {
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);
  
  const formatTimeLeft = (expiresAt: number | undefined) => {
    if (!expiresAt) return 'No expiration';
    
    const now = Date.now();
    const timeLeftMs = expiresAt - now;
    
    if (timeLeftMs <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} left`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    
    return `${minutes}m left`;
  };

  // Function to render challenge icon based on name
  const renderChallengeIcon = (iconName: string, type: string) => {
    const iconColor = type === 'daily' ? 'text-blue-600' : 
      type === 'weekly' ? 'text-purple-600' : 'text-green-600';
      
    const iconClass = `h-5 w-5 ${iconColor}`;
    
    // Use a switch case for predefined icons
    switch (iconName) {
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'map-pin':
        return <MapPin className={iconClass} />;
      case 'calendar-days':
        return <Calendar className={iconClass} />;
      case 'cloud-rain':
        return <CloudRain className={iconClass} />;
      case 'thermometer':
        return <Thermometer className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  // Function to render completed challenge icon
  const renderCompletedIcon = (iconName: string) => {
    const iconClass = "h-4 w-4 text-green-600";
    
    // Use a switch case for predefined icons
    switch (iconName) {
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'map-pin':
        return <MapPin className={iconClass} />;
      case 'calendar-days':
        return <Calendar className={iconClass} />;
      case 'cloud-rain':
        return <CloudRain className={iconClass} />;
      case 'thermometer':
        return <Thermometer className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  return (
    <Card className="animate-slide-in-right">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5" />
          <span>Daily Challenges</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {activeChallenges.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-500">Active Challenges</h3>
              <div className="space-y-3">
                {activeChallenges.map(challenge => {
                  const progressPercentage = Math.round((challenge.progress / challenge.maxProgress) * 100);
                  const isExpiringSoon = challenge.expiresAt && 
                    (challenge.expiresAt - Date.now()) < (4 * 60 * 60 * 1000); // 4 hours
                  
                  return (
                    <div 
                      key={challenge.id} 
                      className="border rounded-lg p-3 relative hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className={`
                            p-2 rounded-full flex-shrink-0
                            ${challenge.type === 'daily' ? 'bg-blue-100' : 
                              challenge.type === 'weekly' ? 'bg-purple-100' : 'bg-green-100'}
                          `}
                        >
                          {renderChallengeIcon(challenge.icon, challenge.type)}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{challenge.title}</h4>
                            <div 
                              className={`
                                text-xs px-2 py-0.5 rounded-full font-medium
                                ${challenge.type === 'daily' ? 'bg-blue-50 text-blue-600' : 
                                  challenge.type === 'weekly' ? 'bg-purple-50 text-purple-600' : 
                                  'bg-green-50 text-green-600'}
                              `}
                            >
                              {challenge.type}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-1 mb-2">{challenge.description}</p>
                          
                          {challenge.progress < challenge.maxProgress ? (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Progress: {challenge.progress}/{challenge.maxProgress}</span>
                                <span>{progressPercentage}%</span>
                              </div>
                              <Progress value={progressPercentage} className="h-1.5" />
                            </div>
                          ) : (
                            <Button 
                              onClick={() => onComplete(challenge.id)} 
                              size="sm" 
                              className="mt-1 h-8 text-xs w-full"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" /> Claim Reward
                            </Button>
                          )}
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs font-medium">+{challenge.points} pts</div>
                            
                            {challenge.expiresAt && (
                              <div 
                                className={`
                                  flex items-center text-xs
                                  ${isExpiringSoon ? 'text-red-500' : 'text-gray-500'}
                                `}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeLeft(challenge.expiresAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Check className="h-10 w-10 text-green-300 mb-2" />
              <p className="text-sm text-gray-500">All challenges completed!</p>
            </div>
          )}
          
          {completedChallenges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-500">Completed Challenges</h3>
              <div className="space-y-2">
                {completedChallenges.slice(0, 3).map(challenge => {
                  return (
                    <div 
                      key={challenge.id} 
                      className="border rounded-lg p-2 bg-gray-50 opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-1.5 rounded-full">
                          {renderCompletedIcon(challenge.icon)}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm">{challenge.title}</h4>
                            <div className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="h-3 w-3" /> Completed
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {completedChallenges.length > 3 && (
                  <p className="text-xs text-center text-gray-500">
                    +{completedChallenges.length - 3} more completed challenges
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChallenges;
