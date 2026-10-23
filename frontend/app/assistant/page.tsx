"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SimulatedAlexaAssistant } from "@/components/SimulatedAlexaAssistant";
import { LanguageCode } from "@/lib/translations";

export default function AssistantPage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <SimulatedAlexaAssistant currentLang={currentLang} />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        <p>Alexa+ Simulation Engine • Built for Amazon Developer Hackathon • Multi-turn Voice/Text Assistant</p>
      </footer>
    </div>
  );
}
