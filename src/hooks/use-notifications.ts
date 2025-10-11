import { useState, useEffect } from 'react';
import type { Notification } from '@/components/notifications/NotificationCenter';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'booking',
        title: 'New Booking Request',
        message: 'Emma Thompson has requested to book you for a wedding reception on Feb 14th.',
        is_read: false,
        priority: 'high',
        action_url: '/bookings',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of $2,800 has been processed for your wedding performance.',
        is_read: false,
        priority: 'medium',
        action_url: '/dashboard',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '3',
        type: 'review',
        title: 'New Review',
        message: 'Sarah Martinez left you a 5-star review for the corporate event.',
        is_read: true,
        priority: 'low',
        action_url: '/profile-settings',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: '4',
        type: 'system',
        title: 'Profile Updated',
        message: 'Your artist profile has been successfully updated with new gallery images.',
        is_read: true,
        priority: 'low',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    unreadCount: notifications.filter(n => !n.is_read).length
  };
}
