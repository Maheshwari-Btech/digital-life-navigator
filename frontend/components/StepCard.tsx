"use client";

import React, { useState } from "react";
import { Info, HelpCircle, FileText, CheckCircle, ShieldCheck } from "lucide-react";
import { TaskStep } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

interface StepCardProps {
  step: TaskStep;
  taskType: string;
  currentLang: LanguageCode;
  onExplainClick: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  taskType,
  currentLang,
  onExplainClick,
}) => {
  const t = translations[currentLang];
  const [sampleInput, setSampleInput] = useState("");
  const [sampleChecked, setSampleChecked] = useState(false);

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Step Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            {t.stepOf} {step.step_number}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {step.title}
          </h2>
        </div>

        <button
          onClick={onExplainClick}
          className="shrink-0 p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title="Explain this step simply"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{t.explainBtn}</span>
        </button>
      </div>

      {/* Main Instruction (Large readable typography) */}
      <div className="bg-gradient-to-r from-purple-50/70 to-indigo-50/50 rounded-2xl p-5 border border-purple-100">
        <p className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed">
          {step.instruction}
        </p>
      </div>

      {/* Why This Matters Box */}
      <div className="flex items-start gap-3 bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 text-sm text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 mb-0.5">{t.whyThisMatters}</h4>
          <p className="text-amber-800/90 leading-relaxed">{step.explanation}</p>
        </div>
      </div>

      {/* Synthetic Interactive Practice Sandbox */}
      <div className="border border-dashed border-purple-200 rounded-2xl p-5 bg-slate-50/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safe Practice Sandbox (Synthetic Demo)</span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium">100% Safe • No Real Data</span>
        </div>

        {/* Dynamic Sandbox UI depending on step */}
        {step.step_number === 1 && (
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-2">
            <p className="text-xs text-gray-500">Practice clicking the button to see how it works:</p>
            <button
              onClick={() => setSampleChecked(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                sampleChecked
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {sampleChecked ? "✓ Section Opened Safely!" : "Click: Start Application"}
            </button>
          </div>
        )}

        {step.step_number === 2 && (
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
            <label className="block text-xs font-medium text-gray-700">
              Practice entering a sample name:
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {sampleInput.length > 2 && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Great! You see how simple typing here is.
              </p>
            )}
          </div>
        )}

        {step.step_number === 3 && (
          <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">sample_document_clear.pdf</p>
                <p className="text-[11px] text-gray-500">Preview: Name and photo clearly visible</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-md border border-emerald-200">
              Verified Readable
            </span>
          </div>
        )}

        {step.step_number >= 4 && (
          <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Summary Review: </span>
              All sample details are in order. Ready for final review.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
