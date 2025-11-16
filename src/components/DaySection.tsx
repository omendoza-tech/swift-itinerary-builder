import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ActivityCard, Activity } from './ActivityCard';
import { Calendar } from 'lucide-react';

interface DaySectionProps {
  dayId: string;
  dayNumber: number;
  activities: Activity[];
}

export function DaySection({ dayId, dayNumber, activities }: DaySectionProps) {
  const { setNodeRef } = useDroppable({
    id: dayId,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Calendar className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Day {dayNumber}</h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>

      <SortableContext
        id={dayId}
        items={activities.map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-3 min-h-[200px] rounded-lg">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg text-muted-foreground">
              Drop activities here
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
