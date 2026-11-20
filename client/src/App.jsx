import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Lenis from "lenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddFood from "./pages/donor/AddFood";
import NearbyFood from "./pages/ngo/NearbyFood";
import MyPickups from "./pages/ngo/MyPickups";
import AdminPanel from "./pages/admin/AdminPanel";

function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/profile" ||
    pathname.startsWith("/donor") ||
    pathname.startsWith("/ngo") ||
    pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/donor" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/add" element={<ProtectedRoute role="donor"><AddFood /></ProtectedRoute>} />

        <Route path="/ngo" element={<ProtectedRoute role="ngo"><NearbyFood /></ProtectedRoute>} />
        <Route path="/ngo/pickups" element={<ProtectedRoute role="ngo"><MyPickups /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ anchors: true });
    let id;
    const raf = (time) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{ style: { borderRadius: "16px", background: "#fff", color: "#2B3A33" } }}
        />
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}