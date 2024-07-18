import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import LotteryProgress from '../components/LotteryProgress'
import {
  DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS,
  USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS,
} from '../config';
import SubLottery from '../components/SubLottery';

const Main = () => {
  const subLottery1Ref = useRef();
  const subLottery2Ref = useRef();
  const subLottery3Ref = useRef();



  const handleRefresh1 = () => {
    if (subLottery1Ref.current) {
      subLottery1Ref.current.fetchSubLottery();
      subLottery1Ref.current.fetchSubLotteryInfo();
      subLottery1Ref.current.fetchSubLotteryTickets();
    }
  };
  const handleRefresh2 = () => {
    if (subLottery2Ref.current) {
      subLottery2Ref.current.fetchSubLottery();
      subLottery2Ref.current.fetchSubLotteryInfo();
      subLottery2Ref.current.fetchSubLotteryTickets();
    }
  };
  const handleRefresh3 = () => {
    if (subLottery3Ref.current) {
      subLottery3Ref.current.fetchSubLottery();
      subLottery3Ref.current.fetchSubLotteryInfo();
      subLottery3Ref.current.fetchSubLotteryTickets();
    }
  };

  const referral = useSelector((state) => state.referral.referral);
  const { account, web3 } = useSelector((state) => state.connection);

  const [currentBlock, setCurrentBlock] = useState(null);
  const [mainLotteryInfo, setMainLotteryInfo] = useState(null);
  const [mainLotteryTickets, setMainLotteryTickets] = useState(null);

  const [showMainResult, setShowMainResult] = useState(false);
  const [mainWinnerResult, setMainWinnerResult] = useState({});

  const [subLotteryResult, setSubLotteryResult] = useState({});


  const fetchMainLotteryInfo = async () => {
    if (web3) {
      const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);

      const [
        currentBlock,
        mainLotteryInfo,
      ] = await Promise.all([
        dopamineContract.methods.getCurrentBlock().call(),
        dopamineContract.methods.getCurrentMainLotteryInfo().call(),
      ]);
      console.log('mainLotteryInfo:', mainLotteryInfo);
      // console.log('currentBlock:', currentBlock);
      setCurrentBlock(Number(currentBlock));
      setMainLotteryInfo(mainLotteryInfo);
    }
  };

  const fetchMainLotteryTickets = async () => {
    if (web3 && account) {
      const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
      const mainLotteryTickets = await dopamineContract.methods.countMainLotteryTickets(account).call();
      // console.log('mainLotteryTickets:', mainLotteryTickets);
      setMainLotteryTickets(Number(mainLotteryTickets));
    }
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    fetchMainLotteryInfo();
    fetchMainLotteryTickets();
    // }, 2000);

    // return () => clearInterval(interval);
  }, [web3, account]);


  useEffect(() => {
    if (web3) {
      const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
      const handleMainLotteryRoundStart = (error, event) => {
        if (!error) {
          fetchMainLotteryInfo();
          fetchMainLotteryTickets();
          console.log('MainLotteryRoundStart event:', event);
        }
      };

      const handleMainLotteryResult = (error, event) => {
        if (!error) {
          console.log('MainLotteryResult event:', event);
          setShowMainResult(true)
          setTimeout(() => {
            setShowMainResult(false)
          }, 2000);
          setMainWinnerResult(event)
        }
      };

      const mainLotteryRoundStartSubscription = dopamineContract.events.MainLotteryRoundStart();
      mainLotteryRoundStartSubscription.on("connected", (id) => console.log(`Main Lottery Round Start connected at: ${id}`));
      mainLotteryRoundStartSubscription.on('data', handleMainLotteryRoundStart)
      mainLotteryRoundStartSubscription.on('error', console.error);

      const mainLotteryResultSubscription = dopamineContract.events.MainLotteryResult()
      mainLotteryResultSubscription.on("connected", (id) => console.log(`Main Lottery Result connected at: ${id}`));
      mainLotteryResultSubscription.on('data', handleMainLotteryResult)
      mainLotteryResultSubscription.on('error', console.error);

      return () => {
        mainLotteryRoundStartSubscription.unsubscribe();
        mainLotteryResultSubscription.unsubscribe();
      };
    }
  }, [web3]);

  useEffect(() => {
    if (web3) {
      const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
      const handleSubLotteryRoundStart = (error, event) => {
        if (!error) {
          handleRefresh1()
          handleRefresh2()
          handleRefresh3()
          console.log('SubLotteryRoundStart event:', event);
        }
      };

      const handleSubLotteryResult = (error, event) => {
        if (!error) {
          console.log('SubLotteryResult event:', event);
          setSubLotteryResult(event)
          setTimeout(() => {
            setSubLotteryResult({})
          }, 2000);
        }
      };

      const subTicketPurchasedSubscription = dopamineContract.events.SubTicketPurchased();
      subTicketPurchasedSubscription.on("connected", (id) => console.log(`Sub Ticket Purchased connected at: ${id}`));
      subTicketPurchasedSubscription.on('data', handleSubLotteryRoundStart)
      subTicketPurchasedSubscription.on('error', console.error);

      const subLotteryResultSubscription = dopamineContract.events.SubLotteryResult()
      subLotteryResultSubscription.on("connected", (id) => console.log(`Sub Lottery Result connected at: ${id}`));
      subLotteryResultSubscription.on('data', handleSubLotteryResult)
      subLotteryResultSubscription.on('error', console.error);

      return () => {
        subTicketPurchasedSubscription.unsubscribe();
        subLotteryResultSubscription.unsubscribe();
      };
    }
  }, [web3]);

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
          toast.error('Approve USDC transaction failed!');
          throw new Error('Approval transaction failed!');
        });
      return true;
    } catch (error) {
      console.log('error:', error);
      toast.error('Approve USDC transaction failed!');
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
        const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
        await dopamineContract.methods.buySubLotteryTicket(ticketId, referral ? referral : '').send({ from: account })
          .on('transactionHash', (hash) => {
            console.log('Buy lottery transaction Hash:', hash);
            toast.info('Buy lottery transaction sent!');
          })
          .on('receipt', (receipt) => {
            console.log('receipt:', receipt);
            toast.success('Buy lottery transaction completed successfully!');
            fetchMainLotteryInfo();
            fetchMainLotteryTickets();
            if (ticketId == 1)
              handleRefresh1()
            else if (ticketId == 2)
              handleRefresh2()
            else if (ticketId == 3)
              handleRefresh3()
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

  const usdcConverter = (amount) => {
    if (web3 && amount) {
      try {
        return web3.utils.fromWei(amount.toString(), 'mwei');
      } catch (error) {
        console.error('Error converting Wei to Ether:', error);
      }
    } else return amount;
  };
  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-lg-5 col-xl-6 mb-4">
          {
            showMainResult ?
              <div className="box">
                {
                  mainWinnerResult.hasWinner ?
                    mainWinnerResult.winner !== account ?
                      <>
                        <h1 className='cong'>Congratulations 🎉</h1>
                        <p className='prize'>You Won: ${usdcConverter(mainWinnerResult.prizeAmount)}</p>
                      </>
                      :
                      <>
                        <h3>Winner Address:</h3>
                        <h4 className='address'>{mainWinnerResult.winner}</h4>
                        <p className='prize'>Winner Prize: ${usdcConverter(mainWinnerResult.prizeAmount)}</p>
                      </>
                    :
                    <>
                      <h1 className="cong">No One Won, now the prize is bigger!</h1>
                    </>
                }
              </div>
              :
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
          }
        </div>
        <div className="col-lg-7 col-xl-6 mb-4">
          <SubLottery
            ref={subLottery1Ref}
            lotteryNumber={1}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            subLotteryResult={subLotteryResult}
            onBuyTicket={(num) => buyTicket(num)}
          />
          <SubLottery
            ref={subLottery2Ref}
            lotteryNumber={2}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            subLotteryResult={subLotteryResult}
            onBuyTicket={(num) => buyTicket(num)}
          />
          <SubLottery
            ref={subLottery3Ref}
            lotteryNumber={3}
            mainLotteryInfo={mainLotteryInfo}
            currentBlock={currentBlock}
            subLotteryResult={subLotteryResult}
            onBuyTicket={(num) => buyTicket(num)}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
