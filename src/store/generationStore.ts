import { atom } from 'jotai';

// Atomer för att hantera state i genererings-wizarden
export const currentStepAtom = atom(1);
export const totalStepsAtom = atom(3);

export const formDataAtom = atom({
  industry: '',
  companyName: '',
  description: '',
});

export const generationProgressAtom = atom(0);
export const generatedWebsiteAtom = atom<string | null>(null);
