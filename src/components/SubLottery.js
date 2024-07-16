import React, { useState, useEffect } from 'react';
import LotteryProgress from './LotteryProgress'
import { useSelector } from 'react-redux';
import {
    DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS
} from '../config';

const SubLottery = ({ onBuyTicket, lotteryNumber, mainLotteryInfo, currentBlock }) => {
    const { account, web3 } = useSelector((state) => state.connection);
    const [lotteryInfo, setlotteryInfo] = useState(null);
    const [yourTickets, setYourTickets] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (web3) {
                const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
                const lotteryInfo = await dopamineContract.methods.getCurrentSubLotteryInfo(lotteryNumber).call();
                console.log(`lotteryInfo ${lotteryNumber}:`, lotteryInfo);
                setlotteryInfo(lotteryInfo)
            }
        };
        fetchData();
    }, [web3]);

    useEffect(() => {
        const fetchData = async () => {
            if (web3 && account) {
                try {
                    const dopamineContract = new web3.eth.Contract(DOPAMINE_CONTRACT_ABI, DOPAMINE_CONTRACT_ADDRESS);
                    const countSubLotteryTickets = await dopamineContract.methods.countSubLotteryTickets(lotteryNumber, account).call();
                    console.log('countSubLotteryTickets:', countSubLotteryTickets);
                    setYourTickets(Number(countSubLotteryTickets))
                } catch (error) {
                    console.log('error:', error);
                }
            }
        };
        fetchData();
    }, [account]);

    const usdcConverter = (amount) => {
        if (web3 && amount) {
            try {
                return web3.utils.fromWei(amount.toString(), 'mwei');
            } catch (error) {
                console.error('Error converting Wei to Ether:', error);
            }
        }
    };

    return (
        <div className="sub-box">
            <div className="row align-items-center">
                <div className="col-7">
                    <div className="d-flex justify-content-between">
                        <div className='text-center'>
                            <p className='price'>Price</p>
                            <h1>${
                                lotteryInfo && Object.keys(lotteryInfo).length > 0 ?
                                    Number(lotteryInfo?.rewardBalance)
                                    :
                                    0
                            }</h1>
                        </div>
                        <div className='text-center'>
                            <p className='usdc'>{usdcConverter(lotteryInfo?.ticketPrice)} USDC</p>
                            <button className="btn btn-primary" onClick={() => onBuyTicket(lotteryNumber)}
                                disabled={yourTickets}
                            >Buy Ticket</button>
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
                        {
                            lotteryInfo && Object.keys(lotteryInfo).length > 0 ?
                                Number(lotteryInfo?.participantCount)
                                :
                                ""
                        }
                        CHANCE
                        <br />
                        TO WIN {
                            lotteryInfo && Object.keys(lotteryInfo).length > 0 ?
                                Number(lotteryInfo?.rewardBalance)
                                :
                                ""
                        }
                        <br />
                        <br />
                        GET A CHANGE TO WIN $
                        {
                            mainLotteryInfo && Object.keys(mainLotteryInfo).length > 0 ?
                                Number(mainLotteryInfo?.totalPrize)
                                :
                                ""
                        }
                        <br />
                        <br />
                        AND GET {usdcConverter(lotteryInfo?.ticketPrice)} DOPE AIRDROP
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubLottery;
