"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Clock, Play, RotateCcw, CheckCircle, ShieldCheck } from "lucide-react";
import { getActiveTasks, resumeTask, createTask } from "@/lib/api";
import { Task } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

function ResumeContent({ currentLang }: { currentLang: LanguageCode }) {
  const searchParams = useSearchParams();
  const isJustPaused = searchParams?.get("paused") === "true";
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const t = translations[currentLang];

  const fetchTasks = async () => {
    try {
      const list = await getActiveTasks();
      setTasks(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleContinue = async (task: Task) => {
    try {
      await resumeTask(task.id);
      router.push(`/tasks/${task.id}`);
    } catch {
      router.push(`/tasks/${task.id}`);
    }
  };

  const handleStartOver = async (task: Task) => {
    try {
      const newTask = await createTask(task.type, currentLang);
      router.push(`/tasks/${newTask.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
      {/* Paused Confirmation Banner */}
      {isJustPaused && (
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-600 shrink-0" />
            <div>
              <h3 className="font-bold text-base">Your task has been safely paused</h3>
              <p className="text-xs text-indigo-800">
                You can close your browser or leave anytime. Your progress will be waiting right here.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>Saved Workspaces</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Continue Later / Resume
        </h2>
        <p className="text-sm text-gray-600">
          Never lose your place. You will not be forced to repeat completed steps.
        </p>
      </div>

      {/* Saved Tasks List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Checking for saved tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-4">
          <Clock className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No Paused Tasks</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You don’t have any pending tasks right now. Ready to start practicing a new digital procedure?
          </p>
          <button
            onClick={() => router.push("/tasks")}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition"
          >
            Explore Tasks
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const completedCount = Math.max(0, task.current_step - 1);
            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border-2 border-purple-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Status: {task.status}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">
                    You completed <span className="font-semibold text-purple-700">{completedCount}</span> of{" "}
                    <span className="font-semibold text-gray-800">{task.total_steps}</span> steps.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleContinue(task)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Continue from Step {task.current_step}</span>
                  </button>

                  <button
                    onClick={() => handleStartOver(task)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start Over</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function ResumePage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />
      <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Loading saved tasks...</div>}>
        <ResumeContent currentLang={currentLang} />
      </Suspense>
    </div>
  );
}
