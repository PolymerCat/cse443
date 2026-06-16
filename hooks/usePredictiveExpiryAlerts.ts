import { useEffect, useRef } from "react";

export function usePredictiveExpiryAlerts(endTime: Date | null, isAlertSet: boolean) {
  const alerted30 = useRef(false);
  const alerted15 = useRef(false);
  const alerted10 = useRef(false);

  useEffect(() => {
    if (!endTime || !isAlertSet) return;

    alerted30.current = false;
    alerted15.current = false;
    alerted10.current = false;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const diffMs = endTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);

      if (diffMinutes === 30 && !alerted30.current) {
        alerted30.current = true;
        sendPushNotification(30);
      } else if (diffMinutes === 15 && !alerted15.current) {
        alerted15.current = true;
        sendPushNotification(15);
      } else if (diffMinutes === 10 && !alerted10.current) {
        alerted10.current = true;
        sendPushNotification(10);
      }
    }, 10000); 

    return () => clearInterval(intervalId);
  }, [endTime, isAlertSet]);

  const sendPushNotification = (minutesRemaining: number) => {
    if (Notification.permission === "granted") {
      new Notification("Parking Expiry Alert", {
        body: `Your parking session for WA8769Q will expire in ${minutesRemaining} minutes. Tap to extend.`,
        icon: "/icon-192x192.png", 
      });
    }
  };
}