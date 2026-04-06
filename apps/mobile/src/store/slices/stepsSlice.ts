import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepsState {
  todaySteps: number;
  isAvailable: boolean;
  lastUpdated: string | null;
}

const initialState: StepsState = {
  todaySteps: 0,
  isAvailable: false,
  lastUpdated: null,
};

const stepsSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    updateSteps: (state, action: PayloadAction<number>) => {
      state.todaySteps = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setStepsAvailable: (state, action: PayloadAction<boolean>) => {
      state.isAvailable = action.payload;
    },
  },
});

export const { updateSteps, setStepsAvailable } = stepsSlice.actions;
export default stepsSlice.reducer;