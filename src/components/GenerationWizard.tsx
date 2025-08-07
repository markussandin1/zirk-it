'use client';

import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentStepAtom, totalStepsAtom, formDataAtom, generationProgressAtom, generatedWebsiteAtom } from '@/store/generationStore';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GenerationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [totalSteps] = useAtom(totalStepsAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [progress, setProgress] = useAtom(generationProgressAtom);
  const [jobId, setJobId] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState('');

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const response = await fetch(`/api/generation-status/${jobId}`);
      if (!response.ok) return;

      const data = await response.json();
      setProgress(data.progress || 0);

      if (data.status === 'completed') {
        clearInterval(interval);
        if (data.result?.slug) {
          router.push(`/s/${data.result.slug}`);
        }
      } else if (data.status === 'error') {
        clearInterval(interval);
        // Handle error state in UI
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, setProgress, router]);

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
    if (data.success && data.jobId) {
      setJobId(data.jobId);
    }
  };

  const addService = () => {
    if (currentService.trim()) {
      setFormData({ ...formData, services: [...formData.services, currentService.trim()] });
      setCurrentService('');
    }
  };

  const removeService = (index: number) => {
    const newServices = [...formData.services];
    newServices.splice(index, 1);
    setFormData({ ...formData, services: newServices });
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
            <Label htmlFor="businessName">Företagsnamn</Label>
            <Input id="businessName" placeholder="T.ex. Pizzeria Bella" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-2">
            <Label htmlFor="industry">Bransch</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, industry: value })} value={formData.industry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Välj en bransch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurang</SelectItem>
                <SelectItem value="beauty">Skönhet</SelectItem>
                <SelectItem value="professional">Tjänster</SelectItem>
                <SelectItem value="other">Annat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-2">
            <Label htmlFor="description">Beskriv ditt företag</Label>
            <Textarea id="description" placeholder="Berätta vad ditt företag gör, vilka ni riktar er till, etc." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-2">
            <Label htmlFor="services">Vilka tjänster/produkter erbjuder ni?</Label>
            <div className="flex space-x-2">
              <Input id="services" placeholder="T.ex. Klippning" value={currentService} onChange={(e) => setCurrentService(e.target.value)} />
              <Button onClick={addService}>Lägg till</Button>
            </div>
            <div className="space-y-2 pt-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <span>{service}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeService(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 5 && (
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
          <Button onClick={handleNext} disabled={currentStep === 4 && formData.services.length === 0}>
            Nästa
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={!!jobId}>
            {jobId ? 'Genererar...' : 'Generera hemsida'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
