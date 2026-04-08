import { z } from 'zod';

export const profileSchema = z.object({
  age: z.coerce.number({ message: "A idade deve ser um número" })
    .min(10, "A idade mínima é 10 anos")
    .max(120, "Idade inválida"),
    
  weight: z.coerce.number({ message: "O peso deve ser um número" })
    .positive("O peso deve ser maior que zero"),
    
  height: z.coerce.number({ message: "A altura deve ser um número" })
    .positive("A altura deve ser maior que zero")
    .max(300, "Altura inválida"),

  gender: z.enum(['M', 'F', 'OTHER'], { message: "Selecione um gênero" }),
  
  activityLevel: z.enum(['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE'], { message: "Selecione o nível de atividade" }),
  
  goal: z.enum(['LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE'], { message: "Selecione um objetivo" })
});

export type ProfileFormData = z.infer<typeof profileSchema>;