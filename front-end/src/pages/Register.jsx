import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    experience_years: "",
    specialization: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // avoid showing register form if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = userType === 'user' ? '/api/auth/register' : '/api/auth/pandit/register';
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // user will navigate to login but we don't want register on history
        navigate('/login', { replace: true });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check if server is running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5eb 0%, #ffffff 50%, #fef3c7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        rel="stylesheet"
      />
      
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
          <div 
            className="card-header text-center text-white" 
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              borderRadius: '20px 20px 0 0',
              padding: '2rem'
            }}
          >
            <h2 className="mb-2">Create Account</h2>
            <p className="mb-0 opacity-75">Join Pandit Booking System</p>
          </div>

          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item flex-fill">
              <button
                className={`nav-link w-100 ${userType === 'user' ? 'active' : ''}`}
                onClick={() => setUserType('user')}
                style={{
                  border: 'none',
                  fontWeight: '600',
                  padding: '1rem',
                  backgroundColor: userType === 'user' ? '#fff5eb' : 'transparent',
                  color: userType === 'user' ? '#f97316' : '#6c757d',
                  borderBottom: userType === 'user' ? '3px solid #f97316' : 'none'
                }}
              >
                User Register
              </button>
            </li>
            <li className="nav-item flex-fill">
              <button
                className={`nav-link w-100 ${userType === 'pandit' ? 'active' : ''}`}
                onClick={() => setUserType('pandit')}
                style={{
                  border: 'none',
                  fontWeight: '600',
                  padding: '1rem',
                  backgroundColor: userType === 'pandit' ? '#fff5eb' : 'transparent',
                  color: userType === 'pandit' ? '#f97316' : '#6c757d',
                  borderBottom: userType === 'pandit' ? '3px solid #f97316' : 'none'
                }}
              >
                Pandit Register
              </button>
            </li>
          </ul>

          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="fas fa-user me-2"></i>Full Name
              </label>
              <input
                className="form-control"
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="fas fa-envelope me-2"></i>Email
              </label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="fas fa-lock me-2"></i>Password
              </label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {userType === 'pandit' && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Experience (Years)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="experience_years"
                    placeholder="Years of experience"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Specialization</label>
                  <input
                    className="form-control"
                    type="text"
                    name="specialization"
                    placeholder="E.g., Wedding, Puja"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <input
                    className="form-control"
                    type="text"
                    name="location"
                    placeholder="Your city/area"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button
              className="btn btn-primary w-100 mb-3 fw-semibold"
              onClick={handleRegister}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                border: 'none',
                padding: '0.75rem',
                fontSize: '1.1rem',
                borderRadius: '10px'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus me-2"></i>
                  Register as {userType === 'user' ? 'User' : 'Pandit'}
                </>
              )}
            </button>

            <p className="text-center mb-0">
              Already have an account?{' '}
              <button 
                className="btn btn-link text-decoration-none fw-bold p-0"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}