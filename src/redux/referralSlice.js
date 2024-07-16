import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  referral: null,
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setReferral: (state, action) => {
      state.referral = action.payload;
    },
  },
});

export const { setReferral } = referralSlice.actions;

export default referralSlice.reducer;
