'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from "@/context/NotificationContext"; 

export default function Dashboard() {
  const router = useRouter();
  
  // 1. Pull the unread count AND the fines array from Global Context
  const { unreadCount, fines, setFines, parkingSession, setParkingSession } = useNotifications(); 

  const [walletBalance, setWalletBalance] = useState(64.20); 
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showCompoundModal, setShowCompoundModal] = useState(false);

  const colors = {
    bgOrangeGrad: 'linear-gradient(135deg, #ffb347 0%, #ff7b00 100%)',
    deepBlue: '#153c8b',
    lightBlue: '#0084ff',
    lightBlueBtn: '#0084ff',
    textBlack: '#000000',
    iconCircleBg: '#e8f0fe',
    textMuted: '#666666'
  };

  useEffect(() => {
    if (!parkingSession) {
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((new Date(parkingSession.endTime).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [parkingSession]);

  const isParkingActive = Boolean(parkingSession && secondsLeft > 0);
  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(value => String(value).padStart(2, "0")).join(":");
  };

  const handleReload = () => {
    setWalletBalance(prev => prev + 10.00);
  };

  const handlePayFine = (fineId: string, amount: number) => {
    if (walletBalance < amount) {
      alert("Insufficient eWallet balance to clear this compound ticket fine.");
      return;
    }
    setWalletBalance(prev => prev - amount);
    setFines(prevFines => prevFines.filter(f => f.id !== fineId));
  };

  const handleClearSession = () => {
    setParkingSession(null);
  };

  const menuItems = [
    { label: "Find Parking", icon: "📍", action: null },
    { label: "Park N Pay", icon: "🅿️", action: () => router.push('/parknpay') }, 
    { label: "Compound", icon: "📄", action: () => setShowCompoundModal(true) },
    { label: "Monthly Pass", icon: "🎟️", action: null },
    { label: "Change Council", icon: "🏛️", action: null },
    { label: "History", icon: "📜", action: null },
    { label: "Register Vehicle", icon: "🚗", action: null },
    { label: "Message", icon: "✉️", action: null },
    { label: "Transfer", icon: "📲", action: null },
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      height: '100vh',
      maxHeight: '100vh',
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 4px 25px rgba(0,0,0,0.1)'
    }}>
      
      <style>{`
        .action-btn-clickable { transition: all 0.2s ease; cursor: pointer; }
        .action-btn-clickable:hover { opacity: 0.9; transform: scale(1.02); }
        .action-btn-clickable:active { transform: scale(0.98); }
        .menu-item-shell { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justifyContent: flex-start; 
          text-align: center;
          padding: 5px;
        }
      `}</style>

      {/* --- SECTION 1: TOP PROFILE & EWALLET HEADER --- */}
      <div style={{
        background: colors.bgOrangeGrad,
        padding: '25px 20px 30px 20px',
        position: 'relative',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px'
      }}>
        <div style={{
          position: 'absolute', top: '15px', left: '20px',
          width: '55px', height: '55px', backgroundColor: '#ffffff',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)', padding: '6px', boxSizing: 'border-box'
        }}>
          <img 
            src="/bandaraya_logo.png" 
            alt="Council Crest" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* NOTIFICATION BELL */}
        <div 
          onClick={() => router.push('/notification')}
          className="action-btn-clickable"
          style={{
            position: 'absolute', top: '20px', right: '20px',
            padding: '8px', zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          
          {/* Badge now reads dynamically from Context! */}
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '-2px', right: '-2px',
              backgroundColor: '#e65100', color: 'white', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
              border: '2px solid #ff7b00'
            }}>
              {unreadCount}
            </div>
          )}
        </div>

        {/* Profile Circle Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '60px' }}>
          <div className="action-btn-clickable" style={{
            width: '55px', height: '55px', backgroundColor: colors.deepBlue,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#ffffff"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: '13px', fontWeight: '600', marginTop: '6px', marginLeft: '8px' }}>
            Profile
          </span>
        </div>

        {/* eWallet Container */}
        <div style={{
          position: 'absolute', right: '20px', bottom: '25px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '200px'
        }}>
          <span style={{ color: colors.deepBlue, fontSize: '14px', fontWeight: '700', marginBottom: '2px', marginRight: '8px' }}>
            eWallet Balance
          </span>
          <span style={{ color: colors.deepBlue, fontSize: '28px', fontWeight: '800', marginBottom: '2px', marginRight: '8px' }}>
            RM {walletBalance.toFixed(2)}
          </span>
          <button 
            onClick={handleReload}
            className="action-btn-clickable"
            style={{
              backgroundColor: colors.lightBlueBtn, color: 'white', border: 'none',
              borderRadius: '20px', padding: '8px 45px', fontWeight: 'bold',
              fontSize: '14px', boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
            }}
          >
            Reload
          </button>
        </div>
      </div>

      {/* --- SECTION 2: RUNNING BANNER --- */}
      {parkingSession && (
        <div style={{
          backgroundColor: '#e3f2fd', padding: '12px 20px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bbdefb'
        }}>
          <div>
            <span style={{ color: '#0d47a1', fontWeight: '700', fontSize: '13px' }}>
              {isParkingActive ? 'Active parking session' : 'Parking session expired'}
            </span>
            <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
              {parkingSession.plate} at {parkingSession.location}
            </div>
          </div>
          <button
            onClick={handleClearSession}
            title="Clear demo parking session"
            style={{ background: 'none', border: 'none', color: isParkingActive ? 'red' : '#c62828', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
          >
            {isParkingActive ? formatCountdown(secondsLeft) : 'Late'}
          </button>
        </div>
      )}

      {/* --- SECTION 3: RE-CONFIGURED GRID --- */}
      <div style={{
        padding: '24px 12px 10px 12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: '20px',
        columnGap: '8px'
      }}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            onClick={item.action ? item.action : () => alert(`${item.label} is an unmapped structural placeholder container.`)}
            className="menu-item-shell action-btn-clickable" 
            style={{ opacity: item.action ? 1 : 0.6 }}
          >
            <div style={{
              width: '52px', height: '52px', backgroundColor: colors.iconCircleBg,
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', marginBottom: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              boxSizing: 'border-box'
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', color: colors.textBlack,
              lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden', height: '26px'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, backgroundColor: '#ffffff' }} />

      {/* --- SECTION 4: OUTBOUND PORTAL REDIRECT --- */}
      <div style={{ 
        backgroundColor: '#ffffff', position: 'relative', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 25px 30px 0'
      }}>
        <button 
          onClick={() => router.push('/')}
          className="action-btn-clickable"
          style={{
            background: 'none', border: 'none', color: '#757575', fontSize: '14px',
            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>

      {/* --- COMPOUND POPUP MODAL --- */}
      {showCompoundModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 101, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', width: '90%', maxHeight: '70%', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'red' }}>📄 Active Compounds</h3>
              <button onClick={() => setShowCompoundModal(false)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, minHeight: '150px' }}>
              {fines.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>No outstanding compounds found.</p>
              ) : (
                fines.map(fine => (
                  <div key={fine.id} style={{ padding: '12px', border: '1px solid #ffcdd2', backgroundColor: '#ffebee', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#c62828' }}>{fine.id} ({fine.type})</p>
                      <span style={{ fontSize: '12px', color: '#555' }}>📍 {fine.location}</span>
                    </div>
                    <button 
                      onClick={() => handlePayFine(fine.id, fine.amount)}
                      style={{ backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '15px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Pay RM {fine.amount.toFixed(2)}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
