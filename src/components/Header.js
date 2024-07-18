import React from 'react';
import { NavLink } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';

const Header = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <NavLink className="navbar-brand" to="/">Dopamine Lottery</NavLink>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" to="/referrals" activeclassname="active">Referrals</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/airdrop" activeclassname="active">Airdrop</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/how-it-works" activeclassname="active">How It Works</NavLink>
          </li>
        </ul>
        <ConnectWallet />
      </div>
    </div>
  </nav>
);

export default Header;
