import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import FoodCard from "./components/food/FoodCard";
import { mockFood } from "./data/mockFood";

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-2 text-4xl font-extrabold">Khana baanto, khushiyan badhao</h1>
      <p className="mb-8 text-muted">Aaspaas ka bacha hua khana, zaruratmand tak.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockFood.map((f) => <FoodCard key={f.id} food={f} />)}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}