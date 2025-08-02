import React from 'react';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({ 
  step, 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};