// Import necessary React hooks and navigation utility
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PanditAnalytics() {
  const navigate = useNavigate();
  // Retrieve auth token and user data from localStorage
  const token = localStorage.getItem('token');
  const panditData = JSON.parse(localStorage.getItem('userData') || '{}');

  // State to store analytics statistics
  const [stats, setStats] = useState({
    totalBookings: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0,
    totalEarnings: 0, avgRating: 0, totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadData();
  }, []);

  // Function to fetch bookings and reviews data
  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch bookings
      const bRes = await fetch(`${BASE}/api/bookings/pandit`, { headers });
      const bookings = await bRes.json();

      if (Array.isArray(bookings)) {
        const pending   = bookings.filter(b => b.status === 'pending').length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        const cancelled = bookings.filter(b => b.status === 'cancelled').length;
       // Calculate total earnings from completed bookings
        const totalEarnings = bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (parseFloat(b.price_per_ceremony) || 0), 0);

        setRecentBookings(bookings.slice(0, 5));
        setStats(prev => ({ ...prev, totalBookings: bookings.length, pending, confirmed, completed, cancelled, totalEarnings }));
      }

      // Fetch reviews
      const panditId = panditData.pandit_id;
      if (panditId) {
        const rRes = await fetch(`${BASE}/api/reviews/pandit/${panditId}`);
        const reviewData = await rRes.json();
        if (Array.isArray(reviewData)) {
          const avg = reviewData.length ? (reviewData.reduce((s, r) => s + r.rating, 0) / reviewData.length).toFixed(1) : 0;
          setReviews(reviewData.slice(0, 4));
          setStats(prev => ({ ...prev, avgRating: avg, totalReviews: reviewData.length }));
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const STATUS_STYLE = {
    pending:   { bg: '#FFF7ED', color: '#C2410C', border: 'rgba(249,115,22,0.25)' },
    confirmed: { bg: '#F0FDF4', color: '#166534', border: 'rgba(34,197,94,0.25)' },
    completed: { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(59,130,246,0.25)' },
    cancelled: { bg: '#FEF2F2', color: '#991B1B', border: 'rgba(239,68,68,0.25)' },
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: 'fa-calendar-check', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
    { label: 'Completed Pujas', value: stats.completed,    icon: 'fa-check-circle',   color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
    { label: 'Pending Requests', value: stats.pending,     icon: 'fa-clock',           color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Avg Rating',       value: stats.avgRating || '—', icon: 'fa-star',       color: '#C9952A', bg: 'rgba(201,149,42,0.08)' },
    { label: 'Total Reviews',    value: stats.totalReviews, icon: 'fa-comments',       color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
    { label: 'Confirmed',        value: stats.confirmed,    icon: 'fa-thumbs-up',      color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'Inter',sans-serif", paddingTop: 80, paddingBottom: 60 }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>Pandit Dashboard</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#1A0F00', margin: '0 0 6px' }}>
              Namaste, {panditData.full_name || 'Pandit Ji'} 🙏
            </h1>
            <p style={{ color: '#9B7355', margin: 0, fontSize: 15 }}>Here's an overview of your activity and performance</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/pandit/bookings')}
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-calendar-alt"></i> Manage Bookings
            </button>
            <button onClick={() => navigate('/pandit/availability')}
              style={{ background: '#fff', color: '#f97316', border: '1.5px solid rgba(249,115,22,0.3)', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-clock"></i> Availability
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner-border" style={{ color: '#f97316', width: 40, height: 40 }}></div>
            <p style={{ color: '#9B7355', marginTop: 16 }}>Loading your analytics...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
              {statCards.map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 20 }}></i>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#1A0F00', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#9B7355', marginTop: 4 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Status Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

              {/* Booking breakdown bar */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: '#1A0F00', margin: '0 0 20px' }}>Booking Breakdown</h5>
                {stats.totalBookings === 0 ? (
                  <p style={{ color: '#9B7355', fontSize: 14 }}>No bookings yet.</p>
                ) : (
                  [
                    { label: 'Completed', count: stats.completed,  color: '#22C55E' },
                    { label: 'Confirmed', count: stats.confirmed,  color: '#3B82F6' },
                    { label: 'Pending',   count: stats.pending,    color: '#F59E0B' },
                    { label: 'Cancelled', count: stats.cancelled,  color: '#EF4444' },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.count}</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${stats.totalBookings ? (item.count / stats.totalBookings) * 100 : 0}%`, background: item.color, borderRadius: 10, transition: 'width .6s ease' }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Rating overview */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: '#1A0F00', margin: '0 0 20px' }}>Rating Overview</h5>
                {stats.totalReviews === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <i className="fas fa-star" style={{ fontSize: 32, color: 'rgba(0,0,0,0.1)', marginBottom: 12, display: 'block' }}></i>
                    <p style={{ color: '#9B7355', fontSize: 14, margin: 0 }}>No reviews yet. Complete bookings to receive ratings.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 700, color: '#1A0F00', lineHeight: 1 }}>{stats.avgRating}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '8px 0' }}>
                        {[1,2,3,4,5].map(i => (
                          <i key={i} className={`fas fa-star`} style={{ color: i <= Math.round(stats.avgRating) ? '#F59E0B' : 'rgba(0,0,0,0.1)', fontSize: 18 }}></i>
                        ))}
                      </div>
                      <p style={{ color: '#9B7355', fontSize: 13, margin: 0 }}>Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}</p>
                    </div>
                    {reviews.slice(0,2).map((r, i) => (
                      <div key={i} style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 12, marginTop: 12 }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                          {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ fontSize: 11, color: s <= r.rating ? '#F59E0B' : 'rgba(0,0,0,0.1)' }}></i>)}
                        </div>
                        <p style={{ fontSize: 13, color: '#555', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{r.comment?.slice(0, 80)}{r.comment?.length > 80 ? '...' : ''}"</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Recent Bookings */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 28 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: '#1A0F00', margin: 0 }}>Recent Bookings</h5>
                <button onClick={() => navigate('/pandit/bookings')}
                  style={{ background: 'none', border: 'none', color: '#f97316', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  View All →
                </button>
              </div>
              {recentBookings.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <i className="fas fa-calendar-times" style={{ fontSize: 32, color: 'rgba(0,0,0,0.1)', marginBottom: 12, display: 'block' }}></i>
                  <p style={{ color: '#9B7355', margin: 0 }}>No bookings yet. Your bookings will appear here.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FDFBF7' }}>
                      {['User', 'Service', 'Event Date', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(b => {
                      const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                      return (
                        <tr key={b.booking_id} style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#1A0F00' }}>{b.user_name}</td>
                          <td style={{ padding: '14px 20px', fontSize: 13, color: '#555' }}>{b.service_name}</td>
                          <td style={{ padding: '14px 20px', fontSize: 13, color: '#555' }}>{formatDate(b.event_date)}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button onClick={() => navigate('/pandit/bookings')}
                              style={{ background: 'none', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {[
                { icon: 'fa-calendar-alt',  label: 'My Bookings',    path: '/pandit/bookings',     color: '#f97316' },
                { icon: 'fa-clock',         label: 'Availability',   path: '/pandit/availability', color: '#22C55E' },
                { icon: 'fa-user-edit',     label: 'Edit Profile',   path: '/pandit/profile',      color: '#3B82F6' },
                { icon: 'fa-comments',      label: 'Messages',       path: '/messages',            color: '#8B5CF6' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)}
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '20px 16px', cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                  <i className={`fas ${a.icon}`} style={{ fontSize: 24, color: a.color, display: 'block', marginBottom: 10 }}></i>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A0F00' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}