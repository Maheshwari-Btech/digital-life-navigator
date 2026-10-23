"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
} from "lucide-react";
import { sendAlexaMessage, getAlexaStatus } from "@/lib/api";
import { AlexaMessageResponse, AlexaVisualCard } from "@/types";
import { LanguageCode, translations } from "@/lib/translations";

interface MessageEntry {
  sender: "user" | "alexa";
  text: string;
  visualCard?: AlexaVisualCard;
  audioCue?: string;
  timestamp: string;
}

interface SimulatedAlexaAssistantProps {
  currentLang: LanguageCode;
}

export const SimulatedAlexaAssistant: React.FC<SimulatedAlexaAssistantProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<MessageEntry[]>([
    {
      sender: "alexa",
      text: "Hello! I am your Alexa+ Digital Life Navigator. Show me what you're trying to do, and I'll help you do it one step at a time. What would you like help with today?",
      visualCard: {
        title: "Welcome to Alexa+ Digital Guide",
        content: "• Understand an unfamiliar message or SMS\n• Step-by-step help completing an online application\n• Say 'I'm stuck' anytime for immediate help",
        status: "UNDERSTANDING",
        action_prompt: "Say or type: 'Help me start an application' or 'Explain a document message'",
      },
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [alexaStatus, setAlexaStatus] = useState<any>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Play synthetic soft audio cue using Web Audio API
  const playAudioTone = (cueType: string = "chime") => {
    try {
      if (typeof window === "undefined") return;
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (cueType === "affirmative") {
        // Double pleasant chime
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else if (cueType === "recovery") {
        // Gentle reassuring tone
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        // Standard chime
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio playback is optional
    }
  };

  // Text to Speech with robust browser unlocking
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langCode = currentLang === "hi" ? "hi" : currentLang === "mr" ? "mr" : "en";
        // Prefer natural female assistant voices if available
        const selectedVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith(langCode) && (v.name.includes("Natural") || v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google"))) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(langCode)) ||
          voices[0];
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else {
        if (currentLang === "hi") utterance.lang = "hi-IN";
        else if (currentLang === "mr") utterance.lang = "mr-IN";
        else utterance.lang = "en-US";
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  };

  // Pre-load voices on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLang === "hi" ? "hi-IN" : currentLang === "mr" ? "mr-IN" : "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          if (transcript) {
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            setVoiceNotice("Microphone permission is blocked. Please allow microphone access in your browser or type your message below.");
          } else if (event.error === "no-speech") {
            // User did not say anything, safely ignore
          } else {
            console.warn("Speech recognition error:", event.error);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    getAlexaStatus().then(setAlexaStatus).catch(() => {});

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, [currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleMic = () => {
    setVoiceNotice(null);
    if (!recognitionRef.current) {
      setVoiceNotice("Voice recognition is not supported in this browser. Please type your message below.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    const userMsg: MessageEntry = {
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res: AlexaMessageResponse = await sendAlexaMessage(trimmed, currentTaskId, currentLang);

      if (res.current_task_id) {
        setCurrentTaskId(res.current_task_id);
      }

      const alexaMsg: MessageEntry = {
        sender: "alexa",
        text: res.alexa_reply,
        visualCard: res.visual_card,
        audioCue: res.audio_cue,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, alexaMsg]);

      playAudioTone(res.audio_cue || "chime");
      speakText(res.speech_text || res.alexa_reply);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "alexa",
          text: "I had trouble connecting to the navigator service. Your progress is saved. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alexa+ Device Surface */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-cyan-500/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow Ring Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Alexa Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 relative z-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Glowing Alexa Ring Orb */}
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                isListening
                  ? "border-cyan-400 bg-cyan-500/30 shadow-[0_0_25px_#22d3ee] scale-110"
                  : isLoading
                  ? "border-purple-400 bg-purple-500/20 shadow-[0_0_20px_#a855f7] animate-spin"
                  : "border-cyan-500/50 bg-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full ${
                  isListening
                    ? "bg-cyan-300 animate-ping"
                    : isLoading
                    ? "bg-purple-300 animate-pulse"
                    : "bg-cyan-400"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Alexa+ Simulator
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Live Agentic
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Simulated conversational guide for Amazon Developer Hackathon
              </p>
            </div>
          </div>

          {/* Voice Toggle Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVoiceEnabled(true);
                playAudioTone("affirmative");
                speakText("Hello! Alexa voice speech is active and ready.");
              }}
              className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Test audio speech"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Audio</span>
            </button>
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled && typeof window !== "undefined") {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                voiceEnabled
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
              title="Toggle Alexa Voice Speech"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{voiceEnabled ? "Voice On" : "Muted"}</span>
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="my-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 relative z-10">
          {messages.map((msg, index) => {
            const isAlexa = msg.sender === "alexa";

            return (
              <div
                key={index}
                className={`flex gap-3 animate-in fade-in duration-300 ${
                  isAlexa ? "items-start" : "items-start flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAlexa
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {isAlexa ? "A+" : "You"}
                </div>

                {/* Bubble & Visual Card */}
                <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAlexa
                        ? "bg-white/10 text-white backdrop-blur-md border border-white/10"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                      <span
                        className={`text-[10px] block ${
                          isAlexa ? "text-gray-400" : "text-purple-200"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                      {isAlexa && (
                        <button
                          onClick={() => {
                            playAudioTone("chime");
                            speakText(msg.text);
                          }}
                          className="text-cyan-400 hover:text-cyan-200 text-xs flex items-center gap-1 opacity-80 hover:opacity-100 transition cursor-pointer"
                          title="Read message aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Read aloud</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Alexa Visual Card (Show on Device Screen) */}
                  {msg.visualCard && (
                    <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 text-xs space-y-2.5 shadow-lg shadow-cyan-950/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{msg.visualCard.title}</span>
                        </span>
                        {msg.visualCard.status && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              msg.visualCard.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : msg.visualCard.status === "RECOVERY"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : msg.visualCard.status === "PAUSED"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            }`}
                          >
                            {msg.visualCard.status}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                        {msg.visualCard.content}
                      </p>

                      {msg.visualCard.action_prompt && (
                        <p className="text-cyan-400 font-semibold italic text-[11px] pt-1 border-t border-white/10">
                          {msg.visualCard.action_prompt}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs italic pl-12 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alexa+ is analyzing the task state...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs relative z-10 scrollbar-none">
          <span className="text-gray-400 text-[11px] shrink-0 font-medium">Quick asks:</span>
          {["Done", "I'm stuck", "Explain this step", "Pause for later", "Help me verify a document"].map(
            (suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(suggestion)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 hover:text-white transition cursor-pointer"
              >
                {suggestion}
              </button>
            )
          )}
        </div>

        {/* Voice Notice Banner if mic unavailable or denied */}
        {voiceNotice && (
          <div className="flex items-center justify-between gap-2 p-2.5 mb-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">
            <span>{voiceNotice}</span>
            <button
              onClick={() => setVoiceNotice(null)}
              className="text-amber-300 hover:text-white text-xs font-bold px-1.5 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar with Voice & Send */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10 relative z-10">
          {/* Microphone button */}
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
            }`}
            title={isListening ? "Listening... click to stop" : "Click to speak to Alexa+"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={isListening ? t.micListening : t.alexaPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            disabled={isLoading || isListening}
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Send button */}
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Under-the-hood explanation box for Hackathon Judges */}
      <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs text-xs text-gray-600 space-y-2">
        <div className="flex items-center justify-between font-bold text-gray-800">
          <span className="flex items-center gap-1.5 text-purple-700">
            <Compass className="w-4 h-4" />
            <span>Hackathon Implementation Architecture: Simulated Alexa+</span>
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-semibold text-[10px]">
            Alexa+ Track Compliant
          </span>
        </div>
        <p className="leading-relaxed">
          This simulated Alexa+ layer demonstrates multi-turn voice interaction, intent parsing, deterministic state progression, and recovery. In a live production Alexa+ skill, these speech intents directly interface with the exact same backend <code>TaskEngine</code> and <code>AIProvider</code> API endpoints.
        </p>
      </div>
    </div>
  );
};
