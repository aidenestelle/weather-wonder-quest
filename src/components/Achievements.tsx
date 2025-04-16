
import React, { useState } from 'react';
import { Achievement } from '@/types/game';
import AchievementBadge from './AchievementBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, LockKeyhole } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentComplete = Math.round((unlockedCount / totalCount) * 100);
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  return (
    <Card className="animate-slide-in-left">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
          
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="font-medium text-primary">{unlockedCount}</span>
            <span className="text-muted-foreground">of</span>
            <span>{totalCount}</span>
            <span className="text-muted-foreground">({percentComplete}%)</span>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mx-4 mb-4">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="unlocked" className="text-xs">Unlocked</TabsTrigger>
          <TabsTrigger value="locked" className="text-xs">Locked</TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-0">
          <TabsContent value={filter} forceMount className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map(achievement => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                  <LockKeyhole className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No achievements found in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default Achievements;
