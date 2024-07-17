import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DOPE_CONTRACT_ABI, DOPE_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Airdrop = () => {
  const [dopeBalance, setDopeBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [finalSupply, setFinalSupply] = useState(0);
  const [projectedInitialPrice, setProjectedInitialPrice] = useState(0);
  const { account, web3 } = useSelector((state) => state.connection);

  useEffect(() => {
    const fetchBalances = async () => {
      if (web3 && account) {
        try {
          const dopeContract = new web3.eth.Contract(DOPE_CONTRACT_ABI, DOPE_CONTRACT_ADDRESS);
          const usdcContract = new web3.eth.Contract(USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS);

          const dopeBalance = await dopeContract.methods.balanceOf(account).call();
          const usdcBalance = await usdcContract.methods.balanceOf(DOPE_CONTRACT_ADDRESS).call();
          const finalSupply = await dopeContract.methods.totalSupply().call();

          console.log('dopeBalance:', dopeBalance);
          console.log('usdcBalance:', usdcBalance);
          console.log('finalSupply:', finalSupply);

          const dopeBalanceNumber = parseFloat(web3.utils.fromWei(dopeBalance.toString(), 'ether'));
          const usdcBalanceNumber = parseFloat(web3.utils.fromWei(usdcBalance.toString(), 'mwei'));
          const finalSupplyNumber = parseFloat(web3.utils.fromWei(finalSupply.toString(), 'ether'));

          setDopeBalance(dopeBalanceNumber);
          setUsdcBalance(usdcBalanceNumber);
          setFinalSupply(finalSupplyNumber);

          if (usdcBalanceNumber > 0 && finalSupplyNumber > 0) {
            const liquidityAmount = usdcBalanceNumber / 2;
            const initialPrice = (0.05 * finalSupplyNumber * (liquidityAmount / 2)) / liquidityAmount;
            setProjectedInitialPrice(initialPrice);
          } else {
            setProjectedInitialPrice(0);
          }

        } catch (error) {
          console.error('Error fetching balances:', error);
          toast.error('Failed to fetch balances');
        }
      }
    };
    fetchBalances();
  }, [web3, account]);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Airdrop</h2>
      <div className="row">
        <div className="col-12 mb-4">
          <p>Text about the airdrop...</p>
        </div>
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="box">
            <h5>Your DOPE Balance</h5>
            <p><span className='text-primary'>{dopeBalance} DOPE</span></p>
            <p><span className='text-primary'>{(finalSupply > 0 ? ((dopeBalance / finalSupply) * 100).toFixed(2) : 0)}%</span> of the total supply</p>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="box">
            <h5>USDC Balances</h5>
            <p><strong>Liquidity:</strong><span className='text-primary'> {(usdcBalance / 2).toFixed(2)} USDC</span></p>
            <p><strong>Security:</strong> <span className='text-primary'>{(usdcBalance / 2).toFixed(2)} USDC</span></p>
            <p><strong>Projected Initial Price of DOPE:</strong> <span className='text-primary'>${projectedInitialPrice.toFixed(2)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
