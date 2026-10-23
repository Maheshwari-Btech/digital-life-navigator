"use client";

import React, { useState } from "react";
import { X, AlertCircle, HelpCircle, MousePointerClick, RefreshCw, Undo2, Check, Sparkles } from "lucide-react";
import { RecoveryResponse } from "@/types";
import { reportStuck, stepBack } from "@/lib/api";
import { LanguageCode, translations } from "@/lib/translations";

interface StuckModalProps {
  taskId: string;
  isOpen: boolean;
  currentLang: LanguageCode;
  onClose: () => void;
  onResolved: () => void;
  onRewindStep: () => void;
}

const STUCK_REASONS = [
  { id: "dont_understand", label: "I don't understand this", icon: HelpCircle },
  { id: "where_to_click", label: "I don't know where to click", icon: MousePointerClick },
  { id: "not_sure_meaning", label: "I'm not sure what this means", icon: AlertCircle },
  { id: "made_mistake", label: "I think I made a mistake", icon: Undo2 },
  { id: "show_again", label: "Show me again / Explain simpler", icon: RefreshCw },
];

export const StuckModal: React.FC<StuckModalProps> = ({
  taskId,
  isOpen,
  currentLang,
  onClose,
  onResolved,
  onRewindStep,
}) => {
  const t = translations[currentLang];
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovery, setRecovery] = useState<RecoveryResponse | null>(null);

  if (!isOpen) return null;

  const handleSelectReason = async (reasonText: string) => {
    setSelectedReason(reasonText);
    setLoading(true);
    try {
      const res = await reportStuck(taskId, reasonText, customNote || undefined);
      setRecovery(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setRecovery(null);
    setCustomNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Friendly Recovery Assistant</span>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              {recovery ? t.recoveryTitle : t.stuckModalTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {recovery ? "Follow these simple steps to get right back on track." : t.stuckModalSub}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: Choose Reason */}
        {!recovery && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2.5">
              {STUCK_REASONS.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectReason(r.label)}
                    disabled={loading}
                    className="p-4 rounded-2xl border-2 border-gray-100 hover:border-amber-400 hover:bg-amber-50/50 text-left transition flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-amber-900">
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {loading && (
              <div className="text-center py-4 text-sm text-amber-700 font-medium animate-pulse">
                Finding the simplest way forward...
              </div>
            )}
          </div>
        )}

        {/* State 2: Display Recovery Guidance */}
        {recovery && (
          <div className="space-y-5">
            {/* Reassurance Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <p className="text-sm font-bold text-amber-900">
                {recovery.reassurance}
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                {recovery.simpler_instruction}
              </p>
            </div>

            {/* Action Items Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t.actionChecklist}
              </h4>
              <ul className="space-y-2">
                {recovery.action_items.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-sm text-gray-800 flex items-start gap-2.5 font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  onResolved();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.iDidItBtn}</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onRewindStep();
                }}
                className="w-full sm:flex-none py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Undo2 className="w-4 h-4" />
                <span>Go Back a Step</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
