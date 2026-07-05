import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { getToken } from '../lib/storage.js';
import { useAuth } from './AuthContext.jsx';
import { API_BASE_URL } from '../lib/config.js';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // ── Fetch from REST API ──────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiRequest('/api/notifications');
      setNotifications(data || []);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  }, [user]);

  // Initial load whenever user changes
  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    refresh();
  }, [user, refresh]);

  // ── SSE for real-time push ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const token = getToken();
    if (!token) return;

    const base = API_BASE_URL.replace(/\/+$/, '');
    const url = `${base}/api/notifications/subscribe?access_token=${token}`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        console.log('SSE notification:', incoming);
        // Prepend and then re-fetch to get DB IDs and full state
        setNotifications(prev => [incoming, ...prev]);
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      // SSE will auto-reconnect; no hard failure needed
    };

    return () => es.close();
  }, [user]);

  // ── Mark single notification as read ────────────────────────────────────
  const markOneRead = useCallback(async (id) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch { /* silent */ }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markOneRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
