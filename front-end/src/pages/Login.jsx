import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // redirect away if already authenticated
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

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const endpoint = userType === 'user'
        ? '/api/auth/login'
        : userType === 'pandit'
        ? '/api/auth/pandit/login'
        : '/api/auth/admin/login';
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType || userType);
        localStorage.setItem('userData', JSON.stringify(data.user || data.pandit));
        window.dispatchEvent(new Event('authChange'));
        if (data.userType === 'admin' || userType === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if server is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        rel="stylesheet"
      />
      
      {/* Left Side - Image Background */}
      <div 
        className="col-lg-7 col-md-7 d-none d-md-flex align-items-center justify-content-center position-relative"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9) 0%, rgba(251, 146, 60, 0.8) 100%), url("https://images.unsplash.com/photo-1604608672516-f1b6d6c9b164?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlend: 'overlay'
        }}
      >
        <div className="text-center text-white p-5" style={{ maxWidth: '600px' }}>
          <i className="fas fa-pray mb-4" style={{ fontSize: '5rem', opacity: 0.9 }}></i>
          <h1 className="display-4 fw-bold mb-4">Pandit Booking System</h1>
          <p className="fs-5 mb-4" style={{ lineHeight: '1.8' }}>
            Connect with experienced pandits for all your spiritual needs. 
            Book services for weddings, pujas, and religious ceremonies with ease.
          </p>
          <div className="d-flex justify-content-center gap-4 mt-5">
            <div className="text-center">
              <div className="fs-2 fw-bold">500+</div>
              <div className="text-white-50">Verified Pandits</div>
            </div>
            <div className="text-center">
              <div className="fs-2 fw-bold">10K+</div>
              <div className="text-white-50">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="fs-2 fw-bold">50+</div>
              <div className="text-white-50">Services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="col-lg-5 col-md-5 d-flex align-items-center justify-content-center p-5 bg-white">
        <div style={{ maxWidth: '450px', width: '100%' }}>
          {/* Logo/Brand */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
              }}
            >
              <i className="fas fa-om text-white" style={{ fontSize: '2rem' }}></i>
            </div>
            <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a' }}>Welcome Back</h2>
            <p className="text-muted">Sign in to access your account</p>
          </div>

          {/* User Type Tabs */}
          <div className="btn-group w-100 mb-4" role="group">
            <button
              type="button"
              className={`btn ${userType === 'user' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setUserType('user')}
              style={{
                background: userType === 'user' ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' : 'transparent',
                border: userType === 'user' ? 'none' : '2px solid #dee2e6',
                color: userType === 'user' ? 'white' : '#6c757d',
                fontWeight: '600',
                padding: '12px'
              }}
            >
              <i className="fas fa-user me-2"></i>User
            </button>
            <button
              type="button"
              className={`btn ${userType === 'pandit' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setUserType('pandit')}
              style={{
                background: userType === 'pandit' ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' : 'transparent',
                border: userType === 'pandit' ? 'none' : '2px solid #dee2e6',
                color: userType === 'pandit' ? 'white' : '#6c757d',
                fontWeight: '600',
                padding: '12px'
              }}
            >
              <i className="fas fa-user-tie me-2"></i>Pandit
            </button>
            <button
              type="button"
              className={`btn ${userType === 'admin' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setUserType('admin')}
              style={{
                background: userType === 'admin' ? 'linear-gradient(135deg, #1A0F00 0%, #57534E 100%)' : 'transparent',
                border: userType === 'admin' ? 'none' : '2px solid #dee2e6',
                color: userType === 'admin' ? 'white' : '#6c757d',
                fontWeight: '600',
                padding: '12px'
              }}
            >
              <i className="fas fa-shield-alt me-2"></i>Admin
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              <i className="fas fa-envelope me-2" style={{ color: '#f97316' }}></i>
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                padding: '12px 16px'
              }}
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              <i className="fas fa-lock me-2" style={{ color: '#f97316' }}></i>
              Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control form-control-lg"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  paddingRight: '45px'
                }}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  border: 'none',
                  background: 'transparent',
                  color: '#6c757d'
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label text-muted" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button 
              className="btn btn-link text-decoration-none p-0"
              style={{ color: '#f97316', fontWeight: '600' }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            className="btn btn-lg w-100 mb-3 text-white fw-semibold"
            onClick={handleSubmit}
            disabled={loading || !formData.email || !formData.password}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '1.1rem'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </>
            )}
          </button>

          {/* Register Link */}
          <p className="text-center text-muted mb-0">
            Don't have an account?{' '}
            <button 
              className="btn btn-link text-decoration-none fw-bold p-0"
              onClick={() => navigate('/register')}
              style={{ color: '#f97316' }}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}







