// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../hooks/redux';
import { handleAxiosUnauthorized } from '../utils/sessionRedirect';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// ─── Cache helpers (per user so different accounts don't bleed) ───────────────
const getCacheKey = (userId) => `notifications_cache_${userId}`;

const loadFromCache = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToCache = (userId, notifications) => {
  if (!userId) return;
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(notifications));
  } catch {
    // storage full — ignore
  }
};

const clearCache = (userId) => {
  if (!userId) return;
  localStorage.removeItem(getCacheKey(userId));
};
// ─────────────────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const isCustomer = user?.role === 'customer';

  // ✅ Initialise from cache immediately — badge shows with correct count on first render, no API wait
  const [notifications, setNotifications] = useState(() =>
    user?.role === 'customer' ? loadFromCache(user?.user_id) : []
  );
  const [loading, setLoading] = useState(false);

  // ✅ Derived — always in sync with notifications array, no separate state to manage
  const notificationCount = notifications.filter(n => !n.read).length;

  // ✅ Whenever notifications change, persist to cache
  useEffect(() => {
    if (isCustomer && user?.user_id) {
      saveToCache(user.user_id, notifications);
    }
  }, [isCustomer, notifications, user?.user_id]);

  // ✅ When user changes (login / logout), load their cache immediately
  useEffect(() => {
    if (isCustomer) {
      setNotifications(loadFromCache(user?.user_id));
      return;
    }

    setNotifications([]);
  }, [isCustomer, user?.user_id]);

  // Fetch fresh data from API
  const fetchNotifications = useCallback(async (silent = false) => {
    if (!user?.user_id || !isCustomer) {
      setNotifications([]);
      return;
    }

    try {
      if (!silent) setLoading(true);

      const response = await axios.get('/api/customer/notifications', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success && Array.isArray(response.data.notifications)) {
  const normalized = response.data.notifications.map(n => ({
    ...n,
    id: n?._id || n?.notification_id || n?.id || null,
  }));

  setNotifications(normalized);
}
    }catch (error) {
      if (handleAxiosUnauthorized(error)) {
        return;
      }

      console.error('? Error fetching notifications:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isCustomer, user]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id) => {
    // ✅ Optimistic update — instant UI change before API responds
    setNotifications(prev =>
      prev.map(n =>
        (n.id === id || n._id === id || n.notification_id === id)
          ? { ...n, read: true }
          : n
      )
    );

    try {
      await axios.put(`/api/customer/notifications/${id}/read`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('❌ Error marking as read:', error);
      // Optimistic update already applied — leave it as is
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    // ✅ Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await axios.put('/api/customer/notifications/read-all', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (id) => {
    // ✅ Optimistic update
    setNotifications(prev =>
      prev.filter(n => n.id !== id && n._id !== id && n.notification_id !== id)
    );

    try {
      await axios.delete(`/api/customer/notifications/${id}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    // ✅ Optimistic update
    setNotifications([]);
    if (isCustomer && user?.user_id) clearCache(user.user_id);

    try {
      await axios.delete('/api/customer/notifications/clear-all', {
        withCredentials: true
      });
    } catch (error) {
      console.error('❌ Error clearing notifications:', error);
      throw error;
    }
  }, [isCustomer, user?.user_id]);

  // Fetch on user login
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
  if (!user?.user_id || !isCustomer) return;

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [isCustomer, user?.user_id, fetchNotifications]);

  const value = {
    notifications,
    notificationCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
