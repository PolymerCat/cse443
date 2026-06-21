"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import { useNotifications } from "@/context/NotificationContext";

export default function ParkNPay() {
  const router = useRouter(); // ROUTER ACCESS INJECTED
  const { setParkingSession } = useNotifications();
  const [isOneDayPark, setIsOneDayPark] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const handleToggleAlert = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const GLBNotification = (globalThis as any).Notification;
      if (GLBNotification && GLBNotification.permission === "default") {
        await GLBNotification.requestPermission();
      }
    }
    setIsAlertSet(!isAlertSet);
  };

  useEffect(() => {
    const timer = setTimeout(() => setCurrentTime(new Date()), 0);
    return () => clearTimeout(timer);
  }, []);

  const parkingTimes = useMemo(() => {
    if (!currentTime) return { startStr: "--:--", endStr: "--:--", endDate: null };

    const start = new Date(currentTime);
    const START_HOUR = 8;
    const END_HOUR = 18; 

    if (start.getHours() >= END_HOUR) {
      start.setDate(start.getDate() + 1);
      start.setHours(START_HOUR, 0, 0, 0);
    } else if (start.getHours() < START_HOUR) {
      start.setHours(START_HOUR, 0, 0, 0);
    }

    const end = new Date(start);

    if (isOneDayPark) {
      end.setHours(END_HOUR, 0, 0, 0);
    } else {
      end.setHours(end.getHours() + hours);
      end.setMinutes(end.getMinutes() + minutes);

      const maxEnd = new Date(start);
      maxEnd.setHours(END_HOUR, 0, 0, 0);

      if (end > maxEnd) {
        end.setTime(maxEnd.getTime());
      }
    }

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const isStartNextDay = start.getDate() !== currentTime.getDate();
    const isEndNextDay = end.getDate() !== start.getDate() || isStartNextDay;

    return {
      startStr: formatTime(start) + (isStartNextDay ? " (Next day)" : ""),
      endStr: formatTime(end) + (isEndNextDay ? " (Next day)" : ""),
      endDate: end
    };
  }, [currentTime, hours, minutes, isOneDayPark]);
  
  const totalCost = useMemo(() => {
    if (isOneDayPark) return "9.00";
    const cost = (hours * 1.20) + ((minutes / 60) * 1.20);
    return cost.toFixed(2);
  }, [hours, minutes, isOneDayPark]);

  const durationString = useMemo(() => {
    if (isOneDayPark) return "1 Day";
    let str = "";
    if (hours > 0) str += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) str += `${minutes} minutes`;
    if (hours === 0 && minutes === 0) str = "0 minutes";
    return str.trim();
  }, [hours, minutes, isOneDayPark]);

  const handleAddMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMinutes = minutes + 30;
    if (newMinutes >= 60) {
      setHours(hours + 1);
      setMinutes(newMinutes - 60);
    } else {
      setMinutes(newMinutes);
    }
  };

  const handleSubMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMinutes = minutes - 30;
    if (newMinutes < 0) {
      if (hours > 0) {
        setHours(hours - 1);
        setMinutes(newMinutes + 60);
      } else {
        setMinutes(0);
      }
    } else {
      setMinutes(newMinutes);
    }
  };

  const handleConfirm = () => {
    if (!parkingTimes.endDate) return;

    setParkingSession({
      plate: "WA8769Q",
      location: "Lebuh Chulia",
      startTime: new Date().toISOString(),
      endTime: parkingTimes.endDate.toISOString(),
      durationLabel: durationString,
      paidAmount: Number(totalCost),
      isOneDayPark,
      isAlertSet,
    });

    setShowConfirmModal(false);
    setShowSuccessModal(true);
    setShowNotification(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setShowNotification(false);
    router.push('/dashboard'); // Route back to the master workspace upon ticket allocation
  };

  return (
    <div className="h-[100dvh] w-full bg-gray-50 md:bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
      
      <div className="w-full max-w-xl h-full bg-white shadow-none md:shadow-2xl flex flex-col relative overflow-hidden">
        
        <Notification 
          show={showNotification} 
          onClose={() => setShowNotification(false)} 
        />

        {/* --- HEADER --- */}
        <header className="bg-gradient-to-b from-orange-400 to-orange-500 pt-6 pb-6 shrink-0 md:rounded-b-none z-10 shadow-sm">
          <div className="flex items-center px-4 mb-4 text-white">
            {/* BACK ROUTE TRIGGER LINK AT TOP LEFT CONTAINER EDGE */}
            <button onClick={() => router.push('/dashboard')} className="text-2xl font-bold font-mono active:opacity-70">{"<"}</button>
            <h1 className="flex-1 text-center text-lg font-medium pr-6 text-blue-950">
              Park N Pay
            </h1>
          </div>
          
          <div className="flex items-center justify-center md:justify-start px-6 gap-5">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm p-1.5">
              <img src="/bandaraya_logo.png" alt="Crest Logo" className="w-full height-full object-contain" />
            </div>
            <h2 className="text-blue-900 font-medium text-lg leading-tight">
              City Council Of Penang<br />Island
            </h2>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 min-h-0 overflow-y-auto px-5 py-8 flex flex-col items-center">
          
          <button className="bg-gradient-to-r from-blue-700 to-blue-400 text-white px-10 py-2 rounded-md font-medium text-lg mb-2 shadow-sm w-full max-w-sm shrink-0">
            Select Vehicle
          </button>
          <p className="text-gray-500 tracking-wide mb-8 shrink-0">
            WA8769Q - PERODUA AXIA
          </p>

          <div className="w-full max-w-md flex flex-col items-center flex-1">
            <h3 className="text-blue-900 font-medium text-xl mb-4 self-start">
              Parking Duration
            </h3>

            <div
              className={`w-full border rounded-2xl p-4 flex justify-between items-center mb-4 cursor-pointer transition-colors shadow-sm shrink-0 ${
                isOneDayPark ? "border-blue-900 bg-blue-50/30" : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setIsOneDayPark(!isOneDayPark)}
            >
              <span className="text-gray-800 font-medium text-lg">One day park (RM 9.00)</span>
              <div className="flex items-center border border-gray-300 rounded-full w-12 h-6 px-0.5 bg-white shrink-0">
                <div
                  className={`w-4 h-4 rounded-full transform transition-transform duration-100 ${
                    isOneDayPark ? "bg-green-600 translate-x-6" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>

            <div className="text-black font-semibold text-sm mb-4 shrink-0">OR</div>

            <div
              className={`w-full border rounded-2xl px-4 py-6 flex flex-col items-center mb-8 cursor-pointer transition-colors shadow-sm shrink-0 ${
                !isOneDayPark ? "border-blue-900 bg-blue-50/30" : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setIsOneDayPark(false)}
            >
              <div className="text-center mb-8 text-gray-800">
                <span className="block font-medium text-xl">Hourly</span>
                <span className="text-sm text-gray-500">(RM 1.20 per hour)</span>
              </div>

              <div className={`flex gap-10 w-full justify-center mb-8 transition-opacity duration-300 ${isOneDayPark ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-600 border-b-2 border-gray-300 mb-3 px-4 pb-1">Hour</span>
                  <span className="text-3xl font-medium mb-3">{hours}</span>
                  <div className="flex rounded-xl overflow-hidden border border-blue-600 shadow-sm">
                    <button onClick={(e) => { e.stopPropagation(); setHours(Math.max(0, hours - 1)); }} className="w-14 h-12 text-white bg-gradient-to-b from-blue-600 to-blue-500 font-bold text-2xl border-r border-blue-800 active:opacity-80 transition-opacity">-</button>
                    <button onClick={(e) => { e.stopPropagation(); setHours(hours + 1); }} className="w-14 h-12 text-white bg-gradient-to-b from-blue-500 to-blue-400 font-bold text-2xl active:opacity-80 transition-opacity">+</button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-600 border-b-2 border-gray-300 mb-3 px-2 pb-1">Minutes</span>
                  <span className="text-3xl font-medium mb-3">{minutes === 0 ? "00" : minutes}</span>
                  <div className="flex rounded-xl overflow-hidden border border-blue-600 shadow-sm">
                    <button onClick={handleSubMinutes} className="w-14 h-12 text-white bg-gradient-to-b from-blue-600 to-blue-500 font-bold text-2xl border-r border-blue-800 active:opacity-80 transition-opacity">-</button>
                    <button onClick={handleAddMinutes} className="w-14 h-12 text-white bg-gradient-to-b from-blue-500 to-blue-400 font-bold text-2xl active:opacity-80 transition-opacity">+</button>
                  </div>
                </div>
              </div>

              <div className="text-gray-600 font-medium text-lg">
                End Time <span className="text-black font-semibold ml-2">{parkingTimes.endStr}</span>
              </div>
            </div>

            <div className="w-full flex justify-between items-center mb-10 px-2 shrink-0">
              <span className="text-gray-700 font-medium text-lg">Set expiry alert</span>
              <button onClick={handleToggleAlert} className={`flex items-center rounded-full w-12 h-6 px-0.5 transition-colors ${isAlertSet ? "bg-gray-300" : "bg-gray-200"}`}>
                <div className={`w-5 h-5 rounded-full transform transition-transform duration-100 shadow-sm ${isAlertSet ? "bg-green-600 translate-x-6" : "bg-white"}`} />
              </button>
            </div>

            <button 
              onClick={() => setShowConfirmModal(true)}
              className="w-full max-w-xs mt-auto mb-6 bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-full py-3.5 font-medium text-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
            >
              OK
            </button>
          </div>
        </main>

        {/* --- CONFIRMATION MODAL --- */}
        {showConfirmModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm animate-in fade-in zoom-in duration-200">
              <div className="text-gray-800 space-y-2 mb-8 text-lg">
                <p className="font-semibold text-xl mb-4 text-center">Details of parking</p>
                <p><span className="font-medium text-gray-500">Council:</span> MBPP</p>
                <p><span className="font-medium text-gray-500">Vehicle:</span> WA8769Q</p>
                <p><span className="font-medium text-gray-500">Time:</span> {parkingTimes.startStr} - {parkingTimes.endStr}</p>
                <p>
                  <span className="font-medium text-gray-500">Duration:</span> {isOneDayPark ? "1 Day" : `${hours} Hour ${minutes} Minutes`}
                </p>
                <p><span className="font-medium text-gray-500">Pay Type:</span> {isOneDayPark ? "One Day Pass" : "Hourly"}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-medium text-base hover:bg-gray-50 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium text-base shadow-md hover:opacity-90 transition-opacity"
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SUCCESS MODAL --- */}
        {showSuccessModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-in fade-in zoom-in duration-200 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <div className="text-gray-800 mb-8 text-lg leading-relaxed">
                <p>
                  <span className="font-semibold">{durationString}</span> parking ends at <span className="font-semibold">{parkingTimes.endStr}</span>.
                </p>
                <p className="mt-2">
                  <span className="font-semibold">RM {totalCost}</span> has been charged for vehicle: <span className="font-semibold">WA8769Q</span>.
                </p>
                <p className="mt-4 text-gray-500 font-medium">Thank you!</p>
              </div>

              <button 
                onClick={handleCloseSuccess}
                className="w-full max-w-[200px] py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium text-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
