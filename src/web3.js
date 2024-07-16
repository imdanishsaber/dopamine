// src/web3.js
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

let web3;

const initWeb3 = async () => {
  const provider = await detectEthereumProvider();
  
  if (provider) {
    web3 = new Web3(provider);
    try {
      await provider.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    console.error("Please install MetaMask!");
  }

  return web3;
};

export default initWeb3;
