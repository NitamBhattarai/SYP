import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import PanditProfile from "./pages/PanditProfile";
import Availability from "./pages/Availability";
import UserBookings from "./pages/UserBookings";
import CreateBooking from "./pages/CreateBooking";
import PanditBookings from "./pages/PanditBookings";
import BrowsePandits from "./pages/BrowsePandits";
import AdminPanel from "./pages/AdminPanel";
import PanditDetail from "./pages/PanditDetail";
import Library from "./pages/Library";
import About from "./pages/About";
import Messages from "./pages/Messages";
import Horoscope from "./pages/Horoscope";
import VideoCall from "./pages/Videocall";
import PanditAnalytics from "./pages/PanditAnalytics";

const HIDE_NAVBAR_ROUTES = ["/login", "/register", "/admin"];

function Layout() {
  const location = useLocation();
  const hideNavbar = HIDE_NAVBAR_ROUTES.includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pandit/profile" element={<PanditProfile />} />
        <Route path="/pandit/availability" element={<Availability />} />
        <Route path="/bookings" element={<UserBookings />} />
        <Route path="/create-booking" element={<CreateBooking />} />
        <Route path="/pandit/bookings" element={<PanditBookings />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/pandits" element={<BrowsePandits />} />
        <Route path="/pandits/:id" element={<PanditDetail />} />
        <Route path="/library" element={<Library />} />
        <Route path="/call/:callId" element={<VideoCall />} />
        <Route path="/pandit/analytics" element={<PanditAnalytics />} />
        <Route
          path="*"
          element={
            <div className="container mt-5">
              <h2>Page not found</h2>
            </div>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/horoscope" element={<Horoscope />} />
      </Routes>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch {
        localStorage.clear();
      }
    }
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
