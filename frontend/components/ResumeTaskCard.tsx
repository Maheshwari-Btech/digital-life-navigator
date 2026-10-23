"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Play, RotateCcw, ArrowRight } from "lucide-react";
import { Task } from "@/types";
import { resumeTask, createTask } from "@/lib/api";
import { LanguageCode, translations } from "@/lib/translations";

interface ResumeTaskCardProps {
  task: Task;
  currentLang: LanguageCode;
  onRefresh?: () => void;
}

export const ResumeTaskCard: React.FC<ResumeTaskCardProps> = ({ task, currentLang, onRefresh }) => {
  const router = useRouter();
  const t = translations[currentLang];

  const handleContinue = async () => {
    try {
      await resumeTask(task.id);
      router.push(`/tasks/${task.id}`);
    } catch (err) {
      router.push(`/tasks/${task.id}`);
    }
  };

  const handleStartOver = async () => {
    try {
      const newTask = await createTask(task.type, currentLang);
      router.push(`/tasks/${newTask.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const completedStepsCount = Math.max(0, task.current_step - 1);

  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-white rounded-2xl border-2 border-purple-200 p-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.activeTaskBanner}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600">
            You completed <span className="font-semibold text-purple-700">{completedStepsCount}</span> of{" "}
            <span className="font-semibold text-gray-800">{task.total_steps}</span> steps. Ready to continue from{" "}
            <span className="font-semibold text-purple-700">Step {task.current_step}</span>?
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleContinue}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.continueBtn} (Step {task.current_step})</span>
          </button>

          <button
            onClick={handleStartOver}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.startOverBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
