'use client';

import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { currentStepAtom, totalStepsAtom, formDataAtom, generationProgressAtom, generatedWebsiteAtom } from '@/store/generationStore';
import { useEffect, useState } from 'react';

export function GenerationWizard() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [totalSteps] = useAtom(totalStepsAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [progress, setProgress] = useAtom(generationProgressAtom);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const response = await fetch(`/api/generation-status/${jobId}`);
      const data = await response.json();

      setProgress(data.progress || 0);

      if (data.status === 'completed') {
        // Hantera slutförd generering
        clearInterval(interval);
      } else if (data.status === 'error') {
        // Hantera fel
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, setProgress]);

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

  const handleGenerate = async () => {
    const response = await fetch('/api/generate-website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success) {
      setJobId(data.jobId);
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Skapa din hemsida</CardTitle>
        <CardDescription>Steg {currentStep} av {totalSteps}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Företagsnamn</Label>
            <Input id="companyName" placeholder="T.ex. Pizzeria Bella" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-2">
            <Label htmlFor="description">Beskriv ditt företag</Label>
            <Textarea id="description" placeholder="Berätta vad ditt företag gör, vilka ni riktar er till, etc." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <p>Klicka på &quot;Generera hemsida&quot; för att skapa din sida.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Tillbaka
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={handleNext}>Nästa</Button>
        ) : (
          <Button onClick={handleGenerate} disabled={!!jobId}>
            {jobId ? 'Genererar...' : 'Generera hemsida'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
