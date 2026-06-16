import React, { useEffect } from "react";

interface NotificationProps {
  show: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function Notification({ 
  show, 
  title = "Parking success", 
  message = "Parking success", 
  onClose 
}: NotificationProps) {
  
  // Automatically close the notification after 3 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="absolute top-4 left-4 right-4 md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-white rounded-2xl shadow-xl p-3 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">Penang Smart Parking • Just now</span>
        </div>
        {/* Added an onClick to the arrow so the user can manually close it too */}
        <span 
          className="text-gray-400 text-xs cursor-pointer p-1 hover:bg-gray-100 rounded" 
          onClick={onClose}
        >
          ∨
        </span>
      </div>
      <p className="text-gray-800 text-sm font-medium">{title}</p>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}