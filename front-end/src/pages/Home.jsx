import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('loc', locationQuery);
    navigate('/pandits?' + params.toString());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const services = [
    { icon: 'fa-ring', title: 'Wedding Ceremonies', desc: 'Complete Vedic rituals and Vivah Sanskar' },
    { icon: 'fa-hands-praying', title: 'Puja Services', desc: 'Satyanarayan, Griha Shanti, and Havan' },
    { icon: 'fa-baby', title: 'Naming Ceremony', desc: 'Traditional Namkaran sanskar' },
    { icon: 'fa-home', title: 'Griha Pravesh', desc: 'Auspicious house warming ceremonies' },
    { icon: 'fa-calendar-day', title: 'Festival Puja', desc: 'Special Diwali, Navratri & festival pujas' },
    { icon: 'fa-om', title: 'Spiritual Guidance', desc: 'Personal astrology and muhurat consultation' }
  ];

  const features = [
    { icon: 'fa-user-check', title: 'Verified Scholars', desc: '100% background checked and highly experienced.' },
    { icon: 'fa-clock', title: 'Smart Booking', desc: 'Select date, time, and samagri in few clicks.' },
    { icon: 'fa-shield-alt', title: 'Secure Payment', desc: 'Transparent pricing with no hidden costs.' },
    { icon: 'fa-star', title: 'Top Rated', desc: 'Read reviews from thousands of happy families.' }
  ];

  return (
    <div style={{ backgroundColor: '#FDFBF7', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* 1. HERO SECTION */}
      <section
        className="position-relative d-flex align-items-center"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(249, 115, 22, 0.85) 100%), url("https://images.unsplash.com/photo-1604608672516-f1b6d6c9b164?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '85vh',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <div className="container position-relative z-1">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 text-white">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-4 shadow-sm" style={{ fontWeight: '600', letterSpacing: '1px' }}>
                <i className="fas fa-om me-2"></i> NEPAL'S MOST TRUSTED PANDIT NETWORK
              </span>
              <h1 className="display-3 mb-4 serif-font text-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                Sacred Traditions Delivered <br /> <span className="fst-italic" style={{ color: '#FFD700' }}>With Modern Ease</span>
              </h1>
              <p className="fs-5 mb-5 opacity-75 mx-auto" style={{ maxWidth: '700px', lineHeight: '1.8' }}>
                Connect with verified Vedic scholars for weddings, pujas, and spiritual ceremonies.
                Experience authentic rituals at your doorstep in Kathmandu and beyond.
              </p>

              {/* Premium Search Bar */}
              <div className="bg-white p-2 rounded-pill shadow-lg mx-auto d-flex flex-column flex-md-row align-items-center" style={{ maxWidth: '800px' }}>
                <div className="d-flex align-items-center flex-grow-1 px-4 py-2 w-100 border-end-md">
                  <i className="fas fa-search text-muted me-3"></i>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none bg-transparent"
                    placeholder="Search by name or puja (e.g., Ramesh, Satyanarayan)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="d-flex align-items-center flex-grow-1 px-4 py-2 w-100 mt-2 mt-md-0">
                  <i className="fas fa-map-marker-alt text-muted me-3"></i>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none bg-transparent"
                    placeholder="Location (e.g., Lalitpur)"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  className="btn text-white rounded-pill px-5 py-3 fw-bold w-100 w-md-auto mt-2 mt-md-0 shadow"
                  style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', whiteSpace: 'nowrap' }}
                  onClick={handleSearch}
                >
                  Find Pandit
                </button>
              </div>

              {/* Stats */}
              <div className="row g-4 mt-5 pt-3 border-top border-light border-opacity-25 mx-auto" style={{ maxWidth: '800px' }}>
                <div className="col-md-4">
                  <h2 className="fw-bold text-white mb-0 serif-font">500+</h2>
                  <p className="mb-0 text-white-50 text-uppercase small letter-spacing-1">Verified Pandits</p>
                </div>
                <div className="col-md-4">
                  <h2 className="fw-bold text-white mb-0 serif-font">10k+</h2>
                  <p className="mb-0 text-white-50 text-uppercase small letter-spacing-1">Happy Families</p>
                </div>
                <div className="col-md-4">
                  <h2 className="fw-bold text-white mb-0 serif-font">50+</h2>
                  <p className="mb-0 text-white-50 text-uppercase small letter-spacing-1">Vedic Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-5" style={{ backgroundColor: '#FDFBF7' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 serif-font text-dark">Our Divine Services</h2>
            <div className="divider mx-auto my-3 bg-orange rounded"></div>
            <p className="text-muted fs-5">Authentic rituals performed according to sacred scriptures.</p>
          </div>
          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div className="card border-0 h-100 service-card rounded-4 p-2 bg-white">
                  <div className="card-body text-center p-4">
                    <div className="icon-box mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: '80px', height: '80px', backgroundColor: '#FFF4ED', color: '#f97316' }}>
                      <i className={`fas ${service.icon} fs-2`}></i>
                    </div>
                    <h4 className="fw-bold mb-3 serif-font">{service.title}</h4>
                    <p className="text-muted mb-0">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PANDITS */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <h2 className="display-5 serif-font text-dark mb-2">Highly Rated Scholars</h2>
              <p className="text-muted fs-5 mb-0">Book top-rated Vedic experts directly.</p>
            </div>
            <button className="btn btn-outline-dark rounded-pill px-4 py-2 mt-3 mt-md-0" onClick={() => navigate('/pandits')}>View All Profiles</button>
          </div>
          <div className="row g-4">
            {[
              { name: "Pt. Ramesh Sharma", exp: "15+ Years", type: "Rigveda Expert", price: "Rs. 2100", img: "https://images.unsplash.com/photo-1544168190-79c154433778?q=80&w=400" },
              { name: "Pt. Hari Prasad", exp: "20+ Years", type: "Vivah Specialist", price: "Rs. 3100", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
              { name: "Pt. Narayan Shastri", exp: "10+ Years", type: "Vastu & Astrology", price: "Rs. 1500", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" }
            ].map((pandit, idx) => (
              <div className="col-lg-4 col-md-6" key={idx}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden pandit-card">
                  <div className="position-relative">
                    <img src={pandit.img} alt={pandit.name} className="w-100" style={{ height: '260px', objectFit: 'cover' }} />
                    <span className="badge bg-success position-absolute top-0 end-0 m-3 px-3 py-2 shadow-sm">
                      <i className="fas fa-check-circle me-1"></i> Verified
                    </span>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0 serif-font">{pandit.name}</h5>
                      <span className="text-warning fw-bold"><i className="fas fa-star"></i> 4.9</span>
                    </div>
                    <p className="text-muted small mb-3">
                      <i className="fas fa-map-marker-alt me-1 text-orange"></i> Kathmandu • {pandit.exp}
                    </p>
                    <div className="mb-4">
                      <span className="badge border text-dark me-2 bg-light">{pandit.type}</span>
                      <span className="badge border text-dark bg-light">Havan</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <div>
                        <small className="text-muted d-block">Starting from</small>
                        <span className="fw-bold fs-5 text-orange">{pandit.price}</span>
                      </div>
                      <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate('/pandits')}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-5" style={{ backgroundColor: '#FDFBF7' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 serif-font text-dark">Journey to the Divine</h2>
            <div className="divider mx-auto my-3 bg-orange rounded"></div>
            <p className="text-muted fs-5">Book your pandit in 3 effortless steps</p>
          </div>
          <div className="row g-4 position-relative">
            <div className="position-absolute top-50 start-50 translate-middle w-75 border-top border-2 border-orange d-none d-lg-block" style={{ zIndex: 0, opacity: 0.3 }}></div>
            <div className="col-lg-4 text-center position-relative z-1">
              <div className="step-icon mx-auto mb-4 bg-white shadow-lg rounded-circle d-flex align-items-center justify-content-center text-orange fw-bold fs-2" style={{ width: '90px', height: '90px', border: '4px solid #f97316' }}>1</div>
              <h4 className="fw-bold serif-font mb-3">Search & Filter</h4>
              <p className="text-muted px-4">Find the right pandit by entering their name, required puja, language, and city location.</p>
            </div>
            <div className="col-lg-4 text-center position-relative z-1">
              <div className="step-icon mx-auto mb-4 bg-white shadow-lg rounded-circle d-flex align-items-center justify-content-center text-orange fw-bold fs-2" style={{ width: '90px', height: '90px', border: '4px solid #f97316' }}>2</div>
              <h4 className="fw-bold serif-font mb-3">Consult & Book</h4>
              <p className="text-muted px-4">Chat with the pandit, discuss samagri requirements, and secure your booking.</p>
            </div>
            <div className="col-lg-4 text-center position-relative z-1">
              <div className="step-icon mx-auto mb-4 bg-orange text-white shadow-lg rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2" style={{ width: '90px', height: '90px', border: '4px solid #f97316' }}>3</div>
              <h4 className="fw-bold serif-font mb-3">Celebrate Peace</h4>
              <p className="text-muted px-4">Experience a deeply spiritual ceremony performed with utmost devotion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-5">
          <div className="mb-5">
            <h2 className="display-5 serif-font mb-3 text-white">Why Trust Our Platform?</h2>
            <p className="text-white-50 fs-5">Blending traditional purity with modern security.</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <i className={`fas ${feature.icon} fs-1 mb-4`} style={{ color: '#f97316' }}></i>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-white-50 mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="pt-5 pb-4" style={{ backgroundColor: '#111', color: '#ccc' }}>
        <div className="container pt-4">
          <div className="row g-4 mb-5">
            <div className="col-lg-4 pe-lg-5">
              <div className="d-flex align-items-center mb-4">
                <i className="fas fa-om fs-2 text-orange me-3"></i>
                <span className="fw-bold fs-3 text-white serif-font">Bahun.Com</span>
              </div>
              <p className="text-secondary lh-lg">
                Connecting you with experienced pandits for all your spiritual ceremonies and celebrations.
                Preserving Nepal's sacred traditions through modern convenience.
              </p>
            </div>
            <div className="col-lg-2 col-md-4">
              <h5 className="text-white mb-4 fw-bold">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/')}>Home</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/services')}>Services</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/about')}>About Us</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/pandits')}>Find Pandits</button></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h5 className="text-white mb-4 fw-bold">Our Services</h5>
              <ul className="list-unstyled">
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/pandits?q=wedding')}>Wedding Ceremonies</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/pandits?q=puja')}>Puja & Havan</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/pandits?q=festival')}>Festival Planning</button></li>
                <li className="mb-3"><button className="btn btn-link text-secondary text-decoration-none p-0 footer-link" onClick={() => navigate('/horoscope')}>Astrology Reading</button></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h5 className="text-white mb-4 fw-bold">Contact Us</h5>
              <ul className="list-unstyled text-secondary">
                <li className="mb-3 d-flex"><i className="fas fa-phone mt-1 me-3 text-orange"></i> +977-9876543210</li>
                <li className="mb-3 d-flex"><i className="fas fa-envelope mt-1 me-3 text-orange"></i> namaste@bahun.com</li>
                <li className="mb-3 d-flex"><i className="fas fa-map-marker-alt mt-1 me-3 text-orange"></i> Kathmandu, Nepal</li>
              </ul>
              <div className="mt-4">
                <button className="btn btn-outline-secondary btn-sm me-2 rounded-circle" style={{ width: '40px', height: '40px' }}><i className="fab fa-facebook-f"></i></button>
                <button className="btn btn-outline-secondary btn-sm me-2 rounded-circle" style={{ width: '40px', height: '40px' }}><i className="fab fa-twitter"></i></button>
                <button className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: '40px', height: '40px' }}><i className="fab fa-instagram"></i></button>
              </div>
            </div>
          </div>
          <hr className="border-secondary opacity-25" />
          <div className="text-center text-secondary pt-3">
            <p className="mb-0 small">© 2025 Bahun.Com Nepal. All sacred rights reserved.</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .serif-font { font-family: 'Playfair Display', serif; }
        .text-orange { color: #f97316; }
        .bg-orange { background-color: #f97316; }
        .border-orange { border-color: #f97316 !important; }
        .divider { width: 60px; height: 4px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .service-card { transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .service-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        .service-card:hover .icon-box { background-color: #f97316 !important; color: white !important; }
        .pandit-card { transition: all 0.3s ease; }
        .pandit-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
        .footer-link:hover { color: #f97316 !important; padding-left: 5px !important; transition: all 0.2s ease; }
        @media (min-width: 768px) { .border-end-md { border-right: 1px solid #dee2e6; } }
      `}} />
    </div>
  );
}