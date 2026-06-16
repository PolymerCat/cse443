'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(true);

  const colors = {
    bgBlue: 'linear-gradient(180deg, #1d52b9 0%, #153c8b 100%)',
    orangeAccent: '#ff9000',
    textWhite: '#ffffff',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- SCREEN 1: SPLASH LAUNCHER ---
  if (isLaunching) {
    return (
      <div style={{
        background: colors.bgBlue,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 20px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '70px',
          background: `linear-gradient(135deg, ${colors.orangeAccent} 65%, transparent 65%)`
        }} />

        <div /> 

        {/* Center System Identifier Brand Context */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 2 }}>
          <img
            src="/launcher icon.png"
            alt="Penang Smart Parking Logo"
            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
          />
          <h2 style={{
            color: colors.textWhite,
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: '400',
            lineHeight: '1.4',
            maxWidth: '280px',
            margin: 0
          }}>
            Penang Island & Seberang Perai Smart Parking System
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 2 }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '40px'
          }} />
          
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '45px',
            background: colors.orangeAccent, transform: 'skewY(-3deg)', transformOrigin: 'bottom left'
          }} />
        </div>
      </div>
    );
  }

  // --- SCREEN 2: MAIN PORTAL INTERFACES SELECTION ---
  return (
    <div style={{
      background: colors.bgBlue,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        .btn-user {
          background-color: white !important;
          color: #153c8b !important;
          transition: all 0.2s ease;
        }
        .btn-user:hover {
          background-color: #f0f4ff !important;
          transform: translateY(-2px);
        }
        .btn-user:active {
          transform: translateY(1px);
        }
        .btn-jpj {
          background-color: ${colors.orangeAccent} !important;
          color: white !important;
          transition: all 0.2s ease;
        }
        .btn-jpj:hover {
          background-color: #e07f00 !important;
          transform: translateY(-2px);
        }
        .btn-jpj:active {
          transform: translateY(1px);
        }
      `}</style>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: `linear-gradient(135deg, ${colors.orangeAccent} 70%, transparent 70%)`,
        zIndex: 1
      }} />

      {/* Circular image structure protecting logo asset boundaries */}
      <div style={{
        width: '130px', height: '130px', backgroundColor: 'white', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', marginTop: '60px', zIndex: 2, boxSizing: 'border-box'
      }}>
        <img 
          src="/logo.png" 
          alt="Penang Smart Parking" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <h2 style={{ color: colors.textWhite, marginTop: '40px', fontWeight: '600', fontSize: '22px', letterSpacing: '0.5px' }}>
        Select Portal Access
      </h2>

      <div style={{ marginTop: '20px', width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
        <button 
          onClick={() => router.push('/dashboard')}
          className="btn-user"
          style={{
            width: '100%', padding: '16px', borderRadius: '30px', border: 'none',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Login as Car User
        </button>

        <button 
          onClick={() => router.push('/simulation')}
          className="btn-jpj"
          style={{
            width: '100%', padding: '16px', borderRadius: '30px', border: 'none',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Login as JPJ Officer
        </button>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
        background: colors.orangeAccent, transform: 'skewY(-3deg)', transformOrigin: 'bottom left'
      }} />
    </div>
  );
}