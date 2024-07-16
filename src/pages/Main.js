// src/pages/Main.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { getCurrentSubLotteryInfo, buySubLotteryTicket } from '../contracts';
import LotteryProgress from '../components/LotteryProgress'
import {
  DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS,
  REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS,
  POINTS_CONTRACT_ABI, POINTS_CONTRACT_ADDRESS,
  USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS,
  DOPE_CONTRACT_ABI, DOPE_CONTRACT_ADDRESS
} from '../config';
import SubLottery from '../components/SubLottery';

const Main = () => {
  const referral = useSelector((state) => state.referral.referral);
  const { account, web3 } = useSelector((state) => state.connection);

  const [dopamineContract, setDopamineContract] = useState({});
  const [referralsContract, setReferralsContract] = useState({});
  const [pointsContract, setPointsContract] = useState({});
  const [dopeContract, setDopeContract] = useState({});

  const [currentBlock, setCurrentBlock] = useState(null);
  const [mainLotteryInfo, setMainLotteryInfo] = useState(null);
  const [mainLotteryTickets, setMainLotteryTickets] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (web3) {
        const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
        setDopamineContract(dopamineContract)

        const [
          currentBlock,
          mainLotteryInfo,
        ] = await Promise.all([
          dopamineContract.methods.getCurrentBlock().call(),
          dopamineContract.methods.getCurrentMainLotteryInfo().call(),
        ]);
        console.log('mainLotteryInfo:', mainLotteryInfo);
        console.log('currentBlock:', currentBlock);
        setCurrentBlock(Number(currentBlock))
        setMainLotteryInfo(mainLotteryInfo)
      }
    };
    fetchData();
  }, [web3]);

  useEffect(() => {
    const fetchData = async () => {
      if (web3 && account) {
        const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
        setDopamineContract(dopamineContract)
        const mainLotteryTickets = await dopamineContract.methods.countMainLotteryTickets(account).call();
        console.log('mainLotteryTickets:', mainLotteryTickets);
        setMainLotteryTickets(Number(mainLotteryTickets))
      }
    };
    fetchData();
  }, [account]);

  const approveToken = async () => {
    try {
      const usdcContract = new web3.eth.Contract(USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS);
      const allowanceBN = await usdcContract.methods.allowance(account, DOPAMINE_CONTRACT_ADDRESS).call();
      const allowance = Number(allowanceBN);
      console.log('allowance:', web3.utils.fromWei(allowance, 'mwei'));

      if (allowance) {
        return true;
      }

      await usdcContract.methods.approve(DOPAMINE_CONTRACT_ADDRESS, 10000000000).send({ from: account })
        .on('transactionHash', (hash) => {
          console.log('Transaction Hash:', hash);
          toast.info('Approve USDC transaction sent!');
        })
        .on('receipt', (receipt) => {
          console.log('receipt:', receipt);
          toast.success('Approve USDC transaction completed successfully!');
        })
        .on('error', (error, receipt) => {
          console.log('error, receipt:', error, receipt);
          toast.error('Approve USDC  transaction failed!');
          throw new Error('Approval transaction failed!');
        });
      return true;
    } catch (error) {
      console.log('error:', error);
      toast.error('Approve USDC  transaction failed!');
      return false;
    }
  };

  const buyTicket = async (ticketId) => {
    if (!web3 || !account) {
      toast.info('Please connect your wallet!');
      return;
    }

    let approvalSuccess = await approveToken();

    if (approvalSuccess) {
      try {
        await dopamineContract.methods.buySubLotteryTicket(ticketId, referral ? referral : '').send({ from: account })
          .on('transactionHash', (hash) => {
            console.log('Buy lottery transaction Hash:', hash);
            toast.info('Buy lottery transaction sent!');
          })
          .on('receipt', (receipt) => {
            console.log('receipt:', receipt);
            toast.success('Buy lottery transaction completed successfully!');
          })
          .on('error', (error, receipt) => {
            console.log('error, receipt:', error, receipt);
            toast.error('Buy lottery transaction failed!');
          });
      } catch (error) {
        console.log('error:', error);
        toast.error('Buy lottery transaction failed!');
      }
    }
  };
  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="box">
            {
              mainLotteryInfo && Object.keys(mainLotteryInfo).length > 0 ?
                <h1>${Number(mainLotteryInfo?.totalPrize)}</h1>
                :
                ""
            }
            <p className='price'>Price</p>
            {
              currentBlock &&
              <LotteryProgress lotteryInfo={mainLotteryInfo} currentBlock={currentBlock} />
            }
            {
              account &&
              <p className="ticket">YOUR TICKET: {mainLotteryTickets}</p>
            }
            <h2>Main Lottery</h2>
            <p className='desc'>Description</p>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <SubLottery
            lotteryNumber={1}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            onBuyTicket={(num) => buyTicket(num)}
          />
          <SubLottery
            lotteryNumber={2}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            onBuyTicket={(num) => buyTicket(num)}
          />
          <SubLottery
            lotteryNumber={3}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            onBuyTicket={(num) => buyTicket(num)}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
