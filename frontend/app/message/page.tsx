"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MessageExplanationCard } from "@/components/MessageExplanationCard";
import { FileText, Sparkles, Send, ShieldAlert, ArrowRight } from "lucide-react";
import { explainMessage } from "@/lib/api";
import { MessageExplanationResponse } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

const SAMPLE_MESSAGES = [
  {
    title: "Document Verification Request",
    text: "You are requested to verify your document before continuing your application.",
  },
  {
    title: "Utility Bill Due Notice",
    text: "Your electricity bill for consumer 10098234 is due in 3 days. Please pay ₹1450 to avoid disconnection.",
  },
  {
    title: "KYC Update Alert",
    text: "Action required: Update your basic profile and verify your identity details within 24 hours.",
  },
];

export default function MessageUnderstandingPage() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [messageInput, setMessageInput] = useState("");
  const [explanation, setExplanation] = useState<MessageExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[currentLang];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const target = (textToAnalyze || messageInput).trim();
    if (!target) return;

    setLoading(true);
    setError(null);
    try {
      const res = await explainMessage(target, currentLang);
      setExplanation(res);
    } catch (err: any) {
      setError("We could not analyze this message right now. Your progress is safe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>Flow A: Message Understanding Engine</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t.understandMsgTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.understandMsgSub}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl border-2 border-indigo-100 p-6 sm:p-8 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-gray-800">
            Paste the notification, SMS, or confusing text:
          </label>

          <textarea
            rows={4}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={t.pastePlaceholder}
            className="w-full p-4 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => handleAnalyze()}
              disabled={!messageInput.trim() || loading}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? t.analyzingBtn : t.analyzeBtn}</span>
            </button>

            <span className="text-xs text-gray-500 flex items-center gap-1 self-center">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>Never paste real bank passwords or private OTPs</span>
            </span>
          </div>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t.sampleMessages}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_MESSAGES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessageInput(s.text);
                    handleAnalyze(s.text);
                  }}
                  className="p-3 text-left bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-gray-200 hover:border-indigo-300 text-xs transition cursor-pointer"
                >
                  <p className="font-bold text-gray-800">{s.title}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{s.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-sm">
            {error}
          </div>
        )}

        {/* Structured Explanation Result */}
        {explanation && (
          <MessageExplanationCard
            explanation={explanation}
            currentLang={currentLang}
          />
        )}
      </main>
    </div>
  );
}
