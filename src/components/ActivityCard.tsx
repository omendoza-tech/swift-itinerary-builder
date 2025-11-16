import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MapPin, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  dayId: string;
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`p-4 bg-card hover:shadow-lg transition-shadow cursor-move ${
          isDragging ? 'shadow-2xl scale-105 z-50' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div {...listeners} className="pt-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-card-foreground">{activity.name}</h3>
            
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activity.startTime} - {activity.endTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{activity.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
