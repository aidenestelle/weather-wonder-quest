
import React from 'react';
import { Achievement } from '@/types/game';
import { 
  CheckCircle, 
  LockKeyhole, 
  Target, 
  Award, 
  Trophy, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Sun,
  MapPin,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface AchievementBadgeProps {
  achievement: Achievement;
}

type IconName = keyof typeof LucideIcons;

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { title, description, icon, unlocked, progress, maxProgress, points } = achievement;
  
  // Calculate progress percentage if applicable
  const progressPercentage = progress && maxProgress 
    ? Math.round((progress / maxProgress) * 100) 
    : unlocked ? 100 : 0;
  
  // Render icon component
  const renderIcon = () => {
    const iconClass = `h-8 w-8 ${unlocked ? 'text-blue-500' : 'text-gray-400'}`;
    
    // Use a switch case for predefined icons
    switch (icon) {
      case 'award':
        return <Award className={iconClass} />;
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'calendar-check':
        return <LucideIcons.CalendarCheck className={iconClass} />;
      case 'sun':
        return <Sun className={iconClass} />;
      case 'cloud-rain':
        return <CloudRain className={iconClass} />;
      case 'cloud-snow':
        return <CloudSnow className={iconClass} />;
      case 'cloud-lightning':
        return <CloudLightning className={iconClass} />;
      case 'map-pin':
        return <MapPin className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-lg
              transition-all duration-300 transform hover:scale-105
              ${unlocked 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer' 
                : 'bg-gray-100 border border-gray-200 opacity-75 cursor-help'
              }
            `}
          >
            <div 
              className={`
                relative p-3 rounded-full mb-2
                ${unlocked ? 'bg-blue-500/10' : 'bg-gray-200'}
              `}
            >
              {renderIcon()}
              
              {unlocked && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white p-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                </div>
              )}
              
              {!unlocked && (
                <div className="absolute -top-1 -right-1 bg-gray-400 text-white p-0.5 rounded-full">
                  <LockKeyhole className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <h3 
              className={`
                text-sm font-medium mb-1 text-center
                ${unlocked ? 'text-blue-800' : 'text-gray-600'}
              `}
            >
              {title}
            </h3>
            
            {progress !== undefined && maxProgress !== undefined && (
              <div className="w-full mt-1">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className={unlocked ? 'text-blue-600' : 'text-gray-500'}>
                    {progress}/{maxProgress}
                  </span>
                  <span className="font-medium text-xs">
                    {unlocked ? `+${points} pts` : `${points} pts`}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            )}
            
            {progress === undefined && (
              <div className="mt-1 text-xs font-medium">
                {unlocked ? `+${points} pts` : `${points} pts`}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-1.5">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>{achievement.condition}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span>{unlocked ? 'Unlocked!' : 'Locked'}</span>
              <span className="font-medium">{points} points</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
