import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Assignment } from '@/hooks/useAssignments';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const AssignmentCard = ({ assignment, onToggleComplete, onDelete }: AssignmentCardProps) => {
  const dueDate = new Date(assignment.due_date);
  const isOverdue = isPast(dueDate) && !assignment.completed;
  const isDueToday = isToday(dueDate);
  const isDueTomorrow = isTomorrow(dueDate);

  const getUrgencyStyles = () => {
    if (assignment.completed) return 'border-success/30 bg-success/5';
    if (isOverdue) return 'border-destructive/40 bg-destructive/5';
    if (isDueToday) return 'border-warning/40 bg-warning/5';
    if (isDueTomorrow) return 'border-primary/30 bg-primary/5';
    return 'border-border bg-card';
  };

  const getDateLabel = () => {
    if (assignment.completed) return 'Completed';
    if (isOverdue) return 'Overdue';
    if (isDueToday) return 'Due today';
    if (isDueTomorrow) return 'Due tomorrow';
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  const getDateLabelStyles = () => {
    if (assignment.completed) return 'text-success';
    if (isOverdue) return 'text-destructive';
    if (isDueToday) return 'text-warning';
    if (isDueTomorrow) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'group p-4 rounded-xl border-2 transition-all duration-200 animate-slide-up',
        getUrgencyStyles(),
        assignment.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={assignment.completed}
          onCheckedChange={(checked) =>
            onToggleComplete(assignment.id, checked as boolean)
          }
          className="mt-1 h-5 w-5 rounded-full border-2 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold text-foreground truncate',
              assignment.completed && 'line-through text-muted-foreground'
            )}
          >
            {assignment.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-medium">
              <BookOpen className="h-3 w-3" />
              {assignment.class_name}
            </span>

            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                getDateLabelStyles()
              )}
            >
              <Clock className="h-3 w-3" />
              {getDateLabel()}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {format(dueDate, 'EEEE, MMMM d, yyyy • h:mm a')}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(assignment.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCard;
