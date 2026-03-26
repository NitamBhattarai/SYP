import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SPECIALIZATIONS = [
  'Marriage', 'Birth', 'Death', 'Ghar Puja', 'Puran',
  'Vivah Sanskar (Wedding)', 'Satyanarayan Puja', 'Griha Pravesh',
  'Havan & Yagna', 'Navagraha Puja', 'Namkaran (Naming)',
  'Pitru Tarpan', 'Vastu Shastra', 'Festival Pujas',
];

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

function StarRating({ rating }) {
  const r = parseFloat(rating) || 0;
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <i key={i}
          className={i <= Math.floor(r) ? 'fas fa-star' : (i - 0.5 <= r ? 'fas fa-star-half-alt' : 'far fa-star')}
          style={{ fontSize: 12, color: '#f97316' }}
        />
      ))}
    </span>
  );
}

export default function BrowsePandits() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [search, setSearch] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetch(`${BASE}/api/lookup/pandits`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPandits(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-filter from URL params (from Home search or Services page)
  useEffect(() => {
    const svc = searchParams.get('service');
    const q = searchParams.get('q');
    const loc = searchParams.get('loc');
    if (svc) setSelectedSpecs([svc]);
    if (q) setSearch(q);
    if (loc) setLocationFilter(loc);
  }, [searchParams]);

  const locations = useMemo(() => {
    const locs = [...new Set(pandits.map(p => p.location).filter(Boolean))];
    return locs.sort();
  }, [pandits]);

  const toggleSpec = (spec) => {
    setSelectedSpecs(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const filtered = useMemo(() => {
    let list = [...pandits];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.full_name || '').toLowerCase().includes(q) ||
        (p.specialization || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q)
      );
    }
    if (selectedSpecs.length > 0) {
      list = list.filter(p =>
        selectedSpecs.some(s => (p.specialization || '').toLowerCase().includes(s.toLowerCase()))
      );
    }
    if (locationFilter) list = list.filter(p => p.location === locationFilter);
    if (minRating > 0) list = list.filter(p => (parseFloat(p.avg_rating) || 0) >= minRating);
    if (maxPrice < 100000) list = list.filter(p => !p.price_per_ceremony || Number(p.price_per_ceremony) <= maxPrice);
    if (sortBy === 'rating') list.sort((a, b) => (parseFloat(b.avg_rating) || 0) - (parseFloat(a.avg_rating) || 0));
    else if (sortBy === 'experience') list.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
    else if (sortBy === 'price_asc') list.sort((a, b) => (Number(a.price_per_ceremony) || 0) - (Number(b.price_per_ceremony) || 0));
    else if (sortBy === 'price_desc') list.sort((a, b) => (Number(b.price_per_ceremony) || 0) - (Number(a.price_per_ceremony) || 0));
    return list;
  }, [pandits, search, selectedSpecs, locationFilter, minRating, maxPrice, sortBy]);

  const handleBook = (panditId, e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    navigate(`/create-booking?pandit=${panditId}`);
  };

  const clearFilters = () => {
    setSearch(''); setSelectedSpecs([]); setLocationFilter('');
    setMinRating(0); setMaxPrice(100000); setSortBy('rating');
  };

  const hasFilters = search || selectedSpecs.length > 0 || locationFilter || minRating > 0 || maxPrice < 100000;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5F0', fontFamily: "'Inter', sans-serif", paddingTop: 64 }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        .pandit-card { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
        .pandit-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .view-btn { transition: all 0.15s; }
        .view-btn.active { background: #f97316 !important; color: #fff !important; }
        .spec-chip { transition: all 0.15s; cursor: pointer; }
        .spec-chip:hover { border-color: rgba(249,115,22,0.5) !important; }
        .spec-chip.active { background: rgba(249,115,22,0.1) !important; border-color: #f97316 !important; color: #c2410c !important; }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 64, zIndex: 40, padding: '16px 32px', marginTop: 0 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', margin: 0 }}>Find Your Pandit</h1>
              <p style={{ color: '#9B7355', fontSize: 13, margin: '2px 0 0' }}>
                {loading ? 'Loading...' : `${filtered.length} pandit${filtered.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer' }}>
                <option value="rating">Best Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              {/* View toggle */}
              <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 8, padding: 4 }}>
                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  style={{ border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', background: 'transparent', color: '#6B7280' }}>
                  <i className="fas fa-th-large"></i>
                </button>
                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  style={{ border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', background: 'transparent', color: '#6B7280' }}>
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9B7355', fontSize: 14 }}></i>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ceremony type, or location..."
              style={{ width: '100%', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '11px 14px 11px 40px', fontSize: 14, outline: 'none', background: '#FDFBF7', boxSizing: 'border-box', color: '#1A0F00' }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9B7355', fontSize: 16 }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ position: 'sticky', top: 175, background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: '#1A0F00', fontSize: 15, margin: 0 }}>
              <i className="fas fa-sliders-h me-2" style={{ color: '#f97316' }}></i>Filters
            </h3>
            {hasFilters && (
              <button onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: '#f97316', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Clear all
              </button>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Location</label>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
              style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 10px', fontSize: 13, background: '#fff', cursor: 'pointer' }}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Specialization */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Specialization</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SPECIALIZATIONS.map(spec => (
                <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                  <input type="checkbox" checked={selectedSpecs.includes(spec)} onChange={() => toggleSpec(spec)}
                    style={{ accentColor: '#f97316', cursor: 'pointer' }} />
                  {spec}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              Max Price: {maxPrice >= 100000 ? 'Any' : `Rs. ${maxPrice.toLocaleString()}`}
            </label>
            <input type="range" min={1000} max={100000} step={1000} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9B7355', marginTop: 4 }}>
              <span>Rs. 1,000</span><span>Any</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Minimum Rating</label>
            <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
              style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '8px 10px', fontSize: 13, background: '#fff', cursor: 'pointer' }}>
              <option value={0}>All Ratings</option>
              <option value={3}>3+ stars</option>
              <option value={4}>4+ stars</option>
              <option value={5}>5 stars only</option>
            </select>
          </div>

          <button onClick={clearFilters}
            style={{ width: '100%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <i className="fas fa-redo me-2"></i>Reset Filters
          </button>
        </aside>

        {/* ── PANDIT CONTENT ── */}
        <div>
          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {search && (
                <span style={{ background: 'rgba(249,115,22,0.1)', color: '#c2410c', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                  "{search}" <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c2410c', marginLeft: 4 }}>✕</button>
                </span>
              )}
              {locationFilter && (
                <span style={{ background: 'rgba(249,115,22,0.1)', color: '#c2410c', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                  📍 {locationFilter} <button onClick={() => setLocationFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c2410c', marginLeft: 4 }}>✕</button>
                </span>
              )}
              {selectedSpecs.map(s => (
                <span key={s} style={{ background: 'rgba(249,115,22,0.1)', color: '#c2410c', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                  {s} <button onClick={() => toggleSpec(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c2410c', marginLeft: 4 }}>✕</button>
                </span>
              ))}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F3F4F6', margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }}></div>
                  <div style={{ height: 16, background: '#F3F4F6', borderRadius: 8, marginBottom: 8 }}></div>
                  <div style={{ height: 12, background: '#F3F4F6', borderRadius: 8, width: '60%', margin: '0 auto' }}></div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>🔍</div>
              <h4 style={{ fontFamily: "'Playfair Display',serif", color: '#1A0F00', marginBottom: 8 }}>No pandits found</h4>
              <p style={{ color: '#9B7355', marginBottom: 20 }}>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters}
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
                Clear Filters
              </button>
            </div>
          )}

          {/* GRID VIEW */}
          {!loading && filtered.length > 0 && viewMode === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {filtered.map(pandit => {
                const rating = parseFloat(pandit.avg_rating) || 0;
                const specs = (pandit.specialization || '').split(',').map(s => s.trim()).filter(Boolean);
                const avatarBg = AVATAR_COLORS[pandit.pandit_id % AVATAR_COLORS.length];
                return (
                  <div key={pandit.pandit_id} className="pandit-card"
                    onClick={() => navigate(`/pandits/${pandit.pandit_id}`)}
                    style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    {/* Avatar area */}
                    <div style={{ background: avatarBg, padding: '28px 20px 20px', textAlign: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(34,197,94,0.9)', color: '#fff', fontSize: 10, borderRadius: 20, padding: '3px 8px', fontWeight: 600 }}>
                        <i className="fas fa-check-circle me-1"></i>Verified
                      </div>
                      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
                        {pandit.profile_pic
                          ? <img src={pandit.profile_pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : initials(pandit.full_name)
                        }
                      </div>
                    </div>
                    {/* Card body */}
                    <div style={{ padding: '16px 20px 20px' }}>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#1A0F00', margin: '0 0 4px', textAlign: 'center' }}>{pandit.full_name}</h3>
                      {specs[0] && <p style={{ color: '#f97316', fontSize: 12, fontWeight: 600, textAlign: 'center', margin: '0 0 8px' }}>{specs[0]}</p>}
                      {pandit.experience_years && <p style={{ color: '#9B7355', fontSize: 12, textAlign: 'center', margin: '0 0 10px' }}>{pandit.experience_years} years experience</p>}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                        <StarRating rating={rating} />
                        {rating > 0
                          ? <><span style={{ fontWeight: 700, fontSize: 13 }}>{rating.toFixed(1)}</span><span style={{ color: '#9B7355', fontSize: 12 }}>({pandit.review_count})</span></>
                          : <span style={{ color: '#9B7355', fontSize: 12 }}>No reviews</span>
                        }
                      </div>
                      {pandit.location && (
                        <p style={{ color: '#9B7355', fontSize: 12, textAlign: 'center', margin: '0 0 10px' }}>
                          <i className="fas fa-map-marker-alt me-1" style={{ color: '#f97316' }}></i>{pandit.location}
                        </p>
                      )}
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#1A0F00' }}>
                            {pandit.price_per_ceremony ? `Rs. ${Number(pandit.price_per_ceremony).toLocaleString()}` : 'On request'}
                          </div>
                        </div>
                        <button onClick={e => handleBook(pandit.pandit_id, e)}
                          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {!loading && filtered.length > 0 && viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map(pandit => {
                const rating = parseFloat(pandit.avg_rating) || 0;
                const specs = (pandit.specialization || '').split(',').map(s => s.trim()).filter(Boolean);
                const avatarBg = AVATAR_COLORS[pandit.pandit_id % AVATAR_COLORS.length];
                return (
                  <div key={pandit.pandit_id} className="pandit-card"
                    onClick={() => navigate(`/pandits/${pandit.pandit_id}`)}
                    style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    {/* Avatar */}
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(249,115,22,0.2)' }}>
                      {pandit.profile_pic
                        ? <img src={pandit.profile_pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials(pandit.full_name)
                      }
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: '#1A0F00', margin: 0 }}>{pandit.full_name}</h3>
                        <span style={{ background: 'rgba(34,197,94,0.1)', color: '#166534', fontSize: 10, borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>✓ Verified</span>
                      </div>
                      {specs[0] && <p style={{ color: '#f97316', fontSize: 13, fontWeight: 600, margin: '0 0 6px' }}>{specs[0]}</p>}
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#9B7355' }}>
                        <span><StarRating rating={rating} /> <strong style={{ color: '#1A0F00' }}>{rating > 0 ? rating.toFixed(1) : '—'}</strong> ({pandit.review_count || 0} reviews)</span>
                        {pandit.location && <span><i className="fas fa-map-marker-alt me-1" style={{ color: '#f97316' }}></i>{pandit.location}</span>}
                        {pandit.experience_years && <span><i className="fas fa-clock me-1" style={{ color: '#f97316' }}></i>{pandit.experience_years} yrs</span>}
                      </div>
                    </div>
                    {/* Price + actions */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1A0F00', marginBottom: 10 }}>
                        {pandit.price_per_ceremony ? `Rs. ${Number(pandit.price_per_ceremony).toLocaleString()}` : 'On request'}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={e => { e.stopPropagation(); navigate(`/pandits/${pandit.pandit_id}`); }}
                          style={{ background: 'transparent', color: '#f97316', border: '1.5px solid rgba(249,115,22,0.4)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          View
                        </button>
                        <button onClick={e => handleBook(pandit.pandit_id, e)}
                          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}