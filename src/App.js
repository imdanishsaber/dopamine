// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Referrals from './pages/Referrals';
import Airdrop from './pages/Airdrop';
import HowItWorks from './pages/HowItWorks';
import { useDispatch } from 'react-redux';

import { setReferral } from './redux/referralSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referral = params.get('referral');
    if (referral) {
      dispatch(setReferral(referral));
    }
  }, [dispatch]);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/airdrop" element={<Airdrop />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
  )
};

export default App;

  // return await dopamineContract.methods.registerReferral(referralAddress).send({ from: account });
  // return await dopamineContract.methods.editWallet(newWalletAddress).send({ from: account });
