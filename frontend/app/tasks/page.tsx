"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Compass, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getTaskCatalog, createTask } from "@/lib/api";
import { TaskCatalogItem } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

export default function TasksCatalogPage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [catalog, setCatalog] = useState<TaskCatalogItem[]>([]);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const t = translations[currentLang];

  useEffect(() => {
    getTaskCatalog()
      .then(setCatalog)
      .catch(() => {
        // Fallback default tasks
        setCatalog([
          {
            type: "sample_application",
            title: "Sample Online Application",
            description: "Practice filling out and submitting a simple digital form one step at a time without any fear of mistakes.",
            estimated_minutes: 4,
            total_steps: 5,
            badge: "Most Popular",
          },
          {
            type: "document_verification",
            title: "Sample Document Verification",
            description: "Learn how to safely verify your document upload, match names, and avoid common verification mistakes.",
            estimated_minutes: 3,
            total_steps: 5,
            badge: "Verification",
          },
          {
            type: "utility_bill",
            title: "Sample Utility Bill Verification",
            description: "Step-by-step guidance on safely checking your electricity or water bill before making an online payment.",
            estimated_minutes: 3,
            total_steps: 4,
            badge: "Billing",
          },
        ]);
      });
  }, []);

  const handleStartTask = async (taskType: string) => {
    setLoadingType(taskType);
    try {
      const newTask = await createTask(taskType, currentLang);
      router.push(`/tasks/${newTask.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not start task. Please ensure the backend server is running.");
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Practice Sandbox</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t.catalogTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.catalogSubtitle}
          </p>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalog.map((item) => (
            <div
              key={item.type}
              className="bg-white rounded-3xl border-2 border-purple-100 hover:border-purple-300 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{item.estimated_minutes} min</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 text-xs text-purple-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.total_steps} simple steps</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleStartTask(item.type)}
                  disabled={loadingType === item.type}
                  className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingType === item.type ? (
                    <span className="animate-pulse">Setting up workspace...</span>
                  ) : (
                    <>
                      <span>Start Guided Task</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Note */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3 text-xs text-purple-900 max-w-xl mx-auto">
          <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
          <p>
            You are never graded or evaluated. You can pause anytime, restart as many times as you like, and ask for help whenever you feel unsure.
          </p>
        </div>
      </main>
    </div>
  );
}
