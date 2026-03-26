import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const team = [
    { name: 'Nawaraaj Karki', role: 'Chief Advisor', exp: 'Frontend Developer', location: 'Kerabari', initials: 'RS', color: 'linear-gradient(135deg,#C04E10,#E8621A)' },
    { name: 'Bibash Pandey', role: 'Vedic Consultant', exp: 'Backend Developer', location: 'Pathri', initials: 'KA', color: 'linear-gradient(135deg,#7C2D12,#C2410C)' },
    { name: 'Nitam Bhattarai', role: 'Founder & CEO', exp: 'Tech Lead', location: 'Itahari', initials: 'NB', color: 'linear-gradient(135deg,#1A0F00,#f97316)' },
    { name: 'Nabin Baral', role: 'Senior Pandit', exp: 'Frontend Developer', location: 'Belbari', initials: 'BP', color: 'linear-gradient(135deg,#92400E,#D97706)' },
  ];

  const values = [
    { icon: '🕉', title: 'Authenticity', desc: 'Every pandit is verified for their Vedic knowledge, experience, and conduct before joining our platform.' },
    { icon: '🤝', title: 'Trust', desc: 'We build lasting relationships between devotees and pandits based on transparency, honesty, and mutual respect.' },
    { icon: '🌸', title: 'Devotion', desc: 'We believe every ceremony is sacred. We treat each booking with the same reverence as the ritual itself.' },
    { icon: '⚡', title: 'Accessibility', desc: 'Making Vedic ceremonies accessible to every Nepali family — wherever they are, whenever they need.' },
  ];

  const milestones = [
    { year: '2022', title: 'The Idea', desc: 'Born out of frustration of not finding a reliable pandit for a family puja in Kathmandu.' },
    { year: '2023', title: 'First Pandits', desc: 'Onboarded our first 10 verified pandits across Kathmandu Valley.' },
    { year: '2024', title: 'Platform Launch', desc: 'Officially launched Bahun.Com with booking, reviews, and availability system.' },
    { year: '2025', title: 'Growing Strong', desc: '30+ pandits, 500+ pujas completed, expanding to Pokhara and beyond.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }
        .team-card { transition: all 0.25s ease; }
        .value-card:hover { border-color: rgba(249,115,22,0.3) !important; background: rgba(249,115,22,0.03) !important; }
        .value-card { transition: all 0.2s ease; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg, #1A0F00 0%, #2D1A00 60%, #1A0F00 100%)', padding: '120px 48px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(249,115,22,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,149,42,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 24, padding: '6px 18px', marginBottom: 24 }}>
            <span>🙏</span>
            <span style={{ color: '#FB923C', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>Our Story</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 54, fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>
            Connecting Nepal to its<br />
            <span style={{ color: '#f97316', fontStyle: 'italic' }}>Sacred Traditions</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 36px' }}>
            Bahun.Com was founded with a simple belief — every family deserves access to an authentic, trustworthy pandit for life's most sacred moments.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/pandits')}
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fas fa-search me-2"></i>Find a Pandit
            </button>
            <button onClick={() => navigate('/horoscope')}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
              Read your Horoscope
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '28px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {[
            { value: '30+', label: 'Verified Pandits', icon: 'fa-user-tie', color: '#f97316' },
            { value: '500+', label: 'Pujas Completed', icon: 'fa-fire', color: '#C9952A' },
            { value: '12+', label: 'Ceremony Types', icon: 'fa-om', color: '#22C55E' },
            { value: '4.8★', label: 'Average Rating', icon: 'fa-star', color: '#f97316' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 18 }}></i>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#9B7355', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Our Mission</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: '#1A0F00', marginBottom: 20, lineHeight: 1.3 }}>
              Preserving Vedic Traditions in the Digital Age
            </h2>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
              In today's fast-paced world, finding a knowledgeable, reliable pandit for a sacred ceremony has become increasingly difficult. Families often rely on word of mouth, last-minute searches, or settle for someone less experienced.
            </p>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>
              Bahun.Com bridges this gap — creating a trusted marketplace where experienced pandits can reach more families, and families can find the right pandit with confidence.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ padding: '16px 20px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12, flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#f97316' }}>Nepal</div>
                <div style={{ fontSize: 12, color: '#9B7355', marginTop: 2 }}>Based in</div>
              </div>
              <div style={{ padding: '16px 20px', background: 'rgba(201,149,42,0.06)', border: '1px solid rgba(201,149,42,0.15)', borderRadius: 12, flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#C9952A' }}>2022</div>
                <div style={{ fontSize: 12, color: '#9B7355', marginTop: 2 }}>Founded</div>
              </div>
              <div style={{ padding: '16px 20px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#22C55E' }}>Free</div>
                <div style={{ fontSize: 12, color: '#9B7355', marginTop: 2 }}>To join</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'linear-gradient(135deg,#1A0F00,#2D1A00)', borderRadius: 24, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(249,115,22,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,149,42,0.06)' }} />
              <div style={{ fontSize: 64, marginBottom: 20 }}>🕉</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                "सेवा परमो धर्म"
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontStyle: 'italic', marginBottom: 28 }}>
                "Service is the highest duty"
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Verified pandits only', 'Real reviews from devotees', 'Transparent pricing', 'Easy online booking'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 16px' }}>
                    <i className="fas fa-check-circle" style={{ color: '#f97316', fontSize: 14 }}></i>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div style={{ background: '#fff', padding: '72px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>What We Stand For</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: '#1A0F00', marginBottom: 12 }}>Our Core Values</h2>
            <p style={{ color: '#9B7355', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Everything we do is guided by these four principles.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {values.map((v, i) => (
              <div key={i} className="value-card" style={{ background: '#FDFBF7', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{v.icon}</div>
                <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 10 }}>{v.title}</h5>
                <p style={{ color: '#9B7355', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Our Journey</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: '#1A0F00' }}>How We Got Here</h2>
        </div>
        <div style={{ position: 'relative' }}>
          {/* Center line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(249,115,22,0.15)', transform: 'translateX(-50%)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'inline-block', maxWidth: 320, textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1A0F00', marginBottom: 6 }}>{m.title}</div>
                    <p style={{ color: '#9B7355', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
                {/* Year bubble */}
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(249,115,22,0.3)', zIndex: 1 }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{m.year}</span>
                </div>
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div style={{ background: '#fff', padding: '72px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The People Behind It</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: '#1A0F00', marginBottom: 12 }}>Our Team</h2>
            <p style={{ color: '#9B7355', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>A mix of experienced pandits and passionate technologists.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {team.map((t, i) => (
              <div key={i} className="team-card" style={{ background: '#FDFBF7', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  {t.initials}
                </div>
                <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#1A0F00', marginBottom: 4 }}>{t.name}</h5>
                <div style={{ fontSize: 13, color: '#f97316', fontWeight: 600, marginBottom: 6 }}>{t.role}</div>
                <div style={{ fontSize: 12, color: '#9B7355' }}>
                  <i className="fas fa-clock me-1"></i>{t.exp}
                  <span style={{ margin: '0 6px' }}>·</span>
                  <i className="fas fa-map-marker-alt me-1"></i>{t.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: 'linear-gradient(135deg,#1A0F00,#2D1A00)', padding: '72px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 14 }}>
            Be Part of Our Mission
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 32, lineHeight: 1.8 }}>
            Whether you're looking for a pandit or are a pandit looking to reach more families — Bahun.Com is your home.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/pandits')}
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fas fa-search me-2"></i>Find a Pandit
            </button>
            <button onClick={() => navigate('/register')}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
              <i className="fas fa-user-plus me-2"></i>Join us
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}