import React from "react";

import { Checkbox } from "../ui/Checkbox";

import { cn } from "@/utils";

interface IStepProps {
  title: string;
  index: number;
  active: boolean;
  completed: boolean;
  onCompleted: () => void;
}

const Step: React.FC<IStepProps> = (props) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox
        id={props.title}
        onClick={props.onCompleted}
        checked={props.completed}
        disabled={props.completed || !props.active} 
      />
      <label
        htmlFor="terms"
        className={cn(
          "text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          {
            "text-primary": props.active,
            "line-through": props.completed && !props.active,
          }
        )}
      >
        {props.title}
      </label>
    </div>
  );
};

Step.displayName = "ExperimentStep"

export default Step;
