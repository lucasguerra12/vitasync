import { useEffect, useRef } from 'react';
import { LightSensor } from 'expo-sensors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentTheme } from '../store/slices/themeSlice';

const DARK_THRESHOLD = 50;
const LIGHT_THRESHOLD = 200;
const DEBOUNCE_MS = 500;

export function useLightSensor() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(state => state.theme.mode);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mode !== 'auto') return;

    const subscription = LightSensor.addListener(({ illuminance }) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (illuminance < DARK_THRESHOLD) {
          dispatch(setCurrentTheme('dark'));
        } else if (illuminance > LIGHT_THRESHOLD) {
          dispatch(setCurrentTheme('light'));
        }
      }, DEBOUNCE_MS);
    });

    LightSensor.setUpdateInterval(1000);

    return () => {
      subscription.remove();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [mode]);
}