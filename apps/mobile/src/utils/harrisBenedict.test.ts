import { calcTMB, calcDailyCalories, calcAge } from './harrisBenedict';

describe('Utilitários Harris-Benedict', () => {
  it('1. TMB Masculino', () => {
    expect(calcTMB('Masculino', 70, 175, 25)).toBeCloseTo(1724.05, 1);
  });
  it('2. TMB Feminino', () => {
    expect(calcTMB('Feminino', 60, 165, 25)).toBeCloseTo(1435.33, 1);
  });
  it('3. Calorias Sedentário', () => {
    const tmb = calcTMB('Masculino', 70, 175, 25);
    expect(calcDailyCalories('Masculino', 70, 175, 25, 'sedentary')).toBe(Math.round(tmb * 1.2));
  });
  it('4. Calorias Muito Ativo', () => {
    const tmb = calcTMB('Feminino', 60, 165, 25);
    expect(calcDailyCalories('Feminino', 60, 165, 25, 'very_active')).toBe(Math.round(tmb * 1.9));
  });
  it('5. Cálculo de Idade', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-06'));
    expect(calcAge('10/01/2000')).toBe(26);
    expect(calcAge('10/12/2000')).toBe(25);
    expect(calcAge('10-12-2000')).toBeNull();
    jest.useRealTimers();
  });
});