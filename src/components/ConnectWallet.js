// src/components/ConnectWallet.js

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3 from 'web3';

import { useDispatch } from 'react-redux';
import { connect, disconnect } from '../redux/connectionSlice';
import { useSelector } from 'react-redux';

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const { isConnected, account } = useSelector((state) => state.connection);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);

      const id = await web3.eth.net.getId();
      const network_id = Number(id)

      if (network_id !== 8453) {
        toast.error('Please switch your wallet to Base Network!');
      } else {
        const accounts = await web3.eth.getAccounts();
        dispatch(connect({ account: accounts[0], web3: web3 }));
      }
    } else {
      toast.info('Please Install Metamask Wallet!');
    }
  };

  const disconnectWallet = async () => {
    dispatch(disconnect({ account: null, web3: null }));
    toast.info('Metamask Wallet Disconnected!');

  };

  const addrTruncator = (addr) => {
    const start = addr.substring(0, 6);
    const end = addr.substring(addr.length - 4);
    return `${start}...${end}`;
  }

  useEffect(() => {
    // connectWallet()
  }, []);

  return (
    <div className="ms-auto">
      {
        isConnected ?
          <button className="btn btn-primary" onClick={disconnectWallet}>
            {addrTruncator(account)}
          </button>
          :
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
      }
    </div>
  );
};


export default ConnectWallet;
