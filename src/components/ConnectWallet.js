// src/components/ConnectWallet.js
import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        onConnect(web3, accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("No Ethereum provider found");
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-primary" onClick={connectWallet}>
        Connect Wallet
      </button>
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
};

export default ConnectWallet;
