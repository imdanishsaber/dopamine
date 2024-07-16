import React, { useState, useEffect } from 'react';

const LotteryProgress = ({ type = 'main', lotteryInfo, currentBlock }) => {
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [mainLotteryEndsText, setmainLotteryEndsText] = useState(null);

    const convertSeconds = (seconds) => {
        if (seconds > 0) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds %= 60;
            return `ENDING IN: ${minutes} Minutes ${seconds} Seconds`
        } else {
            return 'ENDED'
        }
    }

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
            const timeElapsedInSeconds = currentTimeInSeconds - startTimeInSeconds;

            const progressPercentage = (timeElapsedInSeconds / totalDurationInSeconds) * 100;
            setProgressPercentage(progressPercentage);


            let mainLotteryEndsTime = (endBlock - currentBlockNum) * 2;
            console.log(`Time remaining in main lottery: ${mainLotteryEndsTime} seconds`);
            setInterval(() => {
                mainLotteryEndsTime -= 1;
                let text = convertSeconds(mainLotteryEndsTime)
                setmainLotteryEndsText(text)
            }, 1000);

        }
    }, [lotteryInfo, currentBlock]);

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
            {
                <p className={`ending ${type === 'main' ? 'my-4' : 'my-0'}`}>{mainLotteryEndsText}</p>
            }
        </>
    );
};

export default LotteryProgress;
