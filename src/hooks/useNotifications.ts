import { useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'tasktrack-reminder',
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, []);

  const checkUpcomingDeadlines = useCallback((assignments: Array<{
    id: string;
    name: string;
    due_date: string;
    completed: boolean;
  }>) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAssignments = assignments.filter(assignment => {
      if (assignment.completed) return false;
      const dueDate = new Date(assignment.due_date);
      return dueDate > now && dueDate <= tomorrow;
    });

    if (upcomingAssignments.length > 0) {
      const names = upcomingAssignments.map(a => a.name).join(', ');
      sendNotification(
        'Upcoming Deadlines! 📚',
        `You have ${upcomingAssignments.length} assignment${upcomingAssignments.length > 1 ? 's' : ''} due soon: ${names}`
      );
    }
  }, [sendNotification]);

  return {
    requestPermission,
    sendNotification,
    checkUpcomingDeadlines,
    isSupported: 'Notification' in window,
    permission: typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied',
  };
};
