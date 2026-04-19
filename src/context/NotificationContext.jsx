import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) {
      setNotifications([]);
      return;
    }

    // Connect SSE (We must pass the token as a query param or use EventSourcePolyfill if we need Headers)
    // Since native EventSource doesn't support headers, we'll append the token to the URL and configure the backend to accept it OR
    // EventSourcePolyfill allows headers, which is much better for security.
    // For now, if we use standard axios we're good. Let's just adjust standard EventSource if possible.
    // Wait, let's use the polyfill if possible, else append ?access_token=token
    const eventSourceUrl = `http://localhost:8080/api/notifications/subscribe?access_token=${token}`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("New Notification:", data);
      setNotifications((prev) => [data, ...prev]);
    };
    
    eventSource.onerror = (e) => {
        console.error("SSE Error:", e);
    };

    return () => eventSource.close();
  }, [user, token]);

  useEffect(() => {
    // Fetch Old Notifications
    if (!user || !token) return;

    axios.get("/api/notifications")
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error("Error fetching notifications", error);
      });
  }, [user, token]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
