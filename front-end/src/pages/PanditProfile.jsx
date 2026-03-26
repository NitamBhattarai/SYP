import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_SPECIALIZATIONS = [
  'Vivah Sanskar (Wedding)',
  'Satyanarayan Puja',
  'Griha Pravesh',
  'Havan & Yagna',
  'Navagraha Puja',
  'Namkaran (Naming)',
  'Pitru Tarpan',
  'Vastu Shastra',
  'Festival Pujas',
  'Kundali & Astrology',
];

const LANGUAGES = ['Hindi', 'Nepali', 'Sanskrit', 'Newari', 'Maithili', 'English'];

export default function PanditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', text: '' });

  const [form, setForm] = useState({
    full_name: '',
    bio: '',
    experience_years: '',
    price_per_ceremony: '',
    location: '',
    languages: [],
    specializations: [],
  });

  // profile picture — stored as base64 preview + file for upload
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // custom specialization add
  const [customSpec, setCustomSpec] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [allSpecs, setAllSpecs] = useState(DEFAULT_SPECIALIZATIONS);

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ show: false, type: '', text: '' }), 3500);
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${BASE}/api/pandit/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.message) return; // not found yet
        const specs = data.specialization
          ? data.specialization.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        const langs = data.languages
          ? data.languages.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        // add any custom specs from DB that aren't in default list
        const merged = [...new Set([...allSpecs, ...specs])];
        setAllSpecs(merged);

        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          experience_years: data.experience_years || '',
          price_per_ceremony: data.price_per_ceremony || '',
          location: data.location || '',
          languages: langs,
          specializations: specs,
        });
        if (data.profile_pic) setAvatarPreview(data.profile_pic);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('error', 'Image must be under 2MB'); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleSpec = (spec) => {
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const toggleLang = (lang) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const addCustomSpec = () => {
    const trimmed = customSpec.trim();
    if (!trimmed) return;
    if (!allSpecs.includes(trimmed)) {
      setAllSpecs(prev => [...prev, trimmed]);
    }
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(trimmed)
        ? prev.specializations
        : [...prev.specializations, trimmed]
    }));
    setCustomSpec('');
    setShowCustomInput(false);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) { showToast('error', 'Full name is required'); return; }
    if (form.specializations.length === 0) { showToast('error', 'Select at least one specialization'); return; }

    setSaving(true);
    try {
      // If there's a new avatar, upload as base64 (simple approach — no separate upload endpoint needed)
      let profilePicData = avatarPreview;

      const payload = {
        full_name: form.full_name,
        bio: form.bio,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        price_per_ceremony: form.price_per_ceremony ? Number(form.price_per_ceremony) : null,
        location: form.location,
        specialization: form.specializations.join(', '),
        languages: form.languages.join(', '),
        profile_pic: profilePicData || null,
      };

      const res = await fetch(`${BASE}/api/pandit/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Profile updated successfully!');
      } else {
        showToast('error', data.message || 'Update failed');
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = form.full_name
    ? form.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFBF7' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: '#f97316', width: '48px', height: '48px' }}></div>
        <p style={{ marginTop: '16px', color: '#9B7355', fontFamily: 'Jost, sans-serif' }}>Loading your profile…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .pp-wrap { background: #FDFBF7; min-height: 100vh; padding: 100px 24px 60px; font-family: 'Jost', sans-serif; }
        .pp-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
        .pp-sidebar { position: sticky; top: 100px; }
        .pp-card { background: #fff; border: 1px solid rgba(201,149,42,0.15); border-radius: 20px; padding: 28px; }
        .pp-avatar-wrap { text-align: center; margin-bottom: 20px; }
        .pp-avatar {
          width: 120px; height: 120px; border-radius: 50%;
          margin: 0 auto 14px;
          background: linear-gradient(135deg, #C04E10, #E8621A);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #fff;
          cursor: pointer; position: relative; overflow: hidden;
          border: 3px solid rgba(232,98,26,0.3);
          transition: transform 0.2s;
        }
        .pp-avatar:hover { transform: scale(1.04); }
        .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pp-avatar-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s; color: #fff; font-size: 13px; gap: 4px;
        }
        .pp-avatar:hover .pp-avatar-overlay { opacity: 1; }
        .pp-avatar-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #1A0F00; margin-bottom: 4px; }
        .pp-avatar-role { font-size: 12px; color: #9B7355; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
        .pp-preview-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
        .pp-chip { background: rgba(232,98,26,0.08); border: 1px solid rgba(232,98,26,0.2); border-radius: 100px; padding: 4px 10px; font-size: 11px; color: #C04E10; }
        .pp-preview-price { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(201,149,42,0.12); text-align: center; }
        .pp-preview-price-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: #1A0F00; }
        .pp-preview-price-label { font-size: 11px; color: #9B7355; text-transform: uppercase; letter-spacing: 0.06em; }

        .pp-main {}
        .pp-section { background: #fff; border: 1px solid rgba(201,149,42,0.15); border-radius: 20px; padding: 28px; margin-bottom: 20px; }
        .pp-section-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: #1A0F00; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .pp-section-icon { width: 36px; height: 36px; background: rgba(232,98,26,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .pp-label { font-size: 13px; font-weight: 600; color: #5C3A1E; letter-spacing: 0.04em; margin-bottom: 7px; display: block; }
        .pp-input {
          width: 100%; background: #FDFBF7; border: 1.5px solid rgba(201,149,42,0.2);
          border-radius: 10px; padding: 12px 16px; font-family: 'Jost', sans-serif;
          font-size: 15px; color: #1A0F00; outline: none; transition: border-color 0.2s;
        }
        .pp-input:focus { border-color: #f97316; background: #fff; }
        .pp-input::placeholder { color: #C4A882; }
        .pp-textarea { resize: vertical; min-height: 90px; }
        .pp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pp-field { margin-bottom: 16px; }

        .spec-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .spec-pill {
          padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500;
          cursor: pointer; border: 1.5px solid rgba(201,149,42,0.25);
          background: #FDFBF7; color: #5C3A1E; transition: all 0.2s;
          user-select: none;
        }
        .spec-pill:hover { border-color: #f97316; color: #C04E10; }
        .spec-pill.selected { background: linear-gradient(135deg, #f97316, #E8621A); color: #fff; border-color: transparent; }
        .spec-pill.custom { border-style: dashed; }
        .add-spec-btn { padding: 8px 16px; border-radius: 100px; font-size: 13px; cursor: pointer; border: 1.5px dashed rgba(201,149,42,0.4); background: transparent; color: #9B7355; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .add-spec-btn:hover { border-color: #f97316; color: #f97316; }
        .custom-input-row { display: flex; gap: 8px; margin-top: 8px; align-items: center; }
        .custom-input-field { flex: 1; background: #FDFBF7; border: 1.5px solid rgba(201,149,42,0.3); border-radius: 10px; padding: 8px 14px; font-family: 'Jost', sans-serif; font-size: 14px; color: #1A0F00; outline: none; }
        .custom-input-field:focus { border-color: #f97316; }
        .btn-add-confirm { background: linear-gradient(135deg, #f97316, #E8621A); color: #fff; border: none; border-radius: 10px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-cancel-sm { background: transparent; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 8px 14px; font-size: 13px; cursor: pointer; color: #9B7355; }

        .lang-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .lang-pill { padding: 7px 14px; border-radius: 100px; font-size: 13px; cursor: pointer; border: 1.5px solid rgba(201,149,42,0.25); background: #FDFBF7; color: #5C3A1E; transition: all 0.2s; user-select: none; }
        .lang-pill:hover { border-color: #f97316; }
        .lang-pill.selected { background: #1A0F00; color: #fff; border-color: transparent; }

        .pp-save-btn {
          width: 100%; background: linear-gradient(135deg, #f97316, #E8621A);
          color: #fff; border: none; border-radius: 14px;
          padding: 16px; font-family: 'Jost', sans-serif;
          font-size: 16px; font-weight: 700; cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.2s, transform 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .pp-save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
        .pp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .toast-wrap {
          position: fixed; top: 90px; right: 24px; z-index: 9999;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast-box {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px; border-radius: 14px;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-width: 280px;
        }
        .toast-success { background: #fff; border-left: 4px solid #22C55E; color: #166534; }
        .toast-error { background: #fff; border-left: 4px solid #EF4444; color: #991B1B; }
        .price-prefix { background: rgba(232,98,26,0.1); border: 1.5px solid rgba(201,149,42,0.2); border-right: none; border-radius: 10px 0 0 10px; padding: 12px 14px; font-weight: 600; color: #C04E10; font-size: 15px; }
        .price-input-wrap { display: flex; }
        .price-input-wrap .pp-input { border-radius: 0 10px 10px 0; border-left: none; }
        .price-input-wrap .pp-input:focus { border-left: none; }

        @media (max-width: 768px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-sidebar { position: static; }
          .pp-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Toast */}
      {toast.show && (
        <div className="toast-wrap">
          <div className={`toast-box toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.text}
          </div>
        </div>
      )}

      <div className="pp-wrap">
        <div className="pp-grid">

          {/* LEFT — Live Preview Sidebar */}
          <div className="pp-sidebar">
            <div className="pp-card">
              <div className="pp-avatar-wrap">
                <div className="pp-avatar" onClick={handleAvatarClick}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" />
                    : <span>{initials}</span>
                  }
                  <div className="pp-avatar-overlay">
                    <span style={{ fontSize: '20px' }}>📷</span>
                    <span>Change Photo</span>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                <div className="pp-avatar-name">{form.full_name || 'Your Name'}</div>
                <div className="pp-avatar-role">Verified Pandit</div>
                {form.specializations.length > 0 && (
                  <div className="pp-preview-chips">
                    {form.specializations.slice(0, 3).map(s => (
                      <span key={s} className="pp-chip">{s}</span>
                    ))}
                    {form.specializations.length > 3 && (
                      <span className="pp-chip">+{form.specializations.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {form.location && (
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#9B7355', marginBottom: '8px' }}>
                  📍 {form.location}
                </div>
              )}
              {form.experience_years && (
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#9B7355', marginBottom: '8px' }}>
                  🕐 {form.experience_years} years experience
                </div>
              )}
              {form.languages.length > 0 && (
                <div style={{ textAlign: 'center', fontSize: '13px', color: '#9B7355', marginBottom: '8px' }}>
                  🗣 {form.languages.join(' · ')}
                </div>
              )}

              {form.price_per_ceremony && (
                <div className="pp-preview-price">
                  <div className="pp-preview-price-label">Starting from</div>
                  <div className="pp-preview-price-val">Rs. {Number(form.price_per_ceremony).toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#9B7355' }}>per ceremony</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '12px', fontSize: '12px', color: '#9B7355', textAlign: 'center', lineHeight: '1.6' }}>
              This is how your profile appears to families browsing for pandits.
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="pp-main">
            <form onSubmit={handleSubmit}>

              {/* Basic Info */}
              <div className="pp-section">
                <div className="pp-section-title">
                  <div className="pp-section-icon">👤</div>
                  Basic Information
                </div>
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">Full Name *</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} className="pp-input" placeholder="Pt. Ramesh Sharma" required />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Location / City</label>
                    <input name="location" value={form.location} onChange={handleChange} className="pp-input" placeholder="Kathmandu, Bagmati" />
                  </div>
                </div>
                <div className="pp-field">
                  <label className="pp-label">Bio / About You</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} className="pp-input pp-textarea" placeholder="Tell families about your background, training, and approach to sacred ceremonies..." />
                </div>
              </div>

              {/* Experience & Pricing */}
              <div className="pp-section">
                <div className="pp-section-title">
                  <div className="pp-section-icon">💰</div>
                  Experience & Pricing
                </div>
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">Years of Experience</label>
                    <input type="number" name="experience_years" value={form.experience_years} onChange={handleChange} className="pp-input" placeholder="e.g. 15" min="0" max="80" />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Starting Price (per ceremony)</label>
                    <div className="price-input-wrap">
                      <span className="price-prefix">Rs.</span>
                      <input type="number" name="price_per_ceremony" value={form.price_per_ceremony} onChange={handleChange} className="pp-input" placeholder="e.g. 2500" min="0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="pp-section">
                <div className="pp-section-title">
                  <div className="pp-section-icon">🪔</div>
                  Specializations *
                </div>
                <p style={{ fontSize: '13px', color: '#9B7355', marginBottom: '14px' }}>
                  Select all the ceremonies and services you perform.
                </p>
                <div className="spec-grid">
                  {allSpecs.map(spec => (
                    <span
                      key={spec}
                      className={`spec-pill ${form.specializations.includes(spec) ? 'selected' : ''}`}
                      onClick={() => toggleSpec(spec)}
                    >
                      {form.specializations.includes(spec) ? '✓ ' : ''}{spec}
                    </span>
                  ))}
                  <button type="button" className="add-spec-btn" onClick={() => setShowCustomInput(true)}>
                    + Add Custom
                  </button>
                </div>

                {showCustomInput && (
                  <div className="custom-input-row">
                    <input
                      className="custom-input-field"
                      placeholder="e.g. Rudra Abhishek"
                      value={customSpec}
                      onChange={e => setCustomSpec(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSpec())}
                      autoFocus
                    />
                    <button type="button" className="btn-add-confirm" onClick={addCustomSpec}>Add</button>
                    <button type="button" className="btn-cancel-sm" onClick={() => { setShowCustomInput(false); setCustomSpec(''); }}>Cancel</button>
                  </div>
                )}

                {form.specializations.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#9B7355' }}>
                    {form.specializations.length} selected
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="pp-section">
                <div className="pp-section-title">
                  <div className="pp-section-icon">🗣</div>
                  Languages Spoken
                </div>
                <div className="lang-grid">
                  {LANGUAGES.map(lang => (
                    <span
                      key={lang}
                      className={`lang-pill ${form.languages.includes(lang) ? 'selected' : ''}`}
                      onClick={() => toggleLang(lang)}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Save */}
              <button type="submit" className="pp-save-btn" disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm"></span> Saving…</>
                  : <>💾 Save Profile</>
                }
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
