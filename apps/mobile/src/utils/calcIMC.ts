export type IMCClassification = {
  label: string;
  color: string;
  advice: string;
};

export function calcIMC(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getIMCClassification(imc: number): IMCClassification {
  if (imc < 18.5) return {
    label: 'Abaixo do peso',
    color: '#3B82F6',
    advice: 'Considere consultar um nutricionista para adequar sua alimentação.',
  };
  if (imc < 25) return {
    label: 'Peso normal',
    color: '#10B981',
    advice: 'Parabéns! Continue mantendo hábitos saudáveis.',
  };
  if (imc < 30) return {
    label: 'Sobrepeso',
    color: '#F59E0B',
    advice: 'Pequenas mudanças na alimentação e exercícios podem ajudar.',
  };
  if (imc < 35) return {
    label: 'Obesidade grau I',
    color: '#F97316',
    advice: 'Recomendamos acompanhamento médico e nutricional.',
  };
  if (imc < 40) return {
    label: 'Obesidade grau II',
    color: '#EF4444',
    advice: 'Procure orientação médica para um plano de tratamento.',
  };
  return {
    label: 'Obesidade grau III',
    color: '#7C3AED',
    advice: 'Acompanhamento médico urgente é recomendado.',
  };
}

export function formatIMC(imc: number): string {
  return imc.toFixed(1);
}