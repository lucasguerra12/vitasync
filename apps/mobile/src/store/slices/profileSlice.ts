import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

interface ProfileState {
  name: string | null;
  birthDate: string | null;
  sex: 'male' | 'female' | 'other' | null;
  weightKg: number | null;
  heightCm: number | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  mainGoal: 'lose_weight' | 'gain_muscle' | 'reduce_stress' | 'general_health' | null;
  dailyCalorieGoal: number | null;
  dailyWaterGoalMl: number;
  dailyStepGoal: number;
  currentWaterMl: number; 
  currentSteps: number;
  lastActiveDate: string | null; // Controle do ciclo diário (Bug da Meia-Noite)
}

const initialState: ProfileState = {
  name: null,
  birthDate: null,
  sex: null,
  weightKg: null,
  heightCm: null,
  activityLevel: null,
  mainGoal: null,
  dailyCalorieGoal: null,
  dailyWaterGoalMl: 2000,
  dailyStepGoal: 10000,
  currentWaterMl: 0,
  currentSteps: 0,
  lastActiveDate: format(new Date(), 'yyyy-MM-dd'),
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    setCalorieGoal: (state, action: PayloadAction<number>) => {
      state.dailyCalorieGoal = action.payload;
    },
    addWater: (state, action: PayloadAction<number>) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      if (state.lastActiveDate !== today) {
        state.currentWaterMl = action.payload; // Novo dia: reinicia e adiciona
        state.lastActiveDate = today;
      } else {
        state.currentWaterMl += action.payload;
      }
    },
    addSteps: (state, action: PayloadAction<number>) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      if (state.lastActiveDate !== today) {
        state.currentSteps = action.payload; // Novo dia: reinicia e adiciona
        state.lastActiveDate = today;
      } else {
        state.currentSteps += action.payload;
      }
    },
    clearProfile: () => initialState,
  },
});

export const { setProfile, setCalorieGoal, addWater, addSteps, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;