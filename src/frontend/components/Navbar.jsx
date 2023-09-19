import MarketFlag from "../images/MarketFlag.png";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";
import { useState } from "react";

function Logo() {
  return (
    <NavLink to="/">
      <img
        className="h-10 inline"
        src={MarketFlag}
        alt="Flag icon to represent the marketplace spirit"
      />
    </NavLink>
  );
}

function NavLinks() {
  return (
    <div className="flex space-x-20 flex-wrap">
      <ul className="flex space-x-6 md:items-center font-medium text-xl text-white ">
        <li>
          <NavLink className="text-white" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="text-white" to="/Create">
            Create
          </NavLink>
        </li>
        <li>
          <NavLink className="text-white" to="/Listings">
            Listings
          </NavLink>
        </li>
        <li>
          <NavLink className="text-white" to="/Purchases">
            Purchases
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="flex justify-between">
        <Logo />
        <div className="hidden md:flex">
          <NavLinks />
        </div>
        <button className="text-xl">Connect Wallet</button>
        {isOpen && (
          <div className="flex flex-col">
            <NavLinks />
          </div>
        )}
        <div className="md:hidden">
          <button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>
    </>
  );
}
