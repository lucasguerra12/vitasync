import { useAppSelector } from '../store/hooks';

export function useActivityMetrics() {
  // Lendo do profileSlice, exatamente onde o seu Dashboard injeta os passos!
  const steps = useAppSelector((state) => state.profile.currentSteps) || 0;
  
  const dailyGoal = 10000;

  const calories = Math.round(steps * 0.04); 
  const distance = ((steps * 0.75) / 1000).toFixed(2); 
  const activeMinutes = Math.round(steps / 100); 
  const progressPercentage = Math.min(Math.round((steps / dailyGoal) * 100), 100);

  return {
    steps,
    calories,
    distance,
    activeMinutes,
    progressPercentage,
    dailyGoal,
  };
}