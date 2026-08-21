import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastContainer } from '../components/ui/Toast';

const ToastContext = createContext(null);

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // SIH Demo Wow Factor: Trigger Native Browser Push Notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('WoolConnect', { body: message, icon: '/logo.png' });
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            try {
              new Notification('WoolConnect', { body: message, icon: '/logo.png' });
            } catch (e) {}
          }
        });
      }
    }

    return id;
  }, []);

  const showSuccess = useCallback((msg) => show(msg, 'success'), [show]);
  const showError = useCallback((msg) => show(msg, 'error', 5000), [show]);
  const showInfo = useCallback((msg) => show(msg, 'info'), [show]);

  return (
    <ToastContext.Provider value={{ show, showSuccess, showError, showInfo, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
