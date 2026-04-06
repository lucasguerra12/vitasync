import { useEffect, useRef } from 'react';
import { LightSensor } from 'expo-sensors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentTheme, setThemeMode } from '../store/slices/themeSlice';

const DARK_THRESHOLD = 50;   // abaixo de 50 lux = ambiente escuro
const LIGHT_THRESHOLD = 200; // acima de 200 lux = ambiente claro
const DEBOUNCE_MS = 500;     // evita mudanças rápidas demais

export function useLightSensor() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(state => state.theme.mode);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // só ativa o sensor se o modo for automático
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
        // entre 50 e 200 lux — zona neutra, não muda
      }, DEBOUNCE_MS);
    });

    LightSensor.setUpdateInterval(1000); // lê a cada 1 segundo

    return () => {
      subscription.remove();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [mode]);
}