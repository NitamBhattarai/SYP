import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  pending:   { bg: '#FFF7ED', color: '#C2410C', border: 'rgba(249,115,22,0.25)' },
  confirmed: { bg: '#F0FDF4', color: '#166534', border: 'rgba(34,197,94,0.25)' },
  completed: { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(59,130,246,0.25)' },
  cancelled: { bg: '#FEF2F2', color: '#991B1B', border: 'rgba(239,68,68,0.25)' },
};

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 32, color: star <= (hovered || value) ? '#f97316' : '#D1D5DB', padding: '0 2px', transition: 'color 0.15s' }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewModal, setReviewModal] = useState(null); // { booking_id, pandit_name }
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState({}); // { [booking_id]: true }
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('token');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
          // check which completed bookings already have reviews
          data.filter(b => b.status === 'completed').forEach(b => {
            fetch(`${BASE}/api/reviews/check/${b.booking_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(d => { if (d.reviewed) setReviewed(prev => ({ ...prev, [b.booking_id]: true })); });
          });
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const cancel = (id) => {
    fetch(`${BASE}/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'cancelled' })
    })
      .then(r => r.json())
      .then(() => setBookings(prev => prev.map(b => b.booking_id === id ? { ...b, status: 'cancelled' } : b)))
      .catch(err => console.error(err));
  };

  const openReview = (booking) => {
    setReviewModal({ booking_id: booking.booking_id, pandit_name: booking.pandit_name });
    setRating(0);
    setComment('');
  };

  const submitReview = async () => {
    if (!rating) { showToast('Please select a star rating'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_id: reviewModal.booking_id, rating, comment })
      });
      const data = await res.json();
      if (res.ok) {
        setReviewed(prev => ({ ...prev, [reviewModal.booking_id]: true }));
        setReviewModal(null);
        showToast('Review submitted successfully!');
      } else {
        showToast(data.message || 'Failed to submit review');
      }
    } catch { showToast('Network error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#fff', borderLeft: '4px solid #22C55E', borderRadius: 12, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 14, fontWeight: 500, color: '#166534' }}>
          <i className="fas fa-check-circle me-2"></i>{toast}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#1A0F00', marginBottom: 4 }}>
              Leave a Review
            </h4>
            <p style={{ color: '#9B7355', fontSize: 14, marginBottom: 24 }}>
              How was your experience with <strong>{reviewModal.pandit_name}</strong>?
            </p>

            {/* Star picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Your Rating *</label>
              <StarPicker value={rating} onChange={setRating} />
              {rating > 0 && (
                <div style={{ fontSize: 13, color: '#f97316', marginTop: 6, fontWeight: 500 }}>
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating}/5
                </div>
              )}
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Your Comment (optional)</label>
              <textarea
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                style={{ width: '100%', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'Inter', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={submitReview}
                disabled={submitting || !rating}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: rating ? 'pointer' : 'not-allowed', opacity: rating ? 1 : 0.6 }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                onClick={() => setReviewModal(null)}
                style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-5" style={{ paddingTop: '100px !important' }}>
        <div style={{ paddingTop: '60px' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', marginBottom: 4 }}>Your Bookings</h2>
          <p style={{ color: '#9B7355', marginBottom: 28 }}>Track and manage all your puja bookings</p>

          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', opacity: 0.2 }}>📅</div>
              <h5 style={{ color: '#9B7355', fontFamily: "'Playfair Display',serif", marginTop: 16 }}>No bookings yet</h5>
              <p className="text-muted">Your bookings will appear here once you make one.</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FDFBF7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {['#', 'Pandit', 'Service', 'Event Date', 'Slot', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
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
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#1A0F00', fontSize: 14 }}>{b.pandit_name}</td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>{b.service_name}</td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: '#555' }}>
                          {b.event_date ? new Date(b.event_date).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: 12, color: '#555' }}>
                          {b.available_date ? `${b.available_date} ${b.start_time}–${b.end_time}` : '—'}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {(b.status === 'pending' || b.status === 'confirmed') && (
                              <button onClick={() => cancel(b.booking_id)}
                                style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                Cancel
                              </button>
                            )}
                            {b.status === 'completed' && (
                              reviewed[b.booking_id] ? (
                                <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 600 }}>
                                  <i className="fas fa-check-circle me-1"></i>Reviewed
                                </span>
                              ) : (
                                <button onClick={() => openReview(b)}
                                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                  ⭐ Review
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}