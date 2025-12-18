import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAssignments } from '@/hooks/useAssignments';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import AssignmentCard from '@/components/AssignmentCard';
import AddAssignmentDialog from '@/components/AddAssignmentDialog';
import EmptyState from '@/components/EmptyState';
import { ClipboardCheck, LogOut, Bell, BellOff, Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { assignments, isLoading, createAssignment, toggleComplete, deleteAssignment } = useAssignments(user?.id);
  const { requestPermission, checkUpcomingDeadlines, permission, isSupported } = useNotifications();

  useEffect(() => {
    if (assignments.length > 0 && permission === 'granted') {
      checkUpcomingDeadlines(assignments);
    }
  }, [assignments, permission, checkUpcomingDeadlines]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const pendingAssignments = assignments.filter((a) => !a.completed);
  const completedAssignments = assignments.filter((a) => a.completed);

  const handleToggleComplete = (id: string, completed: boolean) => {
    toggleComplete.mutate({ id, completed });
  };

  const handleDelete = (id: string) => {
    deleteAssignment.mutate(id);
  };

  const handleAddAssignment = (assignment: Parameters<typeof createAssignment.mutate>[0]) => {
    createAssignment.mutate(assignment);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <ClipboardCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">TaskTrack</h1>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={requestPermission}
                  className="relative"
                  title={permission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
                >
                  {permission === 'granted' ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {/* Stats & Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Assignments</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {pendingAssignments.length} pending • {completedAssignments.length} completed
            </p>
          </div>
          <AddAssignmentDialog
            onAdd={handleAddAssignment}
            isLoading={createAssignment.isPending}
          />
        </div>

        {/* Assignments List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Pending Assignments */}
            {pendingAssignments.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  To Do ({pendingAssignments.length})
                </h3>
                <div className="space-y-3">
                  {pendingAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Assignments */}
            {completedAssignments.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Completed ({completedAssignments.length})
                </h3>
                <div className="space-y-3">
                  {completedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
