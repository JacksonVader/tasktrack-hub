import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  user_id: string;
  name: string;
  due_date: string;
  class_name: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewAssignment {
  name: string;
  due_date: string;
  class_name: string;
}

export const useAssignments = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ['assignments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Assignment[];
    },
    enabled: !!userId,
  });

  const createAssignment = useMutation({
    mutationFn: async (newAssignment: NewAssignment) => {
      if (!userId) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('assignments')
        .insert([{ ...newAssignment, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      toast({
        title: 'Assignment created',
        description: 'Your new assignment has been added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create assignment. Please try again.',
        variant: 'destructive',
      });
      console.error('Create assignment error:', error);
    },
  });

  const toggleComplete = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('assignments')
        .update({ completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      toast({
        title: data.completed ? 'Assignment completed! 🎉' : 'Assignment reopened',
        description: data.completed 
          ? 'Great job on finishing your assignment!' 
          : 'Assignment marked as incomplete.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update assignment. Please try again.',
        variant: 'destructive',
      });
      console.error('Toggle complete error:', error);
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      toast({
        title: 'Assignment deleted',
        description: 'The assignment has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete assignment. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete assignment error:', error);
    },
  });

  return {
    assignments,
    isLoading,
    error,
    createAssignment,
    toggleComplete,
    deleteAssignment,
  };
};
