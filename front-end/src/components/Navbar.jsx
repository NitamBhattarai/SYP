import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("token") : null,
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const onStorage = (e) => { if (e.key === "token") setToken(e.newValue); };
    const onAuthChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    window.addEventListener("authChange", onAuthChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const isDark = isHomePage && !isScrolled && location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    setToken(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const navbarClasses = `navbar navbar-expand-lg fixed-top transition-all ${
    isDark ? "navbar-dark bg-transparent py-3" : "navbar-light bg-white shadow-sm py-2"
  }`;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="container">
          {/* Brand */}
          <button className="navbar-brand btn btn-link text-decoration-none d-flex align-items-center p-0" onClick={() => navigate("/")}>
            <div className="d-flex align-items-center justify-content-center me-2 shadow-sm"
              style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", borderRadius: "10px" }}>
              <i className="fas fa-om text-white fs-4"></i>
            </div>
            <span className="fw-bold fs-3 serif-font" style={{ color: isDark ? "#ffffff" : "#f97316", transition: "0.3s" }}>
              Bahun<span style={{ opacity: isDark ? 0.8 : 1 }}>.Com</span>
            </span>
          </button>

          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-1">
              <li className="nav-item">
                <button className="nav-link btn btn-link fw-semibold nav-hover-effect" onClick={() => navigate("/")}>Home</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link fw-semibold nav-hover-effect" onClick={() => navigate("/pandits")}>Find Pandits</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link fw-semibold nav-hover-effect" onClick={() => navigate("/horoscope")}>Horoscope</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link fw-semibold nav-hover-effect" onClick={() => navigate("/library")}>Library</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link fw-semibold nav-hover-effect" onClick={() => navigate("/about")}>About</button>
              </li>

              <li className="nav-item ms-lg-2">
                {token ? (
                  <div className="d-flex align-items-center gap-2">
                    {/* Messages */}
                    <button className="btn btn-link fw-semibold nav-hover-effect text-decoration-none" onClick={() => navigate("/messages")}
                      style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#444' }}>
                      <i className="fas fa-comments me-1"></i>Messages
                    </button>

                    {/* Notification bell */}
                    <div style={{ border: "1.5px solid rgba(249,115,22,0.35)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <NotificationBell isDark={false} />
                    </div>

                    {/* Dashboard */}
                    <button className="btn text-white fw-bold px-4 rounded-pill shadow-sm transition-hover" onClick={() => navigate("/dashboard")}
                      style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", border: "none" }}>
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </button>

                    {/* Logout */}
                    <button onClick={handleLogout}
                      style={{ background: 'transparent', border: '2px solid #f97316', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f97316', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#f97316'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = '#f97316'; }}>
                      <i className="fas fa-sign-out-alt" style={{ fontSize: 14 }}></i>
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    <button className={`btn fw-bold p-0 border-0 ${isDark ? "text-white-50" : "text-dark"} hover-orange`} onClick={() => navigate("/login")}>
                      Login
                    </button>
                    <button className="btn text-white fw-bold px-4 py-2 rounded-pill shadow transition-hover" onClick={() => navigate("/register")}
                      style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", border: "none" }}>
                      Join us
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .serif-font { font-family: 'Playfair Display', serif; }
        .transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-hover-effect { color: inherit !important; font-size: 0.95rem; transition: 0.3s !important; }
        .navbar-dark .nav-hover-effect { color: rgba(255,255,255,0.8) !important; }
        .navbar-dark .nav-hover-effect:hover { color: #ffffff !important; transform: translateY(-1px); }
        .navbar-light .nav-hover-effect { color: #444 !important; }
        .navbar-light .nav-hover-effect:hover { color: #f97316 !important; }
        .hover-orange:hover { color: #f97316 !important; transition: 0.3s; }
        .transition-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249,115,22,0.4) !important; }
        body { padding-top: 0 !important; }
      `}} />
    </>
  );
}