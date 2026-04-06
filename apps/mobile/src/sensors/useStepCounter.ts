import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useAppDispatch } from '../store/hooks';
import { updateSteps, setStepsAvailable } from '../store/slices/stepsSlice';

export function useStepCounter() {
  const dispatch = useAppDispatch();
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: any;

    const startIOS = async () => {
      const available = await Pedometer.isAvailableAsync();
      dispatch(setStepsAvailable(available));
      if (!available) return;

      subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
        dispatch(updateSteps(result.steps));
      });
    };

    const startAndroid = async () => {
      console.log('Iniciando serviço de passos em Background (Android).');
      dispatch(setStepsAvailable(true)); 
      // TODO (Sprint 2 / APK final): Plugar react-native-step-counter
    };

    if (Platform.OS === 'ios') startIOS();
    else if (Platform.OS === 'android') startAndroid();

    return () => {
      if (Platform.OS === 'ios' && subscription) subscription.remove();
    };
  }, [dispatch]);

  return { steps };
}