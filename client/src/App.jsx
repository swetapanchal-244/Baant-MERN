import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddFood from "./pages/donor/AddFood";
import NearbyFood from "./pages/ngo/NearbyFood";
import MyPickups from "./pages/ngo/Mypickups";
import { Toaster } from "react-hot-toast";

function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/donor") ||
    pathname.startsWith("/ngo");

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

        <Route path="/donor" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/add" element={<ProtectedRoute role="donor"><AddFood /></ProtectedRoute>} />

        <Route path="/ngo" element={<ProtectedRoute role="ngo"><NearbyFood /></ProtectedRoute>} />
        <Route path="/ngo/pickups" element={<ProtectedRoute role="ngo"><MyPickups /></ProtectedRoute>} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();
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
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: "16px", background: "#fff", color: "#2B3A33" } }} />
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}