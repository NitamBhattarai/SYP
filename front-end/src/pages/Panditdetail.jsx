import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #C04E10, #E8621A)',
  'linear-gradient(135deg, #7C2D12, #C2410C)',
  'linear-gradient(135deg, #92400E, #D97706)',
  'linear-gradient(135deg, #1C1917, #57534E)',
  'linear-gradient(135deg, #7F1D1D, #B91C1C)',
  'linear-gradient(135deg, #1E3A5F, #2563EB)',
];

function initials(name) {
  return (name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function StarRow({ rating, size = 16 }) {
  const r = parseFloat(rating) || 0;
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <i key={i}
          className={i <= Math.floor(r) ? 'fas fa-star' : (i - 0.5 <= r ? 'fas fa-star-half-alt' : 'far fa-star')}
          style={{ fontSize: size, color: '#f97316', marginRight: 2 }}
        />
      ))}
    </span>
  );
}

export default function PanditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pandit, setPandit] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const isUser = userType === 'user';

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/lookup/pandits/${id}`).then(r => r.json()),
      fetch(`${BASE}/api/reviews/pandit/${id}`).then(r => r.json()),
    ]).then(([p, r]) => {
      setPandit(p.pandit_id ? p : null);
      setReviews(Array.isArray(r) ? r : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!token) { navigate('/login'); return; }
    navigate(`/create-booking?pandit=${id}`);
  };

  const handleMessage = async () => {
    if (!token) { navigate('/login'); return; }
    setMsgLoading(true);
    try {
      const res = await fetch(`${BASE}/api/messages/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pandit_id: id })
      });
      const data = await res.json();
      if (res.ok && data.conversation_id) {
        navigate(`/messages?conv=${data.conversation_id}`);
      } else {
        navigate('/messages');
      }
    } catch (err) {
      console.error(err);
      navigate('/messages');
    } finally { setMsgLoading(false); }
  };

  const specs = (p) => (p.specialization || '').split(',').map(s => s.trim()).filter(Boolean);
  const langs = (p) => (p.languages || '').split(',').map(s => s.trim()).filter(Boolean);
  const rating = pandit ? parseFloat(pandit.avg_rating) || 0 : 0;
  const avatarBg = pandit ? AVATAR_COLORS[pandit.pandit_id % AVATAR_COLORS.length] : AVATAR_COLORS[0];

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        .action-btn { transition: all 0.2s ease; }
        .action-btn:hover { transform: translateY(-2px); }
        .contact-row { transition: border-color 0.15s; }
        .contact-row:hover { border-color: rgba(249,115,22,0.3) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'Inter',sans-serif" }}>

        {/* Loading */}
        {loading && (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div className="spinner-border" style={{ color: '#f97316', width: 48, height: 48 }}></div>
              <p style={{ marginTop: 16, color: '#9B7355' }}>Loading profile...</p>
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && !pandit && (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div style={{ fontSize: '4rem', opacity: 0.2 }}>🙏</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#1A0F00', marginTop: 16 }}>Pandit not found</h3>
              <p style={{ color: '#9B7355', marginBottom: 24 }}>This profile may have been removed or is unavailable.</p>
              <button onClick={() => navigate('/pandits')} style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
                <i className="fas fa-arrow-left me-2"></i>Back to Browse
              </button>
            </div>
          </div>
        )}

        {!loading && pandit && (
          <>
            {/* ── HERO BANNER ── */}
            <div style={{ position: 'relative', height: 360, background: avatarBg, overflow: 'hidden' }}>
              {pandit.profile_pic && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${pandit.profile_pic})`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'brightness(0.35)' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 40%)' }} />

              {/* Back button */}
              <button onClick={() => navigate(-1)}
                style={{ position: 'absolute', top: 80, left: 24, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
                <i className="fas fa-arrow-left"></i> Back
              </button>

              {/* Hero content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 48px 32px', display: 'flex', alignItems: 'flex-end', gap: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  {pandit.profile_pic
                    ? <img src={pandit.profile_pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials(pandit.full_name)
                  }
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ background: 'rgba(34,197,94,0.85)', color: '#fff', fontSize: 11, borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
                      <i className="fas fa-check-circle me-1"></i>Verified Pandit
                    </span>
                    {pandit.experience_years && (
                      <span style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11, borderRadius: 20, padding: '3px 10px', fontWeight: 500 }}>
                        {pandit.experience_years} yrs experience
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                    {pandit.full_name}
                  </h1>
                  {pandit.location && (
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', fontSize: 15 }}>
                      <i className="fas fa-map-marker-alt me-1"></i>{pandit.location}
                    </p>
                  )}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '12px 20px', textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Starting from</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#fff' }}>
                    {pandit.price_per_ceremony ? `Rs. ${Number(pandit.price_per_ceremony).toLocaleString()}` : 'On request'}
                  </div>
                </div>
              </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

                {/* ── LEFT COLUMN ── */}
                <div>
                  {/* Rating bar */}
                  <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <StarRow rating={rating} size={22} />
                    {rating > 0 ? (
                      <>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00' }}>{rating.toFixed(1)}</span>
                        <span style={{ color: '#9B7355', fontSize: 14 }}>({pandit.review_count} {pandit.review_count === 1 ? 'review' : 'reviews'})</span>
                      </>
                    ) : (
                      <span style={{ color: '#9B7355', fontSize: 14 }}>No reviews yet — be the first!</span>
                    )}
                  </div>

                  {/* About */}
                  {pandit.bio && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 12 }}>
                        <i className="fas fa-om me-2" style={{ color: '#f97316', fontSize: 16 }}></i>About
                      </h5>
                      <p style={{ color: '#555', lineHeight: 1.8, fontSize: 15, margin: 0 }}>{pandit.bio}</p>
                    </div>
                  )}

                  {/* Specializations */}
                  {specs(pandit).length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 16 }}>
                        <i className="fas fa-hands-praying me-2" style={{ color: '#f97316', fontSize: 16 }}></i>Specializations
                      </h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {specs(pandit).map(s => (
                          <span key={s} style={{ background: 'rgba(249,115,22,0.08)', color: '#c2410c', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 24, padding: '8px 18px', fontSize: 14, fontWeight: 500 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {langs(pandit).length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 24, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 16 }}>
                        <i className="fas fa-language me-2" style={{ color: '#f97316', fontSize: 16 }}></i>Languages
                      </h5>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {langs(pandit).map(l => (
                          <span key={l} style={{ background: '#F3F4F6', color: '#374151', borderRadius: 24, padding: '8px 18px', fontSize: 14, fontWeight: 500 }}>{l}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 20 }}>
                      <i className="fas fa-star me-2" style={{ color: '#f97316', fontSize: 16 }}></i>Reviews ({reviews.length})
                    </h5>
                    {reviews.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(249,115,22,0.04)', borderRadius: 12, color: '#9B7355', fontSize: 15 }}>
                        🙏 No reviews yet. Book this pandit and share your experience!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {reviews.map(r => (
                          <div key={r.review_id} style={{ background: '#FDFBF7', borderRadius: 12, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                                  {(r.user_name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#1A0F00', fontSize: 14 }}>{r.user_name}</div>
                                  <StarRow rating={r.rating} size={12} />
                                </div>
                              </div>
                              <div style={{ fontSize: 12, color: '#9B7355' }}>
                                {new Date(r.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            {r.comment && <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, margin: 0, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)' }}>{r.comment}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── RIGHT COLUMN (sticky) ── */}
                <div style={{ position: 'sticky', top: 24 }}>

                  {/* Book + Message card */}
                  <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 8px 32px rgba(249,115,22,0.08)', marginBottom: 20 }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <div style={{ fontSize: 13, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Ceremony Fee</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#1A0F00' }}>
                        {pandit.price_per_ceremony ? `Rs. ${Number(pandit.price_per_ceremony).toLocaleString()}` : 'On request'}
                      </div>
                    </div>

                    {/* Book button */}
                    <button className="action-btn" onClick={handleBook}
                      style={{ width: '100%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(249,115,22,0.35)', marginBottom: 10 }}>
                      <i className="fas fa-calendar-check me-2"></i>Book This Pandit
                    </button>

                    {/* Message button — only for logged in users */}
                    {token && isUser && (
                      <button className="action-btn" onClick={handleMessage} disabled={msgLoading}
                        style={{ width: '100%', background: '#fff', color: '#f97316', border: '2px solid rgba(249,115,22,0.35)', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                        {msgLoading
                          ? <><span className="spinner-border spinner-border-sm"></span> Opening chat...</>
                          : <><i className="fas fa-comments"></i> Message Pandit</>
                        }
                      </button>
                    )}

                    {/* Video call button — only for logged in users */}
                    {token && isUser && (
                      <button className="action-btn"
                        onClick={() => navigate(`/call/pandit-${id}-${Date.now().toString(36)}?with=${encodeURIComponent(pandit.full_name)}`)}
                        style={{ width: '100%', background: '#fff', color: '#166534', border: '2px solid rgba(34,197,94,0.35)', borderRadius: 12, padding: '11px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                        <i className="fas fa-video"></i> Video Call
                      </button>
                    )}

                    {/* Not logged in prompt */}
                    {!token && (
                      <button onClick={() => navigate('/login')}
                        style={{ width: '100%', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>
                        <i className="fas fa-sign-in-alt me-2"></i>Login to Message
                      </button>
                    )}

                    <p style={{ textAlign: 'center', color: '#9B7355', fontSize: 12, margin: 0 }}>
                      <i className="fas fa-shield-alt me-1"></i>Secure booking · No hidden charges
                    </p>
                  </div>

                  {/* Contact card */}
                  <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <h6 style={{ fontWeight: 700, color: '#1A0F00', marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <i className="fas fa-address-card me-2" style={{ color: '#f97316' }}></i>Contact
                    </h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {pandit.phone && (
                        <a href={`tel:${pandit.phone}`} className="contact-row"
                          style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FDFBF7', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: '12px 14px', textDecoration: 'none', color: '#1A0F00' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fas fa-phone" style={{ color: '#f97316', fontSize: 14 }}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{pandit.phone}</div>
                          </div>
                          <i className="fas fa-external-link-alt ms-auto" style={{ color: '#9B7355', fontSize: 11 }}></i>
                        </a>
                      )}
                      {pandit.email && (
                        <a href={`mailto:${pandit.email}`} className="contact-row"
                          style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FDFBF7', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: '12px 14px', textDecoration: 'none', color: '#1A0F00' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fas fa-envelope" style={{ color: '#3B82F6', fontSize: 14 }}></i>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 11, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</div>
                            <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pandit.email}</div>
                          </div>
                          <i className="fas fa-external-link-alt ms-auto" style={{ color: '#9B7355', fontSize: 11, flexShrink: 0 }}></i>
                        </a>
                      )}
                      {pandit.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FDFBF7', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#22C55E', fontSize: 14 }}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{pandit.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}