import { atom } from 'jotai';

// Atomer för att hantera state i genererings-wizarden
export const currentStepAtom = atom(1);
export const totalStepsAtom = atom(4); // Increased to 4 steps

export const formDataAtom = atom({
  businessName: '',
  industry: '',
  description: '',
  services: [] as string[],
});

export const generationProgressAtom = atom(0);
export const generatedWebsiteAtom = atom<string | null>(null);
