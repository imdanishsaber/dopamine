import React, { useState, useEffect } from 'react';
import LotteryProgress from './LotteryProgress'
import { useSelector } from 'react-redux';
import {
    DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS
} from '../config';

const SubLottery = ({ onBuyTicket, lotteryNumber, mainLotteryInfo, currentBlock }) => {
    const { account, web3 } = useSelector((state) => state.connection);
    const [lotteryInfo, setlotteryInfo] = useState(null);
    const [subLottery, setSubLottery] = useState(null);
    const [yourTickets, setYourTickets] = useState(null);

    const [showSubResult, setShowSubResult] = useState(false);
    const [subWinnerResult, setSubWinnerResult] = useState({});

    const fetchSubLotteryInfo = async () => {
        if (web3) {
            const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
            const lotteryInfo = await dopamineContract.methods.getCurrentSubLotteryInfo(lotteryNumber).call();
            // console.log(`lotteryInfo ${lotteryNumber}:`, lotteryInfo);
            setlotteryInfo(lotteryInfo)
        }
    };

    const fetchSubLottery = async () => {
        if (web3) {
            const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
            const subLottery = await dopamineContract.methods[`subLottery${lotteryNumber}`]().call();
            // console.log(`subLottery ${lotteryNumber}:`, subLottery);
            setSubLottery(subLottery)
        }
    };

    const fetchSubLotteryTickets = async () => {
        if (web3 && account) {
            try {
                const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
                const countSubLotteryTickets = await dopamineContract.methods.countSubLotteryTickets(lotteryNumber, account).call();
                // console.log(`countSubLotteryTickets ${lotteryNumber}:`, countSubLotteryTickets);
                setYourTickets(Number(countSubLotteryTickets))
            } catch (error) {
                console.log('error:', error);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSubLottery();
            fetchSubLotteryInfo();
            fetchSubLotteryTickets();
        }, 2000);

        return () => clearInterval(interval);
    }, [web3, account]);


    useEffect(() => {
        if (web3) {
            const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
            const handleSubLotteryRoundStart = (error, event) => {
                if (!error) {
                    fetchSubLottery();
                    fetchSubLotteryInfo();
                    fetchSubLotteryTickets();
                    console.log('SubLotteryRoundStart event:', event);
                }
            };

            const handleSubLotteryResult = (error, event) => {
                if (!error) {
                    console.log('SubLotteryResult event:', event);
                    if (event.lotteryType == lotteryNumber) {
                        setShowSubResult(true)
                        setTimeout(() => {
                            setShowSubResult(false)
                        }, 2000);
                        setSubWinnerResult(event)
                    }
                }
            };

            const subTicketPurchasedSubscription = dopamineContract.events.SubTicketPurchased();
            subTicketPurchasedSubscription.on('data', handleSubLotteryRoundStart)
            subTicketPurchasedSubscription.on('error', console.error);

            const subLotteryResultSubscription = dopamineContract.events.SubLotteryResult()
            subLotteryResultSubscription.on('data', handleSubLotteryResult)
            subLotteryResultSubscription.on('error', console.error);

            return () => {
                subTicketPurchasedSubscription.unsubscribe();
                subLotteryResultSubscription.unsubscribe();
            };
        }
    }, [web3]);

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
        <>
            {
                showSubResult ?
                    <div className="sub-box">
                        {
                            subWinnerResult.hasWinner ?
                                subWinnerResult.winner == account ?
                                    <>
                                        <h1 className='cong'>Congratulations 🎉</h1>
                                        <p className='prize'>You Won: ${usdcConverter(subWinnerResult.prizeAmount)}</p>
                                    </>
                                    :
                                    <>
                                        <h3>Winner Address:</h3>
                                        <h4 className='address'>{subWinnerResult.winner}</h4>
                                        <p className='prize'>Winner Prize: ${usdcConverter(subWinnerResult.prizeAmount)}</p>
                                        <p className='mb-0'>Next time the price can be yours. </p>
                                    </>
                                :
                                <>
                                    <h1 className="cong">No One Won!</h1>
                                </>
                        }
                    </div>
                    :
                    <div className="sub-box">
                        <div className="row align-items-center">
                            <div className="col-7">
                                <div className="d-flex justify-content-between">
                                    <div className='text-center'>
                                        <p className='price'>Price</p>
                                        <h1>${subLottery && subLottery.winnerBalance ? usdcConverter(subLottery.winnerBalance) : 0}</h1>
                                    </div>
                                    <div className='text-center'>
                                        {
                                            !yourTickets &&
                                            <p className='usdc'>{usdcConverter(subLottery?.ticketPrice)} USDC</p>
                                        }
                                        <button className="btn btn-primary" onClick={() => onBuyTicket(lotteryNumber)}
                                            disabled={yourTickets}
                                        >{yourTickets ? '🤞Good Luck!' : 'Buy Ticket'}</button>
                                    </div>
                                </div>
                                {currentBlock &&
                                    <LotteryProgress type='sub' lotteryInfo={lotteryInfo} currentBlock={currentBlock} />
                                }
                            </div>
                            <div className="col-5">
                                <p className="text">
                                    IF YOU BUY A TICKET <br /> <br />
                                    YOU HAVE 1/
                                    {lotteryInfo && lotteryInfo.participantCount ? Number(lotteryInfo.participantCount) : 1}
                                    &nbsp; CHANCE &nbsp;
                                    {subLottery && subLottery.winnerBalance ? (
                                        <>
                                            TO WIN {usdcConverter(subLottery.winnerBalance)}
                                        </>
                                    ) : (
                                        <>
                                            TO WIN $0
                                        </>
                                    )}
                                    <br /><br />
                                    GET A CHANCE TO WIN $
                                    {mainLotteryInfo && mainLotteryInfo.totalPrize ? Number(mainLotteryInfo.totalPrize) : ""}
                                    <br />
                                    <br />
                                    AND GET {usdcConverter(subLottery?.ticketPrice)} DOPE AIRDROP
                                </p>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default SubLottery;
