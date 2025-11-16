import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DaySection } from '@/components/DaySection';
import { Activity } from '@/components/ActivityCard';
import { recalculateDayTimes } from '@/utils/timeCalculations';
import { Plane } from 'lucide-react';

const initialActivities: Activity[] = [
  { id: '1', name: 'Breakfast at Hotel', startTime: '08:00', endTime: '09:00', location: 'Hotel Restaurant', dayId: 'day-1' },
  { id: '2', name: 'Visit Louvre Museum', startTime: '09:30', endTime: '12:30', location: 'Louvre Museum, Paris', dayId: 'day-1' },
  { id: '3', name: 'Lunch at Café de Flore', startTime: '13:00', endTime: '14:30', location: 'Café de Flore, Saint-Germain', dayId: 'day-1' },
  { id: '4', name: 'Eiffel Tower Tour', startTime: '15:00', endTime: '17:00', location: 'Eiffel Tower, Champ de Mars', dayId: 'day-1' },
  { id: '5', name: 'Seine River Cruise', startTime: '17:30', endTime: '19:00', location: 'Port de la Bourdonnais', dayId: 'day-1' },
  
  { id: '6', name: 'Morning Jog', startTime: '07:00', endTime: '08:00', location: 'Champs-Élysées', dayId: 'day-2' },
  { id: '7', name: 'Visit Notre-Dame', startTime: '09:00', endTime: '11:00', location: 'Notre-Dame Cathedral', dayId: 'day-2' },
  { id: '8', name: 'Lunch at Le Marais', startTime: '12:00', endTime: '13:30', location: 'Le Marais District', dayId: 'day-2' },
  { id: '9', name: 'Shopping on Champs-Élysées', startTime: '14:00', endTime: '17:00', location: 'Champs-Élysées Avenue', dayId: 'day-2' },
  
  { id: '10', name: 'Breakfast & Check-out', startTime: '08:00', endTime: '10:00', location: 'Hotel', dayId: 'day-3' },
  { id: '11', name: 'Visit Sacré-Cœur', startTime: '10:30', endTime: '12:00', location: 'Sacré-Cœur, Montmartre', dayId: 'day-3' },
  { id: '12', name: 'Farewell Lunch', startTime: '12:30', endTime: '14:00', location: 'Montmartre Bistro', dayId: 'day-3' },
];

const DAYS = ['day-1', 'day-2', 'day-3'];

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setActivities((prevActivities) => {
      const activeActivity = prevActivities.find(a => a.id === active.id);
      if (!activeActivity) return prevActivities;

      const oldDayId = activeActivity.dayId;
      const oldIndex = prevActivities.findIndex(a => a.id === active.id);
      
      // Store the earliest start time for each affected day BEFORE reordering
      const getEarliestTimeForDay = (dayId: string, activities: Activity[]) => {
        const dayActivities = activities.filter(a => a.dayId === dayId);
        if (dayActivities.length === 0) return '09:00'; // default start time
        return dayActivities.reduce((earliest, activity) => {
          return activity.startTime < earliest ? activity.startTime : earliest;
        }, dayActivities[0].startTime);
      };

      const oldDayStartTime = getEarliestTimeForDay(oldDayId, prevActivities);
      
      // Determine new day and position
      let newDayId = oldDayId;
      let newIndex = oldIndex;

      // Check if dropped on a day container
      if (DAYS.includes(over.id as string)) {
        newDayId = over.id as string;
        const dayActivities = prevActivities.filter(a => a.dayId === newDayId);
        newIndex = prevActivities.indexOf(dayActivities[dayActivities.length - 1]) + 1;
      } else {
        // Dropped on another activity
        const overActivity = prevActivities.find(a => a.id === over.id);
        if (overActivity) {
          newDayId = overActivity.dayId;
          newIndex = prevActivities.findIndex(a => a.id === over.id);
        }
      }

      const newDayStartTime = getEarliestTimeForDay(newDayId, prevActivities);

      // Move the activity
      let updatedActivities = [...prevActivities];
      updatedActivities.splice(oldIndex, 1);
      updatedActivities.splice(newIndex, 0, { ...activeActivity, dayId: newDayId });

      // Recalculate times for affected days
      const affectedDays = new Set([oldDayId, newDayId]);
      
      affectedDays.forEach(dayId => {
        const dayActivities = updatedActivities
          .filter(a => a.dayId === dayId)
          .sort((a, b) => updatedActivities.indexOf(a) - updatedActivities.indexOf(b));
        
        // Use the preserved start time for this day
        const startTime = dayId === oldDayId ? oldDayStartTime : 
                         dayId === newDayId ? newDayStartTime : '09:00';
        
        const recalculated = recalculateDayTimes(dayActivities, startTime);
        
        recalculated.forEach(recalc => {
          const index = updatedActivities.findIndex(a => a.id === recalc.id);
          if (index !== -1) {
            updatedActivities[index] = recalc;
          }
        });
      });

      return updatedActivities;
    });
  };

  const getActivitiesForDay = (dayId: string) => {
    return activities.filter(a => a.dayId === dayId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-ocean-light">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-ocean bg-clip-text text-transparent">
              Trip Planner
            </h1>
          </div>
          <p className="text-muted-foreground">Drag and drop to reorganize your itinerary</p>
        </header>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-8">
            {DAYS.map((dayId, index) => (
              <DaySection
                key={dayId}
                dayId={dayId}
                dayNumber={index + 1}
                activities={getActivitiesForDay(dayId)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Index;
