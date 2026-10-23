"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, HelpCircle, AlertTriangle, ArrowRight, Mic, Sparkles } from "lucide-react";
import { LanguageCode, translations } from "@/lib/translations";

interface WelcomeCardProps {
  currentLang: LanguageCode;
  onSelectStuck: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ currentLang, onSelectStuck }) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calm, Simple, Step-by-Step Guidance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t.homeTitle}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {t.homeSubtitle}
        </p>
      </div>

      {/* 3 Core Product Choices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Choice 1: I want to do something */}
        <Link
          href="/tasks"
          className="group relative bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
              {t.choiceDo}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t.choiceDoSub}
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-purple-700 group-hover:translate-x-1 transition-transform">
            <span>Explore tasks</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </Link>

        {/* Choice 2: I don't understand this message */}
        <Link
          href="/message"
          className="group relative bg-white rounded-2xl p-6 border-2 border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
              {t.choiceExplain}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t.choiceExplainSub}
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-indigo-700 group-hover:translate-x-1 transition-transform">
            <span>Explain a message</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </Link>

        {/* Choice 3: I'm stuck */}
        <button
          onClick={onSelectStuck}
          className="group text-left relative bg-white rounded-2xl p-6 border-2 border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
              {t.choiceStuck}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t.choiceStuckSub}
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>Get unstuck now</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </button>
      </div>

      {/* Simulated Alexa+ Voice Assistant Showcase Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-cyan-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Simulated Amazon Alexa+ Experience</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Prefer speaking? Let Alexa+ guide you aloud.
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              Experience agentic, voice-guided digital assistance. Ask questions, say “I’m stuck,” or pause anytime just using conversational voice commands.
            </p>
          </div>

          <Link
            href="/assistant"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 transition flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            <span>Launch Alexa+ Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
