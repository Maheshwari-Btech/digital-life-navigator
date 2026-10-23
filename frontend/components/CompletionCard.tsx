"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Award, ArrowRight, ShieldCheck, Home } from "lucide-react";
import { Task } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

interface CompletionCardProps {
  task: Task;
  currentLang: LanguageCode;
}

export const CompletionCard: React.FC<CompletionCardProps> = ({ task, currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 p-8 sm:p-12 shadow-2xl text-center max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      {/* Icon Badge */}
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-200 animate-bounce">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t.completedTitle}
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          {t.completedSub}
        </p>
      </div>

      {/* Achievement Summary Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-left space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Task Accomplished: {task.title}</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
          You completed all <strong>{task.total_steps} steps</strong> one at a time. You practiced checking details, avoiding fraud, and navigating digital services safely.
        </p>
      </div>

      {/* Safe Habits to Remember */}
      <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 text-left space-y-2">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Keep this in mind for real life:</span>
        </h4>
        <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
          <li>Never share bank OTPs or secret passwords with anyone.</li>
          <li>Take your time—it is always safe to pause and continue later.</li>
          <li>Double check the spelling of your name before final submission.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/tasks"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition flex items-center justify-center gap-2"
        >
          <span>Practice Another Task</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t.returnHomeBtn}</span>
        </Link>
      </div>
    </div>
  );
};
