import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Referrals = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const { account, web3 } = useSelector((state) => state.connection);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (web3 && account) {
        getUserByWallet()
      }
    };
    fetchUserInfo();
  }, [web3, account]);

  const getUserByWallet = async () => {
    const referralsContract = new web3.eth.Contract(REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS,);
    const user = await referralsContract.methods.getUserByWallet(account).call();
    if (Object.keys(user).length) {
      setUserInfo(user[0]);
    }
  };


  const handleRegister = async () => {
    const referralsContract = new web3.eth.Contract(REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS,);
    await referralsContract.methods.register(account, username).send({ from: account })
      .on('transactionHash', (hash) => {
        console.log('Transaction Hash:', hash);
        toast.info('Username transaction sent!');
      })
      .on('receipt', (receipt) => {
        console.log('receipt:', receipt);
        toast.success('Username transaction completed successfully!');
      })
      .on('error', (error, receipt) => {
        console.log('error, receipt:', error, receipt);
        toast.error('Username transaction failed!');
        throw new Error('Username transaction failed!');
      });
  };

  const handleEdit = async () => {
    const referralsContract = new web3.eth.Contract(REFERRALS_CONTRACT_ABI, REFERRALS_CONTRACT_ADDRESS,);
    await referralsContract.methods.editWallet(userInfo, newWalletAddress).send({ from: account })
      .on('transactionHash', (hash) => {
        console.log('Transaction Hash:', hash);
        toast.info('Update Wallet address transaction sent!');
      })
      .on('receipt', (receipt) => {
        console.log('receipt:', receipt);
        toast.success('Update Wallet address transaction completed successfully!');
      })
      .on('error', (error, receipt) => {
        console.log('error, receipt:', error, receipt);
        toast.error('Update Wallet address transaction failed!');
        throw new Error('Update Wallet address transaction failed!');
      });
  };
  const onCopy = () => {
    const referralLink = `${window.location.origin}/?referral=${userInfo}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!');
      })
      .catch(err => {
        toast.error('Failed to copy referral link.');
        console.error('Failed to copy referral link: ', err);
      });
  };
  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Referrals</h2>
      {userInfo ? (
        <div className="row">
          <div className="col-6">
            <p><strong>Username:</strong> {userInfo}</p>
            <div className="mb-3">
              <label className="form-label">Edit Wallet Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="New Wallet Address"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
              />
            </div>
            <button className="btn btn-primary mt-2" onClick={handleEdit}>
              Edit Wallet
            </button>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-start align-items-center">
              <p className='my-5'>Share your referral link: <strong>{window.location.origin}/?referral={userInfo}</strong></p>
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={onCopy}>
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Please register to start using the referral system.</p>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username for referral"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button className="btn btn-primary mt-2" onClick={handleRegister}>
                Register Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
