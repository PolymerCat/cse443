import { useEffect, useRef } from "react";

export function usePredictiveExpiryAlerts(endTime: Date | null, isAlertSet: boolean, debugSeconds = false) {
  const alerted30 = useRef(false);
  const alerted15 = useRef(false);
  const alerted10 = useRef(false);
  const alerted10Sec = useRef(false);
  const alerted5Sec = useRef(false);

  const sendPushNotification = (timeRemaining: number, unit: "minutes" | "seconds" = "minutes") => {
    if (typeof Notification === "undefined") {
      console.warn("Notification API is not available in this browser.");
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("Notification permission is not granted.");
      return;
    }

    const label = unit === "minutes" ? `${timeRemaining} minutes` : `${timeRemaining} seconds`;
    new Notification("Parking Expiry Alert", {
      body: `Your parking session for WA8769Q will expire in ${label}. Tap to extend.`,
      icon: "/icon-192x192.png",
    });
  };

  useEffect(() => {
    if (!endTime || !isAlertSet) return;

    alerted30.current = false;
    alerted15.current = false;
    alerted10.current = false;
    alerted10Sec.current = false;
    alerted5Sec.current = false;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((result) => {
        if (result !== "granted") {
          console.warn("Parking expiry notifications are blocked or denied.");
        }
      });
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const effectiveEndTime = debugSeconds ? new Date(now.getTime() + 10000) : endTime;
      const diffMs = effectiveEndTime.getTime() - now.getTime();

      if (debugSeconds) {
        const diffSeconds = Math.floor(diffMs / 1000);

        if (diffSeconds <= 5 && diffSeconds >= 0 && !alerted5Sec.current) {
          alerted5Sec.current = true;
          sendPushNotification(5, "seconds");
        } else if (diffSeconds <= 10 && diffSeconds > 5 && !alerted10Sec.current) {
          alerted10Sec.current = true;
          sendPushNotification(10, "seconds");
        }
      } else {
        const diffMinutes = Math.floor(diffMs / 1000 / 60);

        if (diffMinutes <= 10 && diffMinutes >= 0 && !alerted10.current) {
          alerted10.current = true;
          sendPushNotification(10);
        } else if (diffMinutes <= 15 && diffMinutes > 10 && !alerted15.current) {
          alerted15.current = true;
          sendPushNotification(15);
        } else if (diffMinutes <= 30 && diffMinutes > 15 && !alerted30.current) {
          alerted30.current = true;
          sendPushNotification(30);
        }
      }
    }, debugSeconds ? 500 : 5000);

    return () => clearInterval(intervalId);
  }, [endTime, isAlertSet, debugSeconds]);
}
