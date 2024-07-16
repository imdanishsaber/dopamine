// src/pages/Main.js
import React, { useEffect, useState } from 'react';
import { getCurrentSubLotteryInfo, buySubLotteryTicket } from '../contracts';
import Web3 from 'web3';

const Main = () => {
  const [subLotteryInfo, setSubLotteryInfo] = useState({});
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        console.error('No web3 provider found. Please install MetaMask.');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchSubLotteryInfo = async () => {
      if (web3 && account) {
        const info = await getCurrentSubLotteryInfo(web3, account);
        setSubLotteryInfo(info);
      }
    };
    fetchSubLotteryInfo();
  }, [web3, account]);

  const buyTicket = async () => {
    if (web3 && account) {
      await buySubLotteryTicket(web3, account, 1);
      // Update the lottery info after buying a ticket
      const info = await getCurrentSubLotteryInfo(web3, account);
      setSubLotteryInfo(info);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <h2>Main Lottery</h2>
          <p>Round Number: {subLotteryInfo.roundNumber}</p>
          <p>End Block: {subLotteryInfo.endBlock}</p>
          <p>Tickets Sold: {subLotteryInfo.ticketsSold}</p>
          <p>Total Prize: {subLotteryInfo.totalPrize}</p>
          <button className="btn btn-primary" onClick={buyTicket}>Buy Ticket</button>
        </div>
      </div>
    </div>
  );
};

export default Main;
