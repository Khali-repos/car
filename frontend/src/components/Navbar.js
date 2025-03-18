import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">AutoTrader Clone</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/register" className="navbar-link">Register</Link>
        </li>
        <li>
          <Link to="/login" className="navbar-link">Login</Link>
        </li>
        <li>
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/vehicles" className="navbar-link">Vehicles</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;