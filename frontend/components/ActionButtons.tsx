"use client";

import React from "react";
import { Check, AlertTriangle, ArrowLeft, Pause, HelpCircle, ArrowRight } from "lucide-react";
import { LanguageCode, translations } from "@/lib/translations";

interface ActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  currentLang: LanguageCode;
  isProcessing: boolean;
  onDone: () => void;
  onStuck: () => void;
  onBack: () => void;
  onPause: () => void;
  onExplain: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentStep,
  totalSteps,
  currentLang,
  isProcessing,
  onDone,
  onStuck,
  onBack,
  onPause,
  onExplain,
}) => {
  const t = translations[currentLang];
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="space-y-3">
      {/* Primary Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Done / Next Step */}
        <button
          onClick={onDone}
          disabled={isProcessing}
          className="flex-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-101 active:scale-99 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>{isFinalStep ? "Finish & Complete Task" : t.doneBtn}</span>
          {!isFinalStep && <ArrowRight className="w-4 h-4 ml-1" />}
        </button>

        {/* I'm Stuck Button */}
        <button
          onClick={onStuck}
          disabled={isProcessing}
          className="flex-1 py-4 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-md shadow-amber-200 hover:scale-101 active:scale-99 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{t.imStuckBtn}</span>
        </button>
      </div>

      {/* Secondary Controls Row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 flex-wrap">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={currentStep <= 1 || isProcessing}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Explain Button */}
          <button
            onClick={onExplain}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.explainBtn}</span>
          </button>

          {/* Continue Later (Pause) */}
          <button
            onClick={onPause}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span>{t.continueLaterBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
