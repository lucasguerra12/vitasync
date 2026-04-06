import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { useAppDispatch } from '../store/hooks';
import { updateSteps, setStepsAvailable } from '../store/slices/stepsSlice';

export function useStepCounter() {
  const dispatch = useAppDispatch();
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: any;

    const start = async () => {
      const available = await Pedometer.isAvailableAsync();
      dispatch(setStepsAvailable(available));

      if (!available) {
        console.log('Pedômetro não disponível neste dispositivo');
        return;
      }

      subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
        dispatch(updateSteps(result.steps));
      });
    };

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { steps };
}