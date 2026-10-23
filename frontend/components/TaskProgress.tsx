"use client";

import React from "react";
import { Check } from "lucide-react";
import { TaskStep } from "@/types";

interface TaskProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: TaskStep[];
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ currentStep, totalSteps, steps }) => {
  const percentage = Math.round(((currentStep - 1) / totalSteps) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-gray-900">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-xs">
          {percentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, 5)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Steps dots / names */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {steps.map((step) => {
          const isDone = step.completed || step.step_number < currentStep;
          const isCurrent = step.step_number === currentStep;

          return (
            <div key={step.step_number} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-purple-600 text-white ring-4 ring-purple-100 shadow-sm"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.step_number}
              </div>
              <span
                className={`text-[10px] mt-1.5 line-clamp-1 max-w-[80px] font-medium ${
                  isCurrent ? "text-purple-700 font-bold" : "text-gray-500"
                }`}
                title={step.title}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
