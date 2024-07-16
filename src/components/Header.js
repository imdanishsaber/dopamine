// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';

const Header = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">Dopamine Lottery</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/referrals">Referrals</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/airdrop">Airdrop</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/how-it-works">How It Works</Link>
          </li>
        </ul>
        <ConnectWallet />
      </div>
    </div>
  </nav>
);

export default Header;
