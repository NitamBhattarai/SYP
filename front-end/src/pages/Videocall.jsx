// 

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

export default function VideoCall() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startCall, setStartCall] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const displayName = userData.full_name || 'Guest';

  const partnerName = searchParams.get('with') || 'User';
  const isCaller = searchParams.get('caller') === 'true';

  // Load Jitsi script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (apiRef.current) apiRef.current.dispose();
      document.body.removeChild(script);
    };
  }, []);

  // Auto start if caller
  useEffect(() => {
    if (isCaller) {
      setStartCall(true);
    }
  }, [isCaller]);

  // Initialize Jitsi ONLY when startCall = true
  useEffect(() => {
    if (!startCall || !window.JitsiMeetExternalAPI) return;

    initJitsi();
  }, [startCall]);

  const initJitsi = () => {
    if (!jitsiRef.current) return;

    setLoading(true);

    const domain = 'meet.jit.si';

    const options = {
      roomName: `BahunCom-${roomId.trim()}`,
      width: '100%',
      height: '100%',
      parentNode: jitsiRef.current,
      userInfo: { displayName },

      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
      },

      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_BACKGROUND: '#1A0F00',
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    apiRef.current.addEventListener('videoConferenceJoined', () => {
      setJoined(true);
      setLoading(false);
    });

    apiRef.current.addEventListener('readyToClose', () => {
      navigate(-1);
    });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/call/${roomId}?with=${displayName}&caller=false`;
    navigator.clipboard.writeText(link);
    alert('Link copied!');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1A0F00',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* 🔴 Incoming Call Screen (ONLY for receiver) */}
      {!startCall && !isCaller && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#1A0F00',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <h2 style={{ color: '#fff' }}>Incoming Call</h2>
          <p style={{ color: '#aaa' }}>{partnerName} is calling...</p>

          <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
            <button
              onClick={() => setStartCall(true)}
              style={{
                background: '#22C55E',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Join
            </button>

            <button
              onClick={() => navigate(-1)}
              style={{
                background: '#DC2626',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* 🔝 Top Bar */}
      <div style={{
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between',
        background: '#000'
      }}>
        <span style={{ color: '#fff' }}>
          Call with {partnerName}
        </span>

        <div>
          <button onClick={copyLink}>Copy Link</button>
          <button onClick={() => navigate(-1)}>End</button>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff'
        }}>
          Connecting...
        </div>
      )}

      {/* 🎥 Jitsi Container */}
      <div ref={jitsiRef} style={{ flex: 1 }} />
    </div>
  );
}