"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { TaskProgress } from "@/components/TaskProgress";
import { StepCard } from "@/components/StepCard";
import { ActionButtons } from "@/components/ActionButtons";
import { StuckModal } from "@/components/StuckModal";
import { CompletionCard } from "@/components/CompletionCard";
import {
  getTask,
  advanceStep,
  stepBack,
  pauseTask,
  explainStep,
} from "@/lib/api";
import { Task, ExplainResponse } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";
import { Sparkles, HelpCircle, X, CheckCircle, ShieldAlert } from "lucide-react";

export default function GuidedTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [isStuckOpen, setIsStuckOpen] = useState(false);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);

  const t = translations[currentLang];

  const fetchTaskDetails = async () => {
    try {
      const data = await getTask(taskId);
      setTask(data);
    } catch (err) {
      console.error("Error loading task:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleDone = async () => {
    if (!task || processingAction) return;
    setProcessingAction(true);
    try {
      const updated = await advanceStep(task.id);
      setTask(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleBack = async () => {
    if (!task || task.current_step <= 1 || processingAction) return;
    setProcessingAction(true);
    try {
      const updated = await stepBack(task.id);
      setTask(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  const handlePause = async () => {
    if (!task || processingAction) return;
    setProcessingAction(true);
    try {
      await pauseTask(task.id);
      router.push("/resume?paused=true");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleExplain = async () => {
    if (!task) return;
    try {
      const res = await explainStep(task.id);
      setExplanation(res);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-600">Loading your safe workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Task Not Found</h3>
            <p className="text-sm text-gray-600">
              We couldn’t retrieve this task. It may have been completed or removed.
            </p>
            <button
              onClick={() => router.push("/tasks")}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm"
            >
              Choose a New Task
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If task completed, render completion card
  if (task.status === "COMPLETED") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
          <CompletionCard task={task} currentLang={currentLang} />
        </main>
      </div>
    );
  }

  const currentStepObj = task.steps.find((s) => s.step_number === task.current_step) || task.steps[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Task Title & Progress */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {task.title}
          </h1>

          <TaskProgress
            currentStep={task.current_step}
            totalSteps={task.total_steps}
            steps={task.steps}
          />
        </div>

        {/* Step Card with Interactive Practice Sandbox */}
        <StepCard
          step={currentStepObj}
          taskType={task.type}
          currentLang={currentLang}
          onExplainClick={handleExplain}
        />

        {/* Action Controls */}
        <ActionButtons
          currentStep={task.current_step}
          totalSteps={task.total_steps}
          currentLang={currentLang}
          isProcessing={processingAction}
          onDone={handleDone}
          onStuck={() => setIsStuckOpen(true)}
          onBack={handleBack}
          onPause={handlePause}
          onExplain={handleExplain}
        />
      </main>

      {/* Stuck & Recovery Modal */}
      <StuckModal
        taskId={task.id}
        isOpen={isStuckOpen}
        currentLang={currentLang}
        onClose={() => setIsStuckOpen(false)}
        onResolved={fetchTaskDetails}
        onRewindStep={handleBack}
      />

      {/* Step Explanation Dialog */}
      {explanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Plain Language Guide</span>
              </span>
              <button
                onClick={() => setExplanation(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {explanation.title}
            </h3>

            <div className="space-y-3 text-sm">
              <p className="text-gray-800 leading-relaxed font-medium">
                {explanation.plain_english}
              </p>

              <div className="p-3 bg-purple-50 rounded-xl text-purple-900 text-xs">
                <strong>Why this matters: </strong>
                {explanation.why_it_matters}
              </div>

              <div className="p-3 bg-red-50 rounded-xl text-red-900 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{explanation.what_not_to_do}</span>
              </div>

              <p className="text-xs text-emerald-700 font-semibold italic">
                {explanation.encouragement}
              </p>
            </div>

            <button
              onClick={() => setExplanation(null)}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm"
            >
              I Understand, Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
