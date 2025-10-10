import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { PreferenceSelector } from "@/components/onboarding/PreferenceSelector";
import { PermissionRequest } from "@/components/onboarding/PermissionRequest";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    interests: [] as string[],
    travelStyle: "",
    budget: "",
  });
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {step === 0 && <WelcomeScreen onGetStarted={handleNext} />}
          {step === 1 && (
            <PreferenceSelector
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          )}
          {step === 2 && <PermissionRequest />}
        </div>
      </div>

      <div className="sticky bottom-0 bg-card border-t p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip
            </Button>

            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {step === totalSteps - 1 ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
