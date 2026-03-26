import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function generateRoomId(convId) {
  return `${convId}-${btoa(String(convId)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#C04E10,#E8621A)',
  'linear-gradient(135deg,#7C2D12,#C2410C)',
  'linear-gradient(135deg,#92400E,#D97706)',
  'linear-gradient(135deg,#1C1917,#57534E)',
  'linear-gradient(135deg,#1E3A5F,#2563EB)',
];

function initials(name) {
  return (name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' });
}

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const pollRef = useRef(null);
  const prevMsgCount = useRef(0);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadConversations();
  }, []);

  // Auto-open conversation from URL param
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId && conversations.length > 0) {
      const found = conversations.find(c => String(c.conversation_id) === convId);
      if (found) selectConversation(found);
    }
  }, [conversations, searchParams]);

  // Poll messages
  useEffect(() => {
    if (selectedConv) {
      pollRef.current = setInterval(() => loadMessages(selectedConv.conversation_id, true), 10000);
    }
    return () => clearInterval(pollRef.current);
  }, [selectedConv]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

  // Load Jitsi script
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) { setJitsiLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Init Jitsi when call starts
  useEffect(() => {
    if (!activeCall || !jitsiLoaded || !jitsiContainerRef.current) return;
    if (jitsiApiRef.current) jitsiApiRef.current.dispose();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    jitsiApiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName: 'BahunCom-' + activeCall.roomId,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: { displayName: userData.full_name || 'User' },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: activeCall.type === 'voice',
        disableDeepLinking: true,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        MOBILE_APP_PROMO: false,
      },
    });
    jitsiApiRef.current.addEventListener('readyToClose', () => {
      jitsiApiRef.current.dispose();
      setActiveCall(null);
    });
    return () => {
      if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); jitsiApiRef.current = null; }
    };
  }, [activeCall, jitsiLoaded]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`${BASE}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    } catch (err) { console.error(err); }
    finally { setLoadingConvs(false); }
  };

  const loadMessages = async (convId, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const res = await fetch(`${BASE}/api/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(prev => {
          if (prev.length !== data.length ||
            (data.length > 0 && prev[prev.length - 1]?.message_id !== data[data.length - 1]?.message_id)) {
            return data;
          }
          return prev;
        });
      }
    } catch (err) { console.error(err); }
    finally { if (!silent) setLoadingMsgs(false); }
  };

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    loadMessages(conv.conversation_id);
    setConversations(prev => prev.map(c =>
      c.conversation_id === conv.conversation_id ? { ...c, unread_count: 0 } : c
    ));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage('');
    const optimistic = { message_id: Date.now(), text, sender_role: userType, created_at: new Date().toISOString(), optimistic: true };
    setMessages(prev => [...prev, optimistic]);
    try {
      await fetch(`${BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, conversation_id: selectedConv.conversation_id })
      });
      loadMessages(selectedConv.conversation_id, true);
      loadConversations();
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => !m.optimistic));
      setNewMessage(text);
    } finally { setSending(false); }
  };

  const startCall = async (type) => {
    const roomId = generateRoomId(selectedConv.conversation_id) + (type === 'voice' ? '-voice' : '');
    const link = window.location.origin + '/call/' + roomId + '?with=' + encodeURIComponent(selectedConv.other_name);
    const emoji = type === 'voice' ? '📞' : '📹';
    const label = type === 'voice' ? 'Voice' : 'Video';
    await fetch(`${BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: `${emoji} ${label} Call started! Join here: ${link}`, conversation_id: selectedConv.conversation_id })
    });
    loadMessages(selectedConv.conversation_id, true);
    setActiveCall({ roomId, type });
  };

  const endCall = () => {
    if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); jitsiApiRef.current = null; }
    setActiveCall(null);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filtered = conversations.filter(c =>
    (c.other_name || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalUnread = conversations.reduce((sum, c) => sum + (Number(c.unread_count) || 0), 0);

  return (
    <div style={{ height: '100vh', background: '#FDFBF7', fontFamily: "'Inter',sans-serif", display: 'flex', flexDirection: 'column', paddingTop: 64 }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        .conv-item { transition: background 0.15s; cursor: pointer; }
        .conv-item:hover { background: rgba(249,115,22,0.04) !important; }
        .conv-item.active { background: rgba(249,115,22,0.08) !important; border-right: 3px solid #f97316; }
        .send-btn:hover { background: #ea580c !important; transform: scale(1.05); }
        .send-btn { transition: all 0.15s; }
        .msg-input:focus { outline: none; border-color: rgba(249,115,22,0.4) !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 3px; }
      `}</style>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 320, borderRight: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', background: '#F8F5F0', flexShrink: 0 }}>
          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1A0F00', margin: 0 }}>
                Messages
                {totalUnread > 0 && (
                  <span style={{ background: '#f97316', color: '#fff', fontSize: 11, borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8, fontWeight: 700 }}>
                    {totalUnread}
                  </span>
                )}
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9B7355', fontSize: 13 }}></i>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
                style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '9px 12px 9px 34px', fontSize: 13, background: '#fff', boxSizing: 'border-box', color: '#374151' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConvs ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#9B7355', fontSize: 13 }}>
                <div className="spinner-border spinner-border-sm" style={{ color: '#f97316' }}></div>
                <p style={{ marginTop: 8 }}>Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 8 }}>💬</div>
                <p style={{ color: '#9B7355', fontSize: 13 }}>No conversations yet</p>
                {userType === 'user' && (
                  <button onClick={() => navigate('/pandits')}
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                    Find a Pandit
                  </button>
                )}
              </div>
            ) : (
              filtered.map(conv => {
                const isActive = selectedConv?.conversation_id === conv.conversation_id;
                const avatarBg = AVATAR_COLORS[conv.other_id % AVATAR_COLORS.length];
                return (
                  <div key={conv.conversation_id} className={`conv-item ${isActive ? 'active' : ''}`}
                    onClick={() => selectConversation(conv)}
                    style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                        {initials(conv.other_name)}
                      </div>
                      <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid #F8F5F0' }}></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#1A0F00' }}>{conv.other_name}</span>
                        <span style={{ fontSize: 11, color: '#9B7355', flexShrink: 0, marginLeft: 4 }}>{timeAgo(conv.last_message_time)}</span>
                      </div>
                      {conv.specialization && <p style={{ fontSize: 11, color: '#f97316', margin: '0 0 2px', fontWeight: 500 }}>{conv.specialization.split(',')[0].trim()}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 12, color: '#9B7355', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                          {conv.last_message || 'Start a conversation'}
                        </p>
                        {Number(conv.unread_count) > 0 && (
                          <span style={{ background: '#f97316', color: '#fff', fontSize: 10, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-comments" style={{ fontSize: 32, color: '#f97316', opacity: 0.5 }}></i>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#1A0F00', margin: 0 }}>Select a conversation</h3>
              <p style={{ color: '#9B7355', fontSize: 14, margin: 0 }}>Choose a conversation from the left to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: AVATAR_COLORS[selectedConv.other_id % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {initials(selectedConv.other_name)}
                    </div>
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }}></div>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#1A0F00', margin: 0, fontSize: 15 }}>{selectedConv.other_name}</h3>
                    <p style={{ color: '#22C55E', margin: 0, fontSize: 12, fontWeight: 500 }}>Online</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => navigate(`/pandits/${selectedConv.other_id}`)}
                    style={{ background: 'rgba(249,115,22,0.08)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    View Profile
                  </button>
                  <button title="Voice Call" onClick={() => startCall('voice')}
                    style={{ background: activeCall?.type === 'voice' ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.08)', color: '#166534', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <i className="fas fa-phone" style={{ fontSize: 14 }}></i>
                  </button>
                  <button title="Video Call" onClick={() => startCall('video')}
                    style={{ background: activeCall?.type === 'video' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)', color: '#1D4ED8', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <i className="fas fa-video" style={{ fontSize: 14 }}></i>
                  </button>
                  {activeCall && (
                    <button title="End Call" onClick={endCall}
                      style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <i className="fas fa-phone-slash" style={{ fontSize: 14 }}></i>
                    </button>
                  )}
                </div>
              </div>

              {/* ── JITSI CALL PANEL ── */}
              {activeCall && (
                <div style={{ position: 'relative', height: 380, background: '#1A0F00', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }}></div>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }}></div>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>
                        {activeCall.type === 'voice' ? '📞' : '📹'} {activeCall.type === 'voice' ? 'Voice' : 'Video'} Call with {selectedConv.other_name}
                      </span>
                    </div>
                    <button onClick={endCall}
                      style={{ background: '#DC2626', border: 'none', borderRadius: 6, padding: '4px 12px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      <i className="fas fa-phone-slash me-1"></i>End
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FDFBF7' }}>
                {loadingMsgs ? (
                  <div style={{ textAlign: 'center', padding: 32, color: '#9B7355' }}>
                    <div className="spinner-border spinner-border-sm" style={{ color: '#f97316' }}></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32 }}>
                    <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 8 }}>🙏</div>
                    <p style={{ color: '#9B7355', fontSize: 14 }}>No messages yet. Say Namaste!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.sender_role === userType;
                    const showTime = idx === 0 || new Date(msg.created_at) - new Date(messages[idx - 1]?.created_at) > 300000;
                    return (
                      <div key={msg.message_id || idx}>
                        {showTime && (
                          <div style={{ textAlign: 'center', marginBottom: 8 }}>
                            <span style={{ background: 'rgba(0,0,0,0.06)', color: '#9B7355', fontSize: 11, borderRadius: 100, padding: '3px 12px' }}>
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                          {!isMine && (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: AVATAR_COLORS[selectedConv.other_id % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
                              {initials(selectedConv.other_name)}
                            </div>
                          )}
                          <div style={{ maxWidth: '65%' }}>
                            <div style={{
                              background: isMine ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#fff',
                              color: isMine ? '#fff' : '#1A0F00',
                              borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                              padding: '11px 16px', fontSize: 14, lineHeight: 1.5,
                              boxShadow: isMine ? '0 4px 12px rgba(249,115,22,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                              border: isMine ? 'none' : '1px solid rgba(0,0,0,0.06)',
                              opacity: msg.optimistic ? 0.7 : 1
                            }}>
                              {msg.text}
                            </div>
                            <div style={{ fontSize: 10, color: '#9B7355', marginTop: 4, textAlign: isMine ? 'right' : 'left', paddingLeft: isMine ? 0 : 4, paddingRight: isMine ? 4 : 0 }}>
                              {formatTime(msg.created_at)}
                              {isMine && <i className="fas fa-check-double ms-1" style={{ color: '#22C55E', fontSize: 10 }}></i>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.08)', background: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <textarea className="msg-input" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKey} placeholder="Type your message..." rows={1}
                    style={{ flex: 1, border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '12px 16px', fontSize: 14, resize: 'none', fontFamily: 'Inter', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }} />
                  <button className="send-btn" onClick={sendMessage} disabled={sending || !newMessage.trim()}
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5, flexShrink: 0 }}>
                    <i className="fas fa-paper-plane" style={{ fontSize: 16 }}></i>
                  </button>
                </div>
                <p style={{ fontSize: 11, color: '#9B7355', margin: '6px 0 0' }}>Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}