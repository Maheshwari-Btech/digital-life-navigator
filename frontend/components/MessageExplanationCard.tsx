"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Compass } from "lucide-react";
import { MessageExplanationResponse } from "@/types";
import { createTask } from "@/lib/api";
import { LanguageCode, translations } from "@/lib/translations";

interface MessageExplanationCardProps {
  explanation: MessageExplanationResponse;
  currentLang: LanguageCode;
}

export const MessageExplanationCard: React.FC<MessageExplanationCardProps> = ({
  explanation,
  currentLang,
}) => {
  const router = useRouter();
  const t = translations[currentLang];

  const handleStartTask = async () => {
    try {
      const taskType = explanation.suggested_task_type || "sample_application";
      const newTask = await createTask(taskType, currentLang);
      router.push(`/tasks/${newTask.id}`);
    } catch (err) {
      console.error("Failed to start task:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{explanation.ai_source}</span>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {explanation.summary}
          </h3>
        </div>
      </div>

      {/* Plain Meaning */}
      <div className="space-y-1.5 bg-purple-50/60 rounded-2xl p-5 border border-purple-100">
        <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
          {t.whatItMeans}
        </h4>
        <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
          {explanation.meaning}
        </p>
      </div>

      {/* Why It Matters & Next Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why It Matters */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200/80 space-y-1">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            {t.whyThisMatters}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {explanation.why_it_matters}
          </p>
        </div>

        {/* What to do next */}
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            {t.whatToDoNext}
          </h4>
          <p className="text-sm text-indigo-950 font-medium leading-relaxed">
            {explanation.next_action}
          </p>
        </div>
      </div>

      {/* What NOT to do (Safety Alert) */}
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
            {t.whatNotToDo}
          </h4>
          <p className="text-sm text-red-800 leading-relaxed font-medium">
            {explanation.warning}
          </p>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      {explanation.steps && explanation.steps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Recommended Action Steps:
          </h4>
          <div className="space-y-2">
            {explanation.steps.map((s) => (
              <div
                key={s.step_number}
                className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3 text-sm text-gray-800"
              >
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step_number}
                </span>
                <div>
                  <h5 className="font-bold text-gray-900">{s.title}</h5>
                  <p className="text-xs text-gray-600 mt-0.5">{s.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action: Start Guided Task */}
      <div className="pt-2">
        <button
          onClick={handleStartTask}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-purple-200 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span>{t.startTaskForThis}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
