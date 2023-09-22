import React from "react";
import Step from "./cards/Step";

interface IStepProps {
  steps: string[] | undefined;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const Steps = ({ steps, currentStep, setCurrentStep }: IStepProps) => {
  return (
    <section>
      <h1 className="my-6 text-3xl font-semibold tracking-tight">Steps</h1>
      <ol className="list-inside list-decimal space-y-2">
        {steps?.map((item, index) => (
          <Step
            key={index}
            title={item}
            index={index}
            completed={index < currentStep}
            active={index === currentStep}
            onCompleted={() => setCurrentStep((prev) => prev + 1)}
          />
        ))}
      </ol>
    </section>
  );
};

export default Steps;
