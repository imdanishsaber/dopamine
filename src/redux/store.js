import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import connectionReducer from './connectionSlice';
import referralReducer from './referralSlice';

const store = configureStore({
  reducer: {
    connection: connectionReducer,
    referral: referralReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['connection/connect'],
        ignoredPaths: ['connection.web3'],
      },
    }),
});

export default store;
