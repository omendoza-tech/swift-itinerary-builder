import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MapPin, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  dayId: string;
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    <>
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card
          className={`p-4 bg-card hover:shadow-lg transition-shadow ${
            isDragging ? 'shadow-2xl scale-105 z-50 cursor-grabbing' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div {...listeners} className="pt-1 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div 
              className="flex-1 space-y-2 cursor-pointer" 
              onClick={() => setIsDialogOpen(true)}
            >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activity.name}</DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p className="text-foreground">{activity.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{activity.startTime} - {activity.endTime}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
