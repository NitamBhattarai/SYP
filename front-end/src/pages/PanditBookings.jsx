import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  pending:   { bg: '#FFF7ED', color: '#C2410C', border: 'rgba(249,115,22,0.25)' },
  confirmed: { bg: '#F0FDF4', color: '#166534', border: 'rgba(34,197,94,0.25)' },
  completed: { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(59,130,246,0.25)' },
  cancelled: { bg: '#FEF2F2', color: '#991B1B', border: 'rgba(239,68,68,0.25)' },
};

export default function PanditBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('token');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = () => {
    fetch(`${BASE}/api/bookings/pandit`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setBookings(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) load(); }, [token]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BASE}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(status === 'confirmed' ? '✅ Booking confirmed!' : status === 'completed' ? '🙏 Marked as completed!' : '❌ Booking cancelled');
        load();
      }
    } catch (err) { console.error(err); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const stats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'Inter',sans-serif", paddingTop: 80, paddingBottom: 60 }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#fff', borderLeft: '4px solid #22C55E', borderRadius: 12, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 14, fontWeight: 500, color: '#166534' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#1A0F00', margin: '0 0 6px' }}>
            My Bookings
          </h2>
          <p style={{ color: '#9B7355', margin: 0 }}>Manage and track all your ceremony bookings</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Pending', value: stats.pending, icon: 'fa-clock', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
            { label: 'Confirmed', value: stats.confirmed, icon: 'fa-check-circle', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
            { label: 'Completed', value: stats.completed, icon: 'fa-flag-checkered', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 20 }}></i>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#9B7355', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#9B7355' }}>
              <div className="spinner-border" style={{ color: '#f97316' }}></div>
              <p style={{ marginTop: 12 }}>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 64 }}>
              <div style={{ fontSize: '3rem', opacity: 0.2, marginBottom: 12 }}>📅</div>
              <h5 style={{ fontFamily: "'Playfair Display',serif", color: '#1A0F00' }}>No bookings yet</h5>
              <p style={{ color: '#9B7355', fontSize: 14 }}>Bookings from users will appear here.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FDFBF7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {['#', 'User', 'Service', 'Event Date', 'Slot', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                  return (
                    <tr key={b.booking_id}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FDFBF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#9B7355', fontWeight: 600 }}>#{b.booking_id}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#1A0F00', fontSize: 14 }}>{b.user_name}</div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{b.service_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{formatDate(b.event_date)}</td>
                      <td style={{ padding: '14px 18px', fontSize: 12, color: '#9B7355' }}>
                        {b.available_date ? `${formatDate(b.available_date)} ${b.start_time}–${b.end_time}` : '—'}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(b.booking_id, 'confirmed')}
                                style={{ background: '#F0FDF4', color: '#166534', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                ✓ Confirm
                              </button>
                              <button onClick={() => updateStatus(b.booking_id, 'cancelled')}
                                style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                ✕ Cancel
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b.booking_id, 'completed')}
                              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                              🙏 Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}