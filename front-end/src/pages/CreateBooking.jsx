import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreateBooking() {
  const [searchParams] = useSearchParams();
  const fromBrowse = !!searchParams.get('pandit'); // came from browse page
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pandit_id: searchParams.get('pandit') || '',
    service_id: '',
    booking_date: new Date().toISOString().split('T')[0],
    event_date: '',
    availability_id: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [pandits, setPandits] = useState([]);
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedPandit, setSelectedPandit] = useState(null);

  const token = localStorage.getItem('token');

  // Load pandits and services
  useEffect(() => {
    fetch(`${BASE}/api/lookup/pandits`)
      .then(r => r.json()).then(data => {
        if (Array.isArray(data)) setPandits(data);
      })
      .catch(err => console.error(err));

    fetch(`${BASE}/api/lookup/services`)
      .then(r => r.json()).then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(err => console.error(err));
  }, []);

  // When pandits load, find the pre-selected one and load their availability
  useEffect(() => {
    const panditId = searchParams.get('pandit');
    if (panditId && pandits.length > 0) {
      const found = pandits.find(p => String(p.pandit_id) === String(panditId));
      if (found) setSelectedPandit(found);

      fetch(`${BASE}/api/lookup/availability/pandit/${panditId}`)
        .then(r => r.json()).then(data => {
          if (Array.isArray(data)) setAvailability(data);
        })
        .catch(err => console.error(err));
    }
  }, [pandits]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'pandit_id') {
      const found = pandits.find(p => String(p.pandit_id) === String(value));
      setSelectedPandit(found || null);
      setForm(prev => ({ ...prev, pandit_id: value, availability_id: '', booking_date: '', event_date: '' }));
      setAvailability([]);
      if (value) {
        fetch(`${BASE}/api/lookup/availability/pandit/${value}`)
          .then(r => r.json()).then(data => {
            if (Array.isArray(data)) setAvailability(data);
          })
          .catch(err => console.error(err));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectSlot = (slot) => {
    setForm(prev => ({
      ...prev,
      booking_date: slot.available_date,
      event_date: slot.available_date,
      availability_id: slot.availability_id
    }));
    setMessage({ type: 'success', text: `Slot selected: ${slot.available_date} ${slot.start_time} – ${slot.end_time}` });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    fetch(`${BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          if (fromBrowse) {
            setMessage({ type: 'success', text: `Booking submitted! You can contact ${selectedPandit?.full_name || 'the pandit'} at ${selectedPandit?.phone || selectedPandit?.email || 'the contact details on their profile'}. Redirecting...` });
            setTimeout(() => navigate('/bookings'), 3000);
          } else {
            navigate('/dashboard');
          }
        } else {
          setMessage({ type: 'danger', text: data.message || 'Booking failed' });
        }
      })
      .catch(() => setMessage({ type: 'danger', text: 'Server error. Please try again.' }))
      .finally(() => setLoading(false));
  };

  const formContent = (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

      {message.text && (
        <div className={`alert alert-${message.type} d-flex align-items-center mb-4`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2`}></i>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* Pandit selector — locked if coming from browse */}
          <div className="col-12">
            <label className="form-label fw-bold">Pandit</label>
            {fromBrowse && selectedPandit ? (
              <div style={{ background: 'rgba(249,115,22,0.06)', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {selectedPandit.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1A0F00' }}>{selectedPandit.full_name}</div>
                  <div style={{ fontSize: 12, color: '#9B7355' }}>{selectedPandit.location} · {selectedPandit.experience_years} yrs exp</div>
                </div>
                <i className="fas fa-check-circle ms-auto" style={{ color: '#22C55E' }}></i>
              </div>
            ) : (
              <select name="pandit_id" value={form.pandit_id} onChange={handleChange} className="form-select" required>
                <option value="">Choose your pandit...</option>
                {pandits.map(p => (
                  <option key={p.pandit_id} value={p.pandit_id}>{p.full_name} — {p.location}</option>
                ))}
              </select>
            )}
          </div>

          {/* Pandit price */}
          {selectedPandit?.price_per_ceremony && (
            <div className="col-12">
              <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#9B7355' }}>
                  <i className="fas fa-tag me-2" style={{ color: '#f97316' }}></i>Pandit's ceremony fee
                </span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#1A0F00' }}>
                  Rs. {Number(selectedPandit.price_per_ceremony).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Service */}
          <div className="col-12">
            <label className="form-label fw-bold">Type of Service</label>
            <select name="service_id" value={form.service_id} onChange={handleChange} className="form-select" required>
              <option value="">Select service...</option>
              {services.map(s => (
                <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
              ))}
            </select>
          </div>

          {/* Available slots */}
          {availability.length > 0 && (
            <div className="col-12">
              <label className="form-label fw-bold"><i className="fas fa-clock me-2" style={{ color: '#f97316' }}></i>Available Slots</label>
              <div className="d-flex flex-wrap gap-2">
                {availability.map(slot => (
                  <div
                    key={slot.availability_id}
                    onClick={() => selectSlot(slot)}
                    className={`p-3 border rounded-3 ${form.availability_id === slot.availability_id ? 'border-warning bg-warning bg-opacity-10' : 'bg-white'}`}
                    style={{ cursor: 'pointer', flex: '1 1 calc(33% - 10px)', minWidth: '150px', transition: 'all 0.2s' }}
                  >
                    <div className="small fw-bold">{slot.available_date}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{slot.start_time} – {slot.end_time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.pandit_id && availability.length === 0 && (
            <div className="col-12">
              <div className="alert alert-warning py-2 mb-0">No available slots for this pandit yet.</div>
            </div>
          )}

          {/* Event date only — booking_date is auto-set to today */}
          <div className="col-12">
            <label className="form-label fw-bold">Event Date</label>
            <input type="date" name="event_date" value={form.event_date}
              onChange={handleChange} className="form-control" required
              readOnly={!!form.availability_id}
              min={new Date().toISOString().split('T')[0]}
              style={form.availability_id ? { background: '#f8f9fa' } : {}} />
            <div style={{ fontSize: 12, color: '#9B7355', marginTop: 4 }}>
              <i className="fas fa-info-circle me-1"></i>The date you want the ceremony to take place
            </div>
          </div>

          <div className="col-12 mt-2">
            <button type="submit" className="btn btn-lg w-100 text-white fw-bold" disabled={loading}
              style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', border: 'none', padding: '14px', borderRadius: '12px' }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                : <><i className="fas fa-check-circle me-2"></i>Submit Booking Request</>
              }
            </button>
          </div>

        </div>
      </form>
    </>
  );

  // ── MODAL MODE (from Browse Pandits page) ──
  if (fromBrowse) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,15,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) navigate(-1); }}
        >
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', fontFamily: "'Inter',sans-serif" }}>
            {/* Modal header */}
            <div style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '20px 20px 0 0', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#fff', fontFamily: "'Playfair Display',serif", margin: 0, fontSize: 22 }}>Book a Pandit</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 13, marginTop: 4 }}>Secure your date for a sacred ceremony</p>
              </div>
              <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
            {/* Modal body */}
            <div style={{ padding: '28px' }}>
              {formContent}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── NORMAL PAGE MODE (from Dashboard) ──
  return (
    <div className="min-vh-100 bg-light py-5" style={{ fontFamily: "'Inter',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-header text-center text-white p-4"
                style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', borderRadius: '20px 20px 0 0' }}>
                <i className="fas fa-calendar-check mb-2" style={{ fontSize: '2.5rem' }}></i>
                <h2 className="fw-bold">Book a Pandit</h2>
                <p className="mb-0 opacity-75">Secure your date for a sacred ceremony</p>
              </div>
              <div className="card-body p-4 p-md-5">
                {formContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}