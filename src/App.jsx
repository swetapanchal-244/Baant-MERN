import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddFood from "./pages/donor/AddFood";

function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname === "/login" || pathname === "/register" || pathname.startsWith("/donor");

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
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/donor/add" element={<AddFood />} />
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
      <Layout />
    </BrowserRouter>
  );
}