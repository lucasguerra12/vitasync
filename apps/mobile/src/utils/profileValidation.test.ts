import { profileSchema } from './profileValidation';

describe('Profile Validation Schema', () => {
  it('deve validar um perfil correto com sucesso e converter strings numéricas', () => {
    const validProfile = {
      age: "25", // Simulando input do React Native (string)
      weight: "70.5",
      height: 175, // Number direto
      gender: 'M',
      activityLevel: 'MODERATE',
      goal: 'MAINTAIN'
    };
    const result = profileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
    
    if (result.success) {
      // Garante que o Zod converteu a string "25" para o número 25
      expect(result.data.age).toBe(25);
    }
  });

  it('deve retornar erro se o peso for negativo ou zero', () => {
    const invalidProfile = {
      age: 25,
      weight: -5,
      height: 175,
      gender: 'M',
      activityLevel: 'MODERATE',
      goal: 'MAINTAIN'
    };
    const result = profileSchema.safeParse(invalidProfile);
    
    expect(result.success).toBe(false);
  });
});