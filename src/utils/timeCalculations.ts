import { Activity } from '@/components/ActivityCard';

// Parse time string (HH:MM) to minutes since midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes since midnight to time string (HH:MM)
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Calculate duration between two times in minutes
export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

// Recalculate times for activities in a day
export function recalculateDayTimes(activities: Activity[]): Activity[] {
  if (activities.length === 0) return activities;

  const updatedActivities: Activity[] = [];
  let currentTime = timeToMinutes(activities[0].startTime);

  for (const activity of activities) {
    const duration = calculateDuration(activity.startTime, activity.endTime);
    const newStartTime = minutesToTime(currentTime);
    const newEndTime = minutesToTime(currentTime + duration);

    updatedActivities.push({
      ...activity,
      startTime: newStartTime,
      endTime: newEndTime,
    });

    currentTime += duration;
  }

  return updatedActivities;
}
