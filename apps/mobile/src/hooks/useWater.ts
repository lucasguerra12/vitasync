import { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

// Variável em memória para manter o valor vivo enquanto o app estiver aberto
let globalWater = 0; 
const WATER_GOAL = 2000;

export function useWater() {
  const [water, setWater] = useState(globalWater);

  useEffect(() => {
    // Escuta qualquer mudança que vier de outras telas
    const subscription = DeviceEventEmitter.addListener('onWaterUpdate', (newValue) => {
      setWater(newValue);
    });

    return () => subscription.remove();
  }, []);

  const addWater = (amount: number = 250) => {
    if (globalWater < WATER_GOAL) {
      globalWater += amount;
      setWater(globalWater);
      // Avisa todas as telas do app que a água mudou
      DeviceEventEmitter.emit('onWaterUpdate', globalWater);
    }
  };

  return { water, waterGoal: WATER_GOAL, addWater };
}