"use client";

import React, { useState } from "react";

// Mock data for notifications
const INITIAL_NOTIFICATIONS = [
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      
      {/* Phone container constraint */}
      <div className="w-full max-w-[390px] h-[800px] max-h-[90vh] bg-white shadow-2xl sm:rounded-[2.5rem] sm:border-[8px] border-gray-800 flex flex-col relative overflow-hidden">
        
        {/* --- HEADER --- */}
        <header className="bg-gradient-to-b from-orange-400 to-orange-500 pt-6 pb-6 shrink-0">
          <div className="flex items-center px-4 mb-2 text-white">
            {/* Back button (would ideally route back to home) */}
            <button className="text-2xl font-bold font-mono active:opacity-70">{"<"}</button>
            <h1 className="flex-1 text-center text-lg font-medium pr-6 text-blue-950">
              Notifications
            </h1>
          </div>
          
          <div className="flex items-center px-6 gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm">
              <div className="text-[10px] text-center text-gray-400 p-2">Logo</div>
            </div>
            <h2 className="text-blue-900 font-medium text-lg leading-tight">
              City Council Of Penang<br />Island
            </h2>
          </div>
        </header>

        {/* --- MAIN CONTENT (Scrollable) --- */}
        <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          
          {/* Subheader / Actions */}
          <div className="px-5 py-4 flex justify-between items-end border-b border-gray-200 bg-white sticky top-0 z-10">
            <h3 className="text-blue-900 font-medium text-xl">
              Recent Updates
            </h3>
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 font-medium hover:text-blue-800 active:opacity-70"
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="px-4 py-4 space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`w-full border rounded-2xl p-4 flex items-start gap-3 transition-colors cursor-pointer shadow-sm ${
                  notif.read 
                    ? "border-gray-200 bg-white" 
                    : "border-blue-900 bg-blue-50/40"
                }`}
              >
                {/* Status Indicator Dot */}
                <div className="mt-1.5 shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    !notif.read ? "bg-blue-600" : "bg-transparent"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-base truncate pr-2 ${
                      notif.read ? "text-gray-700" : "text-gray-900"
                    }`}>
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap mt-1">
                      {notif.time}
                    </span>
                  </div>
                  
                  <p className={`text-sm leading-snug ${
                    notif.read ? "text-gray-500" : "text-gray-700"
                  }`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
          
          {/* Bottom spacing to ensure last item isn't flush with screen edge */}
          <div className="h-6 shrink-0" />
        </main>
      </div>
    </div>
  );
}