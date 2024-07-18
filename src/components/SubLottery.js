import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import LotteryProgress from './LotteryProgress'
import { useSelector } from 'react-redux';
import {
    DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS
} from '../config';

const SubLottery = forwardRef(({ onBuyTicket, lotteryNumber, mainLotteryInfo, currentBlock, subLotteryResult }, ref) => {

    const { account, web3 } = useSelector((state) => state.connection);
    const [lotteryInfo, setlotteryInfo] = useState(null);
    const [subLottery, setSubLottery] = useState(null);
    const [yourTickets, setYourTickets] = useState(null);

    const fetchSubLotteryInfo = async () => {
        if (web3) {
            const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
            const lotteryInfo = await dopamineContract.methods.getCurrentSubLotteryInfo(lotteryNumber).call();
            console.log(`lotteryInfo ${lotteryNumber}:`, lotteryInfo);
            setlotteryInfo(lotteryInfo)
        }
    };

    const fetchSubLottery = async () => {
        if (web3) {
            const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
            const subLottery = await dopamineContract.methods[`subLottery${lotteryNumber}`]().call();
            console.log(`subLottery ${lotteryNumber}:`, subLottery);
            setSubLottery(subLottery)
        }
    };

    const fetchSubLotteryTickets = async () => {
        if (web3 && account) {
            try {
                const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
                const countSubLotteryTickets = await dopamineContract.methods.countSubLotteryTickets(lotteryNumber, account).call();
                console.log(`countSubLotteryTickets ${lotteryNumber}:`, countSubLotteryTickets);
                setYourTickets(Number(countSubLotteryTickets))
            } catch (error) {
                console.log('error:', error);
            }
        }
    };

    useEffect(() => {
        // const interval = setInterval(() => {
        fetchSubLottery();
        fetchSubLotteryInfo();
        fetchSubLotteryTickets();
        // }, 2000);

        // return () => clearInterval(interval);
    }, [web3, account]);


    useImperativeHandle(ref, () => ({
        fetchSubLottery,
        fetchSubLotteryInfo,
        fetchSubLotteryTickets
    }));

    const usdcConverter = (amount) => {
        if (web3 && amount) {
            try {
                return web3.utils.fromWei(amount.toString(), 'mwei');
            } catch (error) {
                console.error('Error converting Wei to Ether:', error);
            }
        } else return amount;
    };

    const renderTicketButton = () => {
        if (lotteryInfo && lotteryInfo.endBlock <= currentBlock) {
            if (yourTickets) {
                return (
                    <div className="text-center mt-2">
                        The round is ended, the winner will be shown at the first ticket purchased in the new round.
                        Don’t worry, if there are no other players, you’ll be fully refunded.
                    </div>
                );
            } else {
                return (
                    <div className="text-center mt-2">
                        The round is ended, be the first to participate in the next round! If no one else participates,
                        you’ll be fully refunded.
                    </div>
                );
            }
        } else {
            return (
                <div className="text-center">
                    <div className='text-center'>
                        <p className='price'>Price</p>
                        <h1>${subLottery && subLottery.winnerBalance ? usdcConverter(subLottery.winnerBalance) : 0}</h1>
                    </div>
                    <p className='usdc'>{usdcConverter(subLottery?.ticketPrice)} USDC</p>
                    <button className="btn btn-primary" onClick={() => onBuyTicket(lotteryNumber)}
                    >Buy Ticket
                    </button>
                </div>
            );
        }
    };

    return (
        <>
            {
                subLotteryResult && subLotteryResult.lotteryType == lotteryNumber ?
                    <div className="sub-box">
                        {
                            subLotteryResult.hasWinner ?
                                subLotteryResult.winner == account ?
                                    <>
                                        <h1 className='cong'>Congratulations 🎉</h1>
                                        <p className='prize'>You Won: ${usdcConverter(subLotteryResult.prizeAmount)}</p>
                                    </>
                                    :
                                    <>
                                        <h3>Winner Address:</h3>
                                        <h4 className='address'>{subLotteryResult.winner}</h4>
                                        <p className='prize'>Winner Prize: ${usdcConverter(subLotteryResult.prizeAmount)}</p>
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
                            <div className="col-6">
                                <div className="d-flex justify-content-between align-items-center">
                                    {renderTicketButton()}
                                </div>
                                {currentBlock && lotteryInfo && lotteryInfo.endBlock > currentBlock && (
                                    <LotteryProgress type='sub' lotteryInfo={lotteryInfo} currentBlock={currentBlock} />
                                )}
                            </div>
                            <div className="col-6">
                                <p className="text">
                                    IF YOU BUY A TICKET <br /> <br />
                                    YOU HAVE 1/
                                    {lotteryInfo && lotteryInfo.participantCount ? Number(lotteryInfo.participantCount) : 1}
                                    &nbsp; CHANCE &nbsp;
                                    {subLottery && subLottery.winnerBalance ? (
                                        <>
                                            TO WIN <span className='text-primary'>${usdcConverter(subLottery.winnerBalance)}</span>
                                        </>
                                    ) : (
                                        <>
                                            TO WIN $0
                                        </>
                                    )}
                                    <br /><br />
                                    GET A CHANCE TO WIN &nbsp;
                                    <span className='text-primary'>
                                        ${mainLotteryInfo && mainLotteryInfo.totalPrize ? Number(mainLotteryInfo.totalPrize) : ""}
                                    </span>
                                    <br />
                                    <br />
                                    AND GET&nbsp;
                                    <span className='text-primary'>
                                        {usdcConverter(subLottery?.ticketPrice)} DOPE&nbsp;
                                    </span>AIRDROP
                                </p>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
});

export default SubLottery;
