'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { usePathname } from 'next/navigation';

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
};

// 1. ADD THIS: Define the shape of a Fine
export type FineType = {
  id: string;
  location: string;
  type: string;
  amount: number;
  status: string;
  plate?: string;
};

type NotificationContextType = {
  notifications: NotificationType[];
  unreadCount: number;
  handleMarkAsRead: (id: string) => void;
  handleMarkAllAsRead: () => void;
  instantAlertMsg: string | null;
  setInstantAlertMsg: (msg: string | null) => void;
  // 2. ADD THESE: Expose fines to the app
  fines: FineType[];
  setFines: React.Dispatch<React.SetStateAction<FineType[]>>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationType[] = [
  { id: "1", title: "Parking Success", message: "1 Day parking for WA8769Q started.", time: "Just now", read: false, type: "success" },
  { id: "2", title: "Expiry Alert: 15 Mins Remaining", message: "Your hourly parking for WA8769Q will expire in 15 minutes.", time: "1 hour ago", read: false, type: "warning" },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>(INITIAL_NOTIFICATIONS);
  const [instantAlertMsg, setInstantAlertMsg] = useState<string | null>(null);
  const pathname = usePathname();

  // 3. ADD THIS: Move the fines state here so it is global!
  const [fines, setFines] = useState<FineType[]>([
    { id: 'FN-8841', location: 'Lebuh Chulia', type: 'Expired Ticket', amount: 10.00, status: 'Unpaid' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); };
  const handleMarkAllAsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); };

  useEffect(() => {
    const myVehiclePlate = "WA8769Q"; 
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`vehicle-${myVehiclePlate}`);

    channel.bind('new-compound', (newFineData: any) => {
      
      // 4. ADD THIS: Add the new fine to the global Compounds list
      setFines(prev => [newFineData, ...prev]);

      const newNotification: NotificationType = {
        id: newFineData.id,
        title: "Compound Issued",
        message: `RM ${newFineData.amount} fine issued at ${newFineData.location} for ${newFineData.type}.`,
        time: "Just now",
        read: false,
        type: "warning" 
      };

      setNotifications(prev => [newNotification, ...prev]);
      setInstantAlertMsg(`🚨 New compound (RM ${newFineData.amount}) for ${newFineData.plate}!`);
      setTimeout(() => setInstantAlertMsg(null), 5000);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, handleMarkAsRead, handleMarkAllAsRead, instantAlertMsg, setInstantAlertMsg,
      fines, setFines
    }}>
      {children}
      
      {/* UPDATE THIS LINE: Only show if there is a message AND we are NOT on the simulation page */}
      {instantAlertMsg && pathname !== '/simulation' && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#ffffff', borderLeft: '4px solid #ef4444', borderRadius: '8px',
          padding: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999, display: 'flex', alignItems: 'flex-start', gap: '12px', animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>Instant Alert</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>{instantAlertMsg}</p>
          </div>
          <button onClick={() => setInstantAlertMsg(null)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};