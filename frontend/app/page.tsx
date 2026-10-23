"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { WelcomeCard } from "@/components/WelcomeCard";
import { ResumeTaskCard } from "@/components/ResumeTaskCard";
import { StuckModal } from "@/components/StuckModal";
import { getActiveTasks } from "@/lib/api";
import { Task } from "@/types";
import { LanguageCode } from "@/lib/translations";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isStuckModalOpen, setIsStuckModalOpen] = useState(false);

  useEffect(() => {
    // Check if there is an active or paused task
    getActiveTasks()
      .then((tasks) => {
        if (tasks && tasks.length > 0) {
          setActiveTask(tasks[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectStuck = () => {
    if (activeTask) {
      setIsStuckModalOpen(true);
    } else {
      // If no active task, direct them to tasks catalog to start practicing
      router.push("/tasks");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/40 via-white to-slate-50">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Active/Paused Task Resume Banner */}
        {activeTask && (
          <ResumeTaskCard
            task={activeTask}
            currentLang={currentLang}
            onRefresh={() => setActiveTask(null)}
          />
        )}

        {/* 3 Core Product Choices */}
        <WelcomeCard
          currentLang={currentLang}
          onSelectStuck={handleSelectStuck}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 py-6 text-center text-xs text-gray-500 bg-white">
        <p>Digital Life Navigator • Amazon Developer Hackathon • Built for Less-Confident Digital Users</p>
      </footer>

      {/* Stuck Modal for active task */}
      {activeTask && (
        <StuckModal
          taskId={activeTask.id}
          isOpen={isStuckModalOpen}
          currentLang={currentLang}
          onClose={() => setIsStuckModalOpen(false)}
          onResolved={() => {
            setIsStuckModalOpen(false);
            router.push(`/tasks/${activeTask.id}`);
          }}
          onRewindStep={() => {
            setIsStuckModalOpen(false);
            router.push(`/tasks/${activeTask.id}`);
          }}
        />
      )}
    </div>
  );
}
