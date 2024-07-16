// src/pages/Referrals.js
import React, { useState, useEffect } from 'react';
import { getUserByWallet, registerReferral, editWallet } from '../contracts';
import ConnectWallet from '../components/ConnectWallet';

const Referrals = () => {
  const [userInfo, setUserInfo] = useState({});
  const [referralAddress, setReferralAddress] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  // useEffect(() => {
  //   if (web3 && account) {
  //     const fetchUserInfo = async () => {
  //       const user = await getUserByWallet(web3, account);
  //       setUserInfo(user);
  //     };

  //     fetchUserInfo();
  //   }
  // }, [web3, account]);

  const handleRegisterReferral = async () => {
    await registerReferral(web3, account, referralAddress);
    const user = await getUserByWallet(web3, account);
    setUserInfo(user);
  };

  const handleEditWallet = async () => {
    await editWallet(web3, account, newWalletAddress);
    const user = await getUserByWallet(web3, account);
    setUserInfo(user);
  };

  return (
    <div className="container mt-5">
      <ConnectWallet onConnect={(web3, account) => { setWeb3(web3); setAccount(account); }} />
      {web3 && (
        <>
          <h2>Referrals</h2>
          <p>User Info: {JSON.stringify(userInfo)}</p>
          <input
            type="text"
            placeholder="Referral Address"
            value={referralAddress}
            onChange={(e) => setReferralAddress(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleRegisterReferral}>
            Register Referral
          </button>
          <br />
          <input
            type="text"
            placeholder="New Wallet Address"
            value={newWalletAddress}
            onChange={(e) => setNewWalletAddress(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleEditWallet}>
            Edit Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default Referrals;
