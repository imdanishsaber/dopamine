import { createSlice } from '@reduxjs/toolkit';
import { INFURA_RPC_URL_BASE } from '../config'
import Web3 from 'web3';

const initialState = {
  isConnected: false,
  account: null,
  web3: new Web3(INFURA_RPC_URL_BASE),
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    connect: (state, action) => {
      state.isConnected = true;
      state.account = action.payload.account;
      state.web3 = action.payload.web3;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.account = null;
      state.web3 = new Web3(INFURA_RPC_URL_BASE);
    },
  },
});

export const { connect, disconnect } = connectionSlice.actions;

export default connectionSlice.reducer;
