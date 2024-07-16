// src/pages/Airdrop.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getDopamineTokenUserSupply, getUSDCBalance } from '../contracts';
import ConnectWallet from '../components/ConnectWallet';

const Airdrop = () => {
  const [dopamineSupply, setDopamineSupply] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (web3 && account) {
      const fetchBalances = async () => {
        const dopamine = await getDopamineTokenUserSupply(web3, account);
        const usdc = await getUSDCBalance(web3, account);
        setDopamineSupply(dopamine);
        setUsdcBalance(usdc);
      };

      fetchBalances();
    }
  }, [web3, account]);

  return (
    <div className="container mt-5">
      <ConnectWallet onConnect={(web3, account) => { setWeb3(web3); setAccount(account); }} />
      {web3 && (
        <>
          <h2>Airdrop</h2>
          <p>Dopamine Token Supply: {dopamineSupply}</p>
          <p>USDC Balance: {usdcBalance}</p>
        </>
      )}
    </div>
  );
};

export default Airdrop;
