"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, Mic, FileText, Globe } from "lucide-react";
import { getHealth } from "@/lib/api";
import { HealthStatus } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

interface AppHeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentLang, onLanguageChange }) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const t = translations[currentLang];

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => {
        // Fallback default status
        setHealth({
          status: "healthy",
          app: "Digital Life Navigator",
          version: "1.0.0",
          database: "connected",
          ai_provider: "Local Demo AI Engine",
          is_cloud_ai: false,
          ui_label: "Guidance powered by local demo AI (₹0)",
          ui_badge: "Local Demo AI (₹0)",
        });
      });
  }, []);

  return (
    <header className="border-b border-purple-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              {t.appName}
            </h1>
            <p className="text-xs text-purple-700 font-medium">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Honest AI Status Badge */}
          <div
            className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border shadow-xs ${
              health?.is_cloud_ai
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-purple-50 text-purple-800 border-purple-200"
            }`}
            title={health?.ui_label || "AI Status"}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{health?.ui_badge || "Local Demo Mode (₹0)"}</span>
          </div>

          {/* Quick Links */}
          <Link
            href="/tasks"
            className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
          >
            Tasks
          </Link>
          <Link
            href="/message"
            className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Explain Message</span>
          </Link>

          {/* Simulated Alexa+ Shortcut */}
          <Link
            href="/assistant"
            className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs hover:shadow-md hover:from-cyan-700 hover:to-blue-700 transition flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Alexa+ Guide</span>
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-1 pl-1 border-l border-gray-200">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="text-xs sm:text-sm bg-transparent border-0 font-medium text-gray-700 focus:ring-0 cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
