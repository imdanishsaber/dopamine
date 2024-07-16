import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './connectionSlice';
import referralReducer from './referralSlice';

const store = configureStore({
  reducer: {
    connection: connectionReducer,
    referral: referralReducer,

  },
});

export default store;
