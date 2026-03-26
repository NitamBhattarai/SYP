import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const UserView = () => (
    <div className="container">
      <div className="row mb-5">
        <div className="col-12 text-center text-md-start">
          <span className="badge bg-orange-light text-orange px-3 py-2 rounded-pill mb-3 fw-bold">
            DEVOTEE DASHBOARD
          </span>
          <h1 className="display-5 serif-font fw-bold text-dark">
            Namaste, <span className="text-orange">{userData.full_name || 'Devotee'}</span>
          </h1>
          <p className="text-muted fs-5">Manage your sacred ceremonies and spiritual journey.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white dashboard-card hover-up" onClick={() => navigate('/bookings')}>
            <div className="icon-circle mb-4">
              <i className="fas fa-calendar-alt fs-3 text-orange"></i>
            </div>
            <h4 className="fw-bold serif-font mb-2">My Bookings</h4>
            <p className="text-muted small">Check status, dates, and details of your upcoming rituals.</p>
            <div className="mt-auto text-orange fw-bold small">View History <i className="fas fa-arrow-right ms-1"></i></div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white dashboard-card hover-up" onClick={() => navigate('/create-booking')}>
            <div className="icon-circle mb-4 bg-orange-gradient text-white">
              <i className="fas fa-search fs-3"></i>
            </div>
            <h4 className="fw-bold serif-font mb-2">Book New Puja</h4>
            <p className="text-muted small">Discover verified Vedic scholars and book your next ceremony.</p>
            <div className="mt-auto text-orange fw-bold small">Explore Now <i className="fas fa-arrow-right ms-1"></i></div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white dashboard-card hover-up" onClick={() => navigate('/messages')}>
            <div className="icon-circle mb-4">
              <i className="fas fa-comment-medical fs-3 text-orange"></i>
            </div>
            <h4 className="fw-bold serif-font mb-2">Messages</h4>
            <p className="text-muted small">Chat directly with your booked Pandits about samagri and timing.</p>
            <div className="mt-auto text-orange fw-bold small">Open Chats <i className="fas fa-arrow-right ms-1"></i></div>
          </div>
        </div>

        <div className="col-12 mt-5">
          <div className="p-4 rounded-4 border bg-white d-flex flex-column flex-md-row justify-content-around text-center shadow-sm">
            <div className="py-2">
              <h3 className="fw-bold text-dark mb-0">0</h3>
              <small className="text-muted text-uppercase fw-bold">Active Pujas</small>
            </div>
            <div className="border-end d-none d-md-block"></div>
            <div className="py-2">
              <h3 className="fw-bold text-dark mb-0">0</h3>
              <small className="text-muted text-uppercase fw-bold">Reviews Given</small>
            </div>
            <div className="border-end d-none d-md-block"></div>
            <div className="py-2">
              <h3 className="fw-bold text-dark mb-0">Nepal</h3>
              <small className="text-muted text-uppercase fw-bold">Primary Location</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PanditView = () => (
    <div className="container">
      <div className="row mb-5 align-items-center">
        <div className="col-md-8 text-center text-md-start">
          <span className="badge bg-gold-light text-gold px-3 py-2 rounded-pill mb-3 fw-bold">
            <i className="fas fa-certificate me-1"></i> PANDIT CONTROL PANEL
          </span>
          <h1 className="display-5 serif-font fw-bold text-dark">
            Namaste, <span className="text-orange">{userData.full_name || 'Pandit Ji'}</span>
          </h1>
          <p className="text-muted fs-5">Manage your Vedic services, schedule, and bookings.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-white hover-up" onClick={() => navigate('/pandit/bookings')}>
            <i className="fas fa-tasks fs-2 text-orange mb-3"></i>
            <h5 className="fw-bold serif-font">Manage Bookings</h5>
            <p className="text-muted small mb-0">Accept or decline requests</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-white hover-up" onClick={() => navigate('/pandit/availability')}>
            <i className="fas fa-clock fs-2 text-orange mb-3"></i>
            <h5 className="fw-bold serif-font">Availability</h5>
            <p className="text-muted small mb-0">Set your working hours</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-white hover-up" onClick={() => navigate('/pandit/profile')}>
            <i className="fas fa-user-edit fs-2 text-orange mb-3"></i>
            <h5 className="fw-bold serif-font">My Profile</h5>
            <p className="text-muted small mb-0">Update fees & specialty</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-white hover-up" onClick={() => navigate('/messages')}>
            <i className="fas fa-comments fs-2 text-orange mb-3"></i>
            <h5 className="fw-bold serif-font">Messages</h5>
            <p className="text-muted small mb-0">Chat with your clients</p>
          </div>
        </div>

        {/* Analytics Card — replaces old empty Payments card */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center bg-white hover-up" onClick={() => navigate('/pandit/analytics')}>
            <i className="fas fa-chart-bar fs-2 text-orange mb-3"></i>
            <h5 className="fw-bold serif-font">Analytics</h5>
            <p className="text-muted small mb-0">View bookings, ratings & stats</p>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="card border-0 shadow-sm rounded-5 p-5 text-center bg-orange-gradient text-white position-relative overflow-hidden">
            <div className="position-relative z-1">
              <i className="fas fa-shield-alt fs-1 mb-3"></i>
              <h2 className="serif-font mb-3">Verification Badge: Active</h2>
              <p className="opacity-75 mx-auto" style={{ maxWidth: '500px' }}>
                Your profile is verified. You are currently visible to all families searching for ritual services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

      {userType === 'pandit' ? <PanditView /> : <UserView />}

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-wrapper {
          background-color: #FDFBF7;
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 60px;
        }
        .serif-font { font-family: 'Playfair Display', serif; }
        .text-orange { color: #f97316; }
        .bg-orange-light { background-color: #FFF4ED; }
        .text-gold { color: #D4AF37; }
        .bg-gold-light { background-color: #FDF9E7; }
        .bg-orange-gradient { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
        .icon-circle {
          width: 65px; height: 65px;
          background: #FFF4ED; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s;
        }
        .dashboard-card { cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.02) !important; }
        .hover-up { cursor: pointer; transition: all 0.3s ease; }
        .hover-up:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(249, 115, 22, 0.1) !important; }
        .hover-up:hover .icon-circle { transform: rotate(-10deg) scale(1.1); }
      `}} />
    </div>
  );
}