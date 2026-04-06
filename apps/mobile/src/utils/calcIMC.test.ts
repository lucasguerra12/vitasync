import { calcIMC, getIMCClassification, formatIMC } from './calcIMC';

describe('Utilitários de IMC (calcIMC)', () => {
  it('1. deve calcular o IMC corretamente', () => {
    expect(calcIMC(70, 175)).toBeCloseTo(22.86, 2);
  });
  it('2. deve retornar classificação "Abaixo do peso"', () => {
    expect(getIMCClassification(18.4).label).toBe('Abaixo do peso');
  });
  it('3. deve retornar classificação "Peso normal"', () => {
    expect(getIMCClassification(22.5).label).toBe('Peso normal');
  });
  it('4. deve retornar classificação "Sobrepeso"', () => {
    expect(getIMCClassification(27.0).label).toBe('Sobrepeso');
  });
  it('5. deve formatar o IMC com 1 casa decimal', () => {
    expect(formatIMC(22.857)).toBe('22.9');
  });
});