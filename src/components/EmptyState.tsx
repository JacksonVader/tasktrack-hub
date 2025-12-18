import { ClipboardList } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6">
        <ClipboardList className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No assignments yet
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Start by adding your first assignment. We'll help you stay on track with reminders as deadlines approach.
      </p>
    </div>
  );
};

export default EmptyState;
