// src/pages/Airdrop.js
import React, { useState, useEffect } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import { useSelector } from 'react-redux';
import {
  DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS,
  REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS,
  POINTS_CONTRACT_ABI, POINTS_CONTRACT_ADDRESS,
  USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS,
  DOPE_CONTRACT_ABI, DOPE_CONTRACT_ADDRESS
} from '../config';

const Airdrop = () => {
  const [dopamineSupply, setDopamineSupply] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);

  const [dopamineContract, setDopamineContract] = useState({});
  const [referralsContract, setReferralsContract] = useState({});
  const [pointsContract, setPointsContract] = useState({});
  const [usdcContract, setUsdcContract] = useState({});
  const [dopeContract, setDopeContract] = useState({});
  const { isConnected, account, web3 } = useSelector((state) => state.connection);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (web3 && account) {
  //       const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
  //       const referralsContract = new web3.eth.Contract(REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS);
  //       const pointsContract = new web3.eth.Contract(POINTS_CONTRACT_ABI, POINTS_CONTRACT_ADDRESS);
  //       const usdcContract = new web3.eth.Contract(USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS);
  //       const dopeContract = new web3.eth.Contract(DOPE_CONTRACT_ABI, DOPE_CONTRACT_ADDRESS);
  //       setDopamineContract(dopamineContract)
  //       setReferralsContract(referralsContract)
  //       setPointsContract(pointsContract)
  //       setUsdcContract(usdcContract)
  //       setDopeContract(dopeContract)

  //       const dopamine = await pointsContract.methods.DopamineTokenUserSupply(account).call();
  //       const usdc = await dopamineContract.methods.getUSDCBalance(account).call();
  //       setDopamineSupply(dopamine);
  //       setUsdcBalance(usdc);
  //     }
  //   };
  //   fetchData();
  // }, [web3, account]);

  return (
    <div className="container mt-5">
      <ConnectWallet />
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
