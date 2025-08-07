'use client';

import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { currentStepAtom, totalStepsAtom, formDataAtom, generationProgressAtom, generatedWebsiteAtom } from '@/store/generationStore';

export function GenerationWizard() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [totalSteps] = useAtom(totalStepsAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [progress] = useAtom(generationProgressAtom);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    // Detta kommer att anropa API:et i en framtida iteration
    console.log('Generating website with data:', formData);
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Skapa din hemsida</CardTitle>
        <CardDescription>Steg {currentStep} av {totalSteps}</CardDescription>
        <Progress value={(currentStep / totalSteps) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        {currentStep === 1 && <div>Steg 1: Välj bransch</div>}
        {currentStep === 2 && <div>Steg 2: Beskriv ditt företag</div>}
        {currentStep === 3 && <div>Steg 3: Generera</div>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Tillbaka
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={handleNext}>Nästa</Button>
        ) : (
          <Button onClick={handleGenerate}>Generera hemsida</Button>
        )}
      </CardFooter>
    </Card>
  );
}
