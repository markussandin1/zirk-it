import { atom } from 'jotai';

// Atomer för att hantera state i genererings-wizarden
export const currentStepAtom = atom(1);
export const totalStepsAtom = atom(5); // Increased to 5 steps

export const formDataAtom = atom({
  businessName: '',
  industry: '',
  description: '',
  services: [] as string[],
});

export const generationProgressAtom = atom(0);
export const generatedWebsiteAtom = atom<string | null>(null);
