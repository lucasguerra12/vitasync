import { act } from "react";

type Sex = 'Masculino' | 'Feminino' | 'Outro';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const ACTIVITY_FACTORS: Record<ActivityLevel , number> = {
    sedentary :1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725 ,
    very_active: 1.9,
};

//taxa metabolica basal
export function calcTMB(
    sex: Sex,
    weightKg: number,
    heightCm : number,
    ageYears: number
): number {
    if (sex== 'Masculino'){
        return 88.362 + ( 13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears);
    }
    return 477.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears);
}

export function calcDailyCalories (
    sex : Sex,
    weightKg: number,
    heightCm : number,
    ageYears: number,
    activityLevel: ActivityLevel
): number {
    const tmb = calcTMB (sex,weightKg,heightCm,ageYears);
    return Math.round(tmb * ACTIVITY_FACTORS[activityLevel]);

}

export function calcAge(birthDate: string): number | null {
  const parts = birthDate.split('/');
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  if (isNaN(birth.getTime())) return null;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}