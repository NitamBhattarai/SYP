import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NotificationBell({ isDark = false }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const pollRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetchUnread();
    pollRef.current = setInterval(fetchUnread, 15000);
    return () => clearInterval(pollRef.current);
  }, [token]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await fetch(`${BASE}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.count !== undefined) setUnread(data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleOpen = () => {
    if (!open) fetchNotifications();
    setOpen(!open);
  };

  const markAllRead = async () => {
    try {
      await fetch(`${BASE}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch {}
  };

  const handleClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await fetch(`${BASE}/api/notifications/${notif.notification_id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnread(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n =>
          n.notification_id === notif.notification_id ? { ...n, is_read: 1 } : n
        ));
      } catch {}
    }
    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  const deleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`${BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.notification_id !== id));
    } catch {}
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(dateStr).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' });
  };

  if (!token) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}
      >
        <i className="fas fa-bell" style={{ fontSize: 20, color: open ? '#f97316' : '#555' }}></i>
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 2, right: 2, background: '#f97316', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, width: 360, background: '#fff', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.08)', zIndex: 9999, overflow: 'hidden', marginTop: 8 }}>
          {/* Header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6 style={{ fontWeight: 700, color: '#1A0F00', margin: 0, fontSize: 15 }}>
              Notifications {unread > 0 && <span style={{ background: '#f97316', color: '#fff', fontSize: 10, borderRadius: 20, padding: '2px 7px', marginLeft: 6, fontWeight: 700 }}>{unread}</span>}
            </h6>
            {unread > 0 && (
              <button onClick={markAllRead}
                style={{ background: 'none', border: 'none', color: '#f97316', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#9B7355' }}>
                <div className="spinner-border spinner-border-sm" style={{ color: '#f97316' }}></div>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 8 }}>🔔</div>
                <p style={{ color: '#9B7355', fontSize: 14, margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.notification_id}
                  onClick={() => handleClick(n)}
                  style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)', background: n.is_read ? '#fff' : 'rgba(249,115,22,0.04)', cursor: n.link ? 'pointer' : 'default', display: 'flex', gap: 12, alignItems: 'flex-start', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.is_read ? '#fff' : 'rgba(249,115,22,0.04)'}
                >
                  {/* Unread dot */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? 'transparent' : '#f97316', flexShrink: 0, marginTop: 6 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: n.is_read ? 500 : 700, color: '#1A0F00', fontSize: 13, marginBottom: 3 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5, marginBottom: 4 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: '#9B7355' }}>{timeAgo(n.created_at)}</div>
                  </div>
                  <button onClick={e => deleteNotif(e, n.notification_id)}
                    style={{ background: 'none', border: 'none', color: '#9B7355', cursor: 'pointer', fontSize: 12, padding: 2, flexShrink: 0, opacity: 0.5 }}>✕</button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9B7355', fontSize: 12, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}