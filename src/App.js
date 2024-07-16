// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Referrals from './pages/Referrals';
import Airdrop from './pages/Airdrop';
import HowItWorks from './pages/HowItWorks';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/referrals" element={<Referrals />} />
      <Route path="/airdrop" element={<Airdrop />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  </Router>
);

export default App;
