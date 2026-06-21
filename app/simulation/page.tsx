'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from "@/context/NotificationContext";

export default function JpjSimulation() {
  const [plate, setPlate] = useState('');
  const router = useRouter();
  const { parkingSession } = useNotifications();

  const colors = {
    bgBlue: 'linear-gradient(180deg, #1d52b9 0%, #153c8b 100%)',
    orangeAccent: '#ff9000',
    textWhite: '#ffffff',
  };

  const calculateFine = (licensePlate: string) => {
    if (!parkingSession || parkingSession.plate !== licensePlate) {
      return {
        type: 'No Active Parking Record',
        amount: 50.00,
        details: 'No paid parking session found for this vehicle.'
      };
    }

    const lateMinutes = Math.max(0, Math.ceil((Date.now() - new Date(parkingSession.endTime).getTime()) / 60000));

    if (lateMinutes === 0) {
      return null;
    }

    return {
      type: 'Expired Ticket',
      amount: Math.min(50, 10 + lateMinutes * 2),
      details: `${lateMinutes} minute${lateMinutes === 1 ? '' : 's'} late.`
    };
  };

  const handleCalculatedFine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plate) return alert('Please input vehicle plate alignment context.');

    const licensePlate = plate.toUpperCase();
    const fine = calculateFine(licensePlate);

    if (!fine) {
      alert(`${licensePlate} still has valid parking. No fine issued.`);
      return;
    }

    const response = await fetch('/api/fine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licensePlate,
        location: parkingSession?.location ?? 'Lebuh Chulia',
        type: fine.type,
        amount: fine.amount,
      })
    });

    if (response.ok) {
      alert(`Fine issued to ${licensePlate}: RM ${fine.amount.toFixed(2)} (${fine.details})`);
      setPlate('');
    }
  };

  return (
    <div style={{
      background: colors.bgBlue,
      height: '100vh',
      maxHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Added explicit placeholder color configuration */}
      <style>{`
        .back-nav-btn {
          background: none; border: none; color: white; fontSize: 24px; cursor: pointer; transition: opacity 0.2s;
          position: absolute; left: 20px; top: 20px; zIndex: 3;
        }
        .back-nav-btn:hover { opacity: 0.7; }
        
        .btn-submit-fine {
          width: 100%; padding: 16px; border-radius: 30px; border: none;
          font-size: 16px; font-weight: bold; cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          background-color: ${colors.orangeAccent} !important;
          color: white !important;
          transition: all 0.2s ease;
          padding: 16px 0;
          margin-bottom: 20px;
        }
        .btn-submit-fine:hover {
          background-color: #e07f00 !important;
          transform: translateY(-2px);
        }
        .btn-submit-fine:active {
          transform: translateY(1px);
        }

        .btn-back-link {
          background: none;
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        .btn-back-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        /* Targets placeholder visibility uniformly */
        .plate-input::placeholder {
          color: #757575 !important;
          opacity: 1;
        }
      `}</style>

      {/* Top Angled Accent Block Decoration */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: `linear-gradient(135deg, ${colors.orangeAccent} 70%, transparent 70%)`,
        zIndex: 1
      }} />

      {/* Matching Circular Brand Logo Container */}
      <div style={{
        width: '130px', height: '130px', backgroundColor: 'white', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', marginTop: '40px', zIndex: 2, boxSizing: 'border-box'
      }}>
        <img 
          src="/logo.png" 
          alt="Penang Smart Parking" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Title Subhead */}
      <h2 style={{ color: colors.textWhite, marginTop: '10px', fontWeight: '600', fontSize: '22px', letterSpacing: '0.5px', textAlign: 'center' }}>
        JPJ Fining Simulation
      </h2>
      <p style={{ color: colors.textWhite, fontSize: '13px', opacity: 0.8, marginTop: '4px', marginBottom: '24px', textAlign: 'center', maxWidth: '300px', lineHeight: '1.4' }}>
        This is a simulation interface for JPJ officers to issue parking fines. Enter a license plate number to broadcast a real-time notification.
      </p>

      {/* Simulation Controller Card */}
      <div style={{ width: '100%', maxWidth: '340px', zIndex: 2 }}>
        <form onSubmit={handleCalculatedFine} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input 
            type="text"
            value={plate} 
            onChange={(e) => setPlate(e.target.value)} 
            placeholder="Enter license plate"
            className="plate-input"
            style={{
              width: '100%', padding: '16px', borderRadius: '30px',
              border: 'none', fontSize: '16px', fontWeight: '500',
              boxSizing: 'border-box', marginBottom: '20px',
              textAlign: 'center', letterSpacing: '1px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff', color: '#000000', outline: 'none'
            }}
          />

          <button type="submit" className="btn-submit-fine">
            Issue Fine
          </button>

          {/* Minimalist back navigation link reference context option */}
          <button type="button" onClick={() => router.push('/')} className="btn-back-link">
            Back to Portal
          </button>
        </form>
      </div>

      {/* Bottom Orange Accent Footer Geometry Decoration */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
        background: colors.orangeAccent, transform: 'skewY(-3deg)', transformOrigin: 'bottom left'
      }} />
    </div>
  );
}
