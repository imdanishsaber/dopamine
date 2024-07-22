import React, { useState, useEffect, useRef } from 'react';

const LotteryProgress = ({
    type = 'main', lotteryInfo, currentBlock,
    onFetchMainLotteryInfo, onFetchMainLotteryTickets,
    onFetchSubLottery, onFetchSubLotteryInfo, onFetchSubLotteryTickets
}) => {
    const [progressPercentage, setProgressPercentage] = useState(100);
    const [mainLotteryEndsText, setMainLotteryEndsText] = useState(null);
    const [isEnded, setIsEnded] = useState(false);
    const intervalRef = useRef(null);

    const convertSeconds = (seconds) => {
        if (seconds > 0) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds %= 60;
            return `ENDING IN: ${minutes} Minutes ${seconds} Seconds`;
        } else {
            if (!isEnded) {
                setIsEnded(true);
                if (type === 'main') {
                    onFetchMainLotteryInfo();
                    onFetchMainLotteryTickets();
                } else {
                    onFetchSubLottery();
                    onFetchSubLotteryInfo();
                    onFetchSubLotteryTickets();
                }
            }
            return 'ENDED';
        }
    };

    useEffect(() => {
        if (lotteryInfo) {
            const blockTimeInSeconds = 2;
            const startBlock = Number(lotteryInfo.startBlock);
            const endBlock = Number(lotteryInfo.endBlock);
            const currentBlockNum = Number(currentBlock);

            const startTimeInSeconds = startBlock * blockTimeInSeconds;
            const endTimeInSeconds = endBlock * blockTimeInSeconds;
            const currentTimeInSeconds = currentBlockNum * blockTimeInSeconds;

            const totalDurationInSeconds = endTimeInSeconds - startTimeInSeconds;
            let mainLotteryEndsTime = (endBlock - currentBlockNum) * blockTimeInSeconds;

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(() => {
                mainLotteryEndsTime -= 1;

                if (mainLotteryEndsTime <= 0) {
                    clearInterval(intervalRef.current);
                    mainLotteryEndsTime = 0;
                }

                let text = convertSeconds(mainLotteryEndsTime);
                setMainLotteryEndsText(text);

                const timeRemainingInSeconds = mainLotteryEndsTime;
                let remainingPercentage = (timeRemainingInSeconds / totalDurationInSeconds) * 100;
                remainingPercentage = Math.max(remainingPercentage, 0); // Ensure it doesn't go below 0%
                setProgressPercentage(remainingPercentage);
            }, 1000);

            return () => {
                clearInterval(intervalRef.current);
            };
        }
    }, [lotteryInfo]);

    return (
        <>
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
            <p className={`ending ${type === 'main' ? 'mb-4 mt-2' : ' mt-1 mb-0'}`}>{mainLotteryEndsText}</p>
        </>
    );
};

export default LotteryProgress;
