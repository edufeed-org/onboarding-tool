import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export function OnboardingProgressBar({ 
  currentStep, 
  totalSteps = 6,
  className 
}: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full max-w-2xl mx-auto px-4", className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Schritt {currentStep} von {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
