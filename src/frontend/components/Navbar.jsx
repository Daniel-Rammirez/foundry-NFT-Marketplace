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

/* eslint-disable react/prop-types */
function NavLinks({ onClose }) {
  return (
    <ul className="flex space-x-6 md:items-center font-medium text-xl text-white ">
      <li>
        <NavLink className="text-white" to="/" onClick={onClose}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="text-white" to="/Create" onClick={onClose}>
          Create
        </NavLink>
      </li>
      <li>
        <NavLink className="text-white" to="/Listings" onClick={onClose}>
          Listings
        </NavLink>
      </li>
      <li>
        <NavLink className="text-white" to="/Purchases" onClick={onClose}>
          Purchases
        </NavLink>
      </li>
    </ul>
  );
}

export function NavBar({ web3Handler, account }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center">
        <Logo />
        <div className="md:flex space-x-20 hidden">
          <NavLinks />
        </div>
        <button className="text-xl md:hidden text-white" onClick={toggleNavbar}>
          {isOpen ? <X /> : <Menu />}
        </button>
        <div className="md:flex space-x-4 items-center p-2">
          {account ? (
            <NavLink
              to={`https://etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>
                {account.slice(0, 5) + "..." + account.slice(38, 42)}
              </button>
            </NavLink>
          ) : (
            <button className="text-white font-medium" onClick={web3Handler}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden">
          <NavLinks onClose={toggleNavbar} />
        </div>
      )}
    </>
  );
}
