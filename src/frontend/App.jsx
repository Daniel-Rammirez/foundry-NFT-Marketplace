import "./App.css";
import { NavBar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Purchases } from "./pages/Purchases";
import { Listings } from "./pages/Listings";
import { Create } from "./pages/Create";

function App() {
  return (
    <>
      <div className="p-5 bg-zinc-600 shadow flex-wrap">
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Create" element={<Create />} />
        <Route path="/Listings" element={<Listings />} />
        <Route path="/Purchases" element={<Purchases />} />
      </Routes>
    </>
  );
}

export default App;
