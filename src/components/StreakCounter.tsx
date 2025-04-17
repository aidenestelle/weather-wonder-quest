
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Award, Calendar, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  level: number;
  points: number;
  pointsToNextLevel: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  level,
  points,
  pointsToNextLevel,
}) => {
  const progressPercent = Math.min(100, (points / pointsToNextLevel) * 100);
  const isMobile = useIsMobile();

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak === 1) return "First day of your streak!";
    if (currentStreak < 3) return "Keep it going!";
    if (currentStreak < 7) return "Great consistency!";
    if (currentStreak < 14) return "Impressive dedication!";
    if (currentStreak < 30) return "You're on fire!";
    return "Weather master!";
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-amber-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400/20 p-2 rounded-full">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Streak</div>
                <div className="text-xl font-bold">{currentStreak} days</div>
              </div>
            </div>
            <div className="text-xs bg-white/80 px-2 py-1 rounded-full text-orange-600 font-medium truncate max-w-[120px]">
              {getStreakMessage()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-400/20 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Longest Streak</div>
                <div className="text-xl font-bold">{longestStreak} days</div>
              </div>
            </div>
            <div className="text-xs bg-white/80 px-2 py-1 rounded-full text-indigo-600 font-medium truncate max-w-[120px]">
              {currentStreak >= longestStreak && currentStreak > 0 
                ? "New record!" 
                : "Keep going!"}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-blue-400/20 p-2 rounded-full">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Level {level}</div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">{points}</span>
                  <span className="text-xs text-gray-500">/ {pointsToNextLevel} points</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-1/4">
              <Progress value={progressPercent} className="h-2" />
            </div>
            <div className="block sm:hidden">
              <Progress value={progressPercent} className="h-2 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;
