import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface NotificationContextProps {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextProps>({ notify: () => {} });

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  function notify(message: string, type: Notification['type'] = 'info') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg text-white font-semibold transition bg-${
            notification.type === 'success'
              ? 'brand-primary'
              : notification.type === 'error'
              ? 'red-600'
              : 'brand-dark'
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
} 