import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'fa-chart-bar'},
  { key: 'pandits',  label: 'Pandits',  icon: 'fa-user-tie' },
  { key: 'users',    label: 'Users',    icon: 'fa-users' },
  { key: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
];

const STATUS_COLORS = {
  pending:   { bg: '#FFF7ED', color: '#C2410C', border: 'rgba(249,115,22,0.25)' },
  confirmed: { bg: '#F0FDF4', color: '#166534', border: 'rgba(34,197,94,0.25)'  },
  completed: { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(59,130,246,0.25)' },
  cancelled: { bg: '#FEF2F2', color: '#991B1B', border: 'rgba(239,68,68,0.25)'  },
  approved:  { bg: '#F0FDF4', color: '#166534', border: 'rgba(34,197,94,0.25)'  },
  rejected:  { bg: '#FEF2F2', color: '#991B1B', border: 'rgba(239,68,68,0.25)'  },
  suspended: { bg: '#F9FAFB', color: '#6B7280', border: 'rgba(107,114,128,0.25)'},
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [pandits, setPandits] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: '', text: '' });

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ show: false, type: '', text: '' }), 3000);
  };

  // Guard: only admins
  useEffect(() => {
    if (!token || userType !== 'admin') {
      navigate('/login');
    }
  }, [token, userType]);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const loadAll = () => {
    const authHeaders = getHeaders();
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/api/admin/stats`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE}/api/admin/pandits`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE}/api/admin/users`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE}/api/admin/bookings`, { headers: authHeaders }).then(r => r.json()),
    ]).then(([s, p, u, b]) => {
      setStats(s);
      setPandits(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setBookings(Array.isArray(b) ? b : []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const panditAction = async (panditId, action) => {
    try {
      const res = await fetch(`${BASE}/api/admin/pandits/${panditId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', data.message);
        loadAll();
      } else {
        showToast('error', data.message || 'Action failed');
      }
    } catch { showToast('error', 'Network error'); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`${BASE}/api/admin/users/${userId}`, { method: 'DELETE', headers: getHeaders() });
      const data = await res.json();
      if (res.ok) { showToast('success', data.message); loadAll(); }
      else showToast('error', data.message);
    } catch { showToast('error', 'Network error'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div className="text-center">
        <div className="spinner-border" style={{ color: '#f97316', width: 48, height: 48 }}></div>
        <p className="mt-3 text-muted">Loading admin panel...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast.show && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, minWidth: 280 }}>
          <div style={{ background: '#fff', borderLeft: `4px solid ${toast.type === 'success' ? '#22C55E' : '#EF4444'}`, borderRadius: 12, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: toast.type === 'success' ? '#166534' : '#991B1B' }}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {toast.text}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, background: '#1A0F00', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🕉</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#fff' }}>PanditBook</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: 'none', marginBottom: 4, cursor: 'pointer', background: tab === t.key ? 'rgba(249,115,22,0.15)' : 'transparent', color: tab === t.key ? '#FB923C' : 'rgba(255,255,255,0.55)', fontWeight: tab === t.key ? 600 : 400, fontSize: 14, textAlign: 'left', transition: 'all 0.15s' }}>
              <i className={`fas ${t.icon}`} style={{ width: 18 }}></i>
              {t.label}
              {t.key === 'pandits' && pandits.filter(p => p.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#f97316', color: '#fff', borderRadius: '20px', padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                  {pandits.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            <i className="fas fa-sign-out-alt" style={{ width: 18 }}></i>Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 240, padding: '32px 36px', minHeight: '100vh' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#1A0F00', marginBottom: 8 }}>Dashboard Overview</h2>
            <p style={{ color: '#9B7355', marginBottom: 32 }}>Welcome back, Admin. Here's what's happening today.</p>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 36 }}>
              {[
                { label: 'Total Pandits',    value: stats.total_pandits   || 0, icon: 'fa-user-tie',      color: '#f97316', sub: `${stats.pending_pandits || 0} pending approval` },
                { label: 'Total Users',      value: stats.total_users     || 0, icon: 'fa-users',         color: '#3B82F6', sub: 'Registered devotees' },
                { label: 'Total Bookings',   value: stats.total_bookings  || 0, icon: 'fa-calendar-check',color: '#22C55E', sub: `${stats.pending_bookings || 0} pending` },
                { label: 'Completed Pujas',  value: stats.completed_pujas || 0, icon: 'fa-check-double',  color: '#8B5CF6', sub: 'Successfully performed' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 18 }}></i>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#1A0F00', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#9B7355' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Pending pandits quick list */}
            {pandits.filter(p => p.status === 'pending').length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1A0F00', margin: 0 }}>
                    ⏳ Pending Verifications
                  </h3>
                  <button onClick={() => setTab('pandits')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>View all →</button>
                </div>
                {pandits.filter(p => p.status === 'pending').slice(0, 3).map(p => (
                  <div key={p.pandit_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1A0F00', fontSize: 15 }}>{p.full_name}</div>
                      <div style={{ fontSize: 13, color: '#9B7355' }}>{p.email} · {p.location || 'No location'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => panditAction(p.pandit_id, 'approved')} style={{ background: '#F0FDF4', color: '#166534', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => panditAction(p.pandit_id, 'rejected')} style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PANDITS ── */}
        {tab === 'pandits' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', marginBottom: 24 }}>
              Manage Pandits <span style={{ fontSize: 16, color: '#9B7355', fontFamily: 'Inter', fontWeight: 400 }}>({pandits.length} total)</span>
            </h2>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FDFBF7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {['Pandit', 'Contact', 'Specialization', 'Experience', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pandits.map(p => (
                    <tr key={p.pandit_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FDFBF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#1A0F00', fontSize: 14 }}>{p.full_name}</div>
                        <div style={{ fontSize: 12, color: '#9B7355' }}>{p.location || '—'}</div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{p.email}</td>
                      <td style={{ padding: '14px 18px', fontSize: 12, color: '#555', maxWidth: 160 }}>
                        {p.specialization ? p.specialization.split(',')[0].trim() + (p.specialization.split(',').length > 1 ? ` +${p.specialization.split(',').length - 1}` : '') : '—'}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{p.experience_years ? `${p.experience_years} yrs` : '—'}</td>
                      <td style={{ padding: '14px 18px' }}><StatusBadge status={p.status || 'pending'} /></td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(p.status === 'pending' || p.status === 'rejected') && (
                            <button onClick={() => panditAction(p.pandit_id, 'approved')}
                              style={{ background: '#F0FDF4', color: '#166534', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              ✓ Approve
                            </button>
                          )}
                          {(p.status === 'pending' || p.status === 'approved') && (
                            <button onClick={() => panditAction(p.pandit_id, 'rejected')}
                              style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              ✕ Reject
                            </button>
                          )}
                          {p.status !== 'suspended' && (
                            <button onClick={() => panditAction(p.pandit_id, 'suspended')}
                              style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid rgba(107,114,128,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                              ⏸ Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pandits.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9B7355' }}>No pandits registered yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', marginBottom: 24 }}>
              Manage Users <span style={{ fontSize: 16, color: '#9B7355', fontFamily: 'Inter', fontWeight: 400 }}>({users.length} total)</span>
            </h2>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FDFBF7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {['User', 'Email', 'Joined', 'Total Bookings', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FDFBF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#1A0F00', fontSize: 14 }}>{u.full_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{u.email}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{u.booking_count || 0}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <button onClick={() => deleteUser(u.user_id)}
                          style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9B7355' }}>No users registered yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'bookings' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', marginBottom: 24 }}>
              All Bookings <span style={{ fontSize: 16, color: '#9B7355', fontFamily: 'Inter', fontWeight: 400 }}>({bookings.length} total)</span>
            </h2>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FDFBF7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {['#', 'User', 'Pandit', 'Service', 'Event Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.booking_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FDFBF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#9B7355', fontWeight: 600 }}>#{b.booking_id}</td>
                      <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: '#1A0F00' }}>{b.user_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{b.pandit_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{b.service_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>
                        {b.event_date ? new Date(b.event_date).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 18px' }}><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9B7355' }}>No bookings yet.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
