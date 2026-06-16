"use client";

import React, { useState } from "react";

// --- Types & Mock Data ---
type NotificationType = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
};

const INITIAL_NOTIFICATIONS: NotificationType[] = [
  {
    id: "1",
    title: "Parking Success",
    message: "1 Day parking for WA8769Q started. Valid until 12:00 AM (Next day). RM 6.00 has been charged.",
    time: "Just now",
    read: false,
    type: "success"
  },
  {
    id: "2",
    title: "Expiry Alert: 15 Mins Remaining",
    message: "Your hourly parking for WA8769Q will expire in 15 minutes at 4:30 PM. Tap to extend.",
    time: "1 hour ago",
    read: false,
    type: "warning"
  },
  {
    id: "3",
    title: "Parking Expired",
    message: "Your parking session for WA8769Q has ended.",
    time: "Yesterday, 6:00 PM",
    read: true,
    type: "info"
  },
  {
    id: "4",
    title: "Top-up Successful",
    message: "RM 50.00 has been successfully added to your e-wallet. Current balance is RM 64.20.",
    time: "June 14, 10:20 AM",
    read: true,
    type: "success"
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "The application will undergo scheduled maintenance on June 18 from 12:00 AM to 4:00 AM.",
    time: "June 12, 8:00 AM",
    read: true,
    type: "info"
  }
];

// --- Reusable Notification Component ---
const NotificationItem = ({ 
  notification, 
  onClick 
}: { 
  notification: NotificationType; 
  onClick: () => void;
}) => {
  const { title, message, time, read, type } = notification;

  // Render specific icon based on notification type
  const renderIcon = () => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm";
    
    if (type === "success") {
      return (
        <div className={`${baseClasses} ${read ? 'bg-gray-100' : 'bg-green-100'}`}>
          <svg className={`w-5 h-5 ${read ? 'text-gray-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      );
    }
    
    if (type === "warning") {
      return (
        <div className={`${baseClasses} ${read ? 'bg-gray-100' : 'bg-orange-100'}`}>
          <svg className={`w-5 h-5 ${read ? 'text-gray-400' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
      );
    }

    return (
      <div className={`${baseClasses} ${read ? 'bg-gray-100' : 'bg-blue-100'}`}>
        <svg className={`w-5 h-5 ${read ? 'text-gray-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-2xl p-4 flex items-start gap-4 transition-all cursor-pointer ${
        read 
          ? "bg-white border border-gray-200 shadow-sm" 
          : "bg-blue-50/60 border border-blue-200 shadow-md ring-1 ring-blue-50"
      }`}
    >
      {renderIcon()}

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start mb-1.5">
          <h4 className={`text-base truncate pr-3 ${
            read ? "font-medium text-gray-700" : "font-semibold text-gray-900"
          }`}>
            {title}
          </h4>
          <span className={`text-[11px] whitespace-nowrap mt-1 ${
            read ? "text-gray-400" : "text-blue-600 font-medium"
          }`}>
            {time}
          </span>
        </div>
        
        <p className={`text-sm leading-relaxed ${
          read ? "text-gray-500" : "text-gray-700"
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-[100dvh] w-full bg-gray-50 md:bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
      
      <div className="w-full max-w-xl h-full bg-white shadow-none md:shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* --- HEADER (Fixed at top) --- */}
        <header className="bg-gradient-to-b from-orange-400 to-orange-500 pt-6 pb-6 shrink-0 md:rounded-b-none z-10 shadow-sm">
          <div className="flex items-center px-4 mb-4 text-white">
            <button className="text-2xl font-bold font-mono active:opacity-70">{"<"}</button>
            <h1 className="flex-1 text-center text-lg font-medium pr-6 text-blue-950">
              Notifications
            </h1>
          </div>
          
          <div className="flex items-center justify-center md:justify-start px-6 gap-5">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm">
              <div className="text-[10px] text-center text-gray-400 p-2">Logo</div>
            </div>
            <h2 className="text-blue-900 font-medium text-lg leading-tight">
              City Council Of Penang<br />Island
            </h2>
          </div>
        </header>

        {/* --- MAIN CONTENT (Scrolls internally) --- */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50 flex flex-col">
          
          {/* Subheader / Actions (Sticky) */}
          <div className="px-5 py-4 flex justify-between items-end border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h3 className="text-blue-950 font-semibold text-xl">
                Inbox
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread messages</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 font-medium hover:text-blue-800 active:opacity-70 px-3 py-1.5 bg-blue-50 rounded-full transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List using the NotificationItem Component */}
          <div className="px-4 py-4 space-y-3">
            {notifications.map((notif) => (
              <NotificationItem 
                key={notif.id} 
                notification={notif} 
                onClick={() => handleMarkAsRead(notif.id)} 
              />
            ))}

            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-lg">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
          
          <div className="h-6 shrink-0" />
        </main>
      </div>
    </div>
  );
}