"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useListFields } from "~/hooks/api/form-field";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { usePublicForm } from "~/hooks/api/form";

type FormField = {
  id: string;
  label: string;
  labelKey: string;
  placeholder?: string;
  description?: string;
  type: string;
  options?: any;
  isRequired: boolean;
  validationRules?: any;
  conditionalLogic?: any;
};

type ThemeConfig = {
  name: string;
  type: "WHITE" | "BLACK";
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  sub: string;
  input: string;
  button: string;
  badge: string;
  accent: string;
  isDark?: boolean;
  blob1?: string;
  blob2?: string;
  isDiscord?: boolean;
  isVSCode?: boolean;
  isMacOS?: boolean;
  isWindows?: boolean;
  isAnime?: boolean;
  isSpiderman?: boolean;
  isSuperman?: boolean;
  isNinja?: boolean;
  isDoraemon?: boolean;
};

const themes: Record<string, ThemeConfig> = {
  // ── SUPERHERO & CARTOON POPULAR THEMES ──
  Spiderman: {
    name: "Spider-Man Web Suit",
    type: "BLACK",
    bg: "bg-gradient-to-br from-[#0e0406] via-[#1a070a] to-[#040817]",
    cardBg: "bg-[#18080c]/90 backdrop-blur-2xl",
    cardBorder: "border-[#e63946]/50 shadow-[0_0_50px_rgba(230,57,70,0.35)]",
    text: "text-red-50",
    sub: "text-rose-300/80",
    input: "bg-[#100407] border-[#e63946]/40 text-white placeholder-rose-500 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/30",
    button: "from-[#e63946] via-[#b7094c] to-[#0077b6] text-white shadow-[0_0_30px_rgba(230,57,70,0.5)]",
    badge: "bg-[#e63946]/20 text-[#e63946] border border-[#e63946]/40 font-bold",
    accent: "#e63946",
    isDark: true,
    isSpiderman: true,
    blob1: "bg-red-500/25",
    blob2: "bg-blue-600/25",
  },
  Superman: {
    name: "Superman Shield",
    type: "BLACK",
    bg: "bg-gradient-to-br from-[#040d21] via-[#091a42] to-[#1c0826]",
    cardBg: "bg-[#0a1838]/90 backdrop-blur-2xl",
    cardBorder: "border-[#dc2626]/50 shadow-[0_0_50px_rgba(220,38,38,0.3)]",
    text: "text-blue-50",
    sub: "text-amber-200/80",
    input: "bg-[#050e24] border-blue-700/60 text-white placeholder-blue-400 focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/30",
    button: "from-[#dc2626] via-[#e11d48] to-[#eab308] text-white shadow-[0_0_30px_rgba(220,38,38,0.5)]",
    badge: "bg-[#dc2626]/20 text-[#eab308] border border-[#dc2626]/40 font-extrabold",
    accent: "#dc2626",
    isDark: true,
    isSuperman: true,
    blob1: "bg-blue-600/25",
    blob2: "bg-amber-500/25",
  },
  NinjaHattori: {
    name: "Ninja Hattori Shadow",
    type: "BLACK",
    bg: "bg-gradient-to-br from-[#050e1a] via-[#0c1e36] to-[#031424]",
    cardBg: "bg-[#0c1e36]/90 backdrop-blur-2xl",
    cardBorder: "border-[#38bdf8]/50 shadow-[0_0_50px_rgba(56,189,248,0.3)]",
    text: "text-sky-50",
    sub: "text-amber-300/80",
    input: "bg-[#040d1a] border-sky-800/70 text-sky-100 placeholder-sky-500 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30",
    button: "from-[#0284c7] via-[#0369a1] to-[#eab308] text-white shadow-[0_0_30px_rgba(56,189,248,0.4)]",
    badge: "bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40 font-bold",
    accent: "#38bdf8",
    isDark: true,
    isNinja: true,
    blob1: "bg-sky-500/25",
    blob2: "bg-amber-500/20",
  },
  Doraemon: {
    name: "Doraemon Pocket",
    type: "WHITE",
    bg: "bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]",
    cardBg: "bg-white/95 backdrop-blur-xl",
    cardBorder: "border-[#38bdf8]/60 shadow-[0_20px_60px_rgba(56,189,248,0.2)]",
    text: "text-[#0369a1]",
    sub: "text-[#0284c7]",
    input: "bg-[#f0f9ff] border-sky-300 text-[#0369a1] placeholder-sky-400 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20",
    button: "from-[#0284c7] via-[#38bdf8] to-[#2563eb] text-white shadow-[0_10px_30px_rgba(2,132,199,0.35)]",
    badge: "bg-sky-100 text-[#0284c7] border border-sky-300 font-bold",
    accent: "#0284c7",
    isDark: false,
    isDoraemon: true,
    blob1: "bg-sky-300/30",
    blob2: "bg-amber-300/30",
  },

  // ── 3 WHITE / LIGHT BACKGROUND THEMES ──
  Sakura: {
    name: "Sakura Blossom (White)",
    type: "WHITE",
    bg: "bg-gradient-to-br from-[#fff0f3] via-[#fff5f7] to-[#ffe6ec]",
    cardBg: "bg-white/95 backdrop-blur-xl",
    cardBorder: "border-rose-300/60 shadow-[0_20px_60px_rgba(244,63,94,0.12)]",
    text: "text-[#68182b]",
    sub: "text-[#9f495e]",
    input: "bg-[#fffafc] border-rose-200 text-[#4c111e] placeholder-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20",
    button: "from-rose-500 via-pink-500 to-red-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)]",
    badge: "bg-rose-100 text-rose-600 border border-rose-200 font-semibold",
    accent: "#f43f5e",
    isDark: false,
    blob1: "bg-rose-300/30",
    blob2: "bg-pink-300/30",
  },
  AppleWhite: {
    name: "Apple Studio White (White)",
    type: "WHITE",
    bg: "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
    cardBg: "bg-white backdrop-blur-2xl",
    cardBorder: "border-slate-200/80 shadow-[0_25px_70px_rgba(15,23,42,0.07)]",
    text: "text-slate-900",
    sub: "text-slate-500",
    input: "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20",
    button: "from-blue-600 to-indigo-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]",
    badge: "bg-blue-50 text-blue-600 border border-blue-200 font-semibold",
    accent: "#2563eb",
    isDark: false,
    blob1: "bg-blue-300/20",
    blob2: "bg-indigo-300/20",
  },
  EmeraldMint: {
    name: "Emerald Mint Paper (White)",
    type: "WHITE",
    bg: "bg-gradient-to-br from-[#f2f7f4] via-[#e6f2ed] to-[#d8ebd8]",
    cardBg: "bg-white/95 backdrop-blur-xl",
    cardBorder: "border-emerald-200/80 shadow-[0_20px_60px_rgba(16,185,129,0.08)]",
    text: "text-[#064e3b]",
    sub: "text-[#047857]",
    input: "bg-[#f8fcf9] border-emerald-200 text-[#064e3b] placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20",
    button: "from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold",
    accent: "#10b981",
    isDark: false,
    blob1: "bg-emerald-300/25",
    blob2: "bg-teal-300/25",
  },

  // ── 3 BLACK / DARK BACKGROUND THEMES ──
  Discord: {
    name: "Discord Dark (Black)",
    type: "BLACK",
    bg: "bg-[#313338]",
    cardBg: "bg-[#1e1f22]",
    cardBorder: "border-[#383a40] shadow-[0_25px_80px_rgba(0,0,0,0.7)]",
    text: "text-[#f2f3f5]",
    sub: "text-[#b5bac1]",
    input: "bg-[#383a40] border-[#4e5058] text-[#f2f3f5] placeholder-[#80848e] focus:border-[#5865f2] focus:ring-2 focus:ring-[#5865f2]/30",
    button: "from-[#5865f2] to-[#4752c4] text-white shadow-[0_6px_24px_rgba(88,101,242,0.4)]",
    badge: "bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/40 font-bold",
    accent: "#5865f2",
    isDark: true,
    isDiscord: true,
  },
  Aurora: {
    name: "Aurora Cyber (Black)",
    type: "BLACK",
    bg: "bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1e1b4b]",
    cardBg: "bg-slate-900/85 backdrop-blur-2xl",
    cardBorder: "border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.18)]",
    text: "text-white",
    sub: "text-slate-400",
    input: "bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20",
    button: "from-cyan-500 via-indigo-500 to-fuchsia-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold",
    accent: "#06b6d4",
    isDark: true,
    blob1: "bg-cyan-500/25",
    blob2: "bg-fuchsia-500/25",
  },
  Cyberpunk: {
    name: "Synthwave Cyber (Black)",
    type: "BLACK",
    bg: "bg-gradient-to-br from-[#0d0714] via-[#1a0b2e] to-[#2a0845]",
    cardBg: "bg-[#160826]/90 backdrop-blur-2xl",
    cardBorder: "border-[#ff007f]/40 shadow-[0_0_50px_rgba(255,0,127,0.3)]",
    text: "text-white",
    sub: "text-purple-200/70",
    input: "bg-[#0f041c] border-purple-800/70 text-pink-100 placeholder-purple-600 focus:border-[#ff007f] focus:ring-2 focus:ring-[#ff007f]/30",
    button: "from-[#ff007f] via-[#b500ff] to-[#00f0ff] text-white shadow-[0_0_35px_rgba(255,0,127,0.5)]",
    badge: "bg-pink-500/10 text-[#ff007f] border border-pink-500/40 font-semibold",
    accent: "#ff007f",
    isDark: true,
    blob1: "bg-[#ff007f]/25",
    blob2: "bg-[#00f0ff]/25",
  },
};

const defaultTheme: ThemeConfig = themes.Spiderman!;

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const router = useRouter();

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [honeypotTrap, setHoneypotTrap] = useState("");

  const { fields = [] } = useListFields(formId);
  const { form, isLoading: formLoading } = usePublicForm(formId);
  const { submitFormAsync, isPending } = useSubmitForm();

  const currentTheme: ThemeConfig = (() => {
    const themeName = form?.theme || "Spiderman";
    return themes[themeName] ?? defaultTheme;
  })();

  const getOptions = (options?: any): string[] => {
    try {
      if (Array.isArray(options)) return options;
      return options ? JSON.parse(options) : [];
    } catch {
      return [];
    }
  };

  const allFields = (fields as unknown as FormField[]) || [];

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalLogic || !field.conditionalLogic.targetFieldId) return true;
    const { targetFieldId, operator, value } = field.conditionalLogic;

    const targetField = allFields.find((f) => f.id === targetFieldId);
    if (!targetField) return true;

    const targetVal = responses[targetField.labelKey || targetField.id];
    if (targetVal === undefined || targetVal === null) return false;

    const strVal = String(targetVal).toLowerCase();
    const ruleVal = String(value).toLowerCase();

    switch (operator) {
      case "equals":
        return strVal === ruleVal;
      case "not_equals":
        return strVal !== ruleVal;
      case "contains":
        return strVal.includes(ruleVal);
      case "greater_than":
        return Number(targetVal) > Number(value);
      case "less_than":
        return Number(targetVal) < Number(value);
      default:
        return true;
    }
  };

  const visibleFields = allFields.filter(isFieldVisible);

  const completedFields = visibleFields.filter((f) => {
    const val = responses[f.labelKey || f.id];
    if (!val) return false;
    if (f.type === "CHECKBOX") {
      return (typeof val === "string" ? val.split(",").filter(Boolean) : val).length > 0;
    }
    return String(val).trim() !== "";
  }).length;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    for (const field of visibleFields) {
      const key = field.labelKey || field.id;
      const val = responses[key];
      const rules = field.validationRules || {};

      if (field.isRequired) {
        if (!val || (typeof val === "string" && !val.trim())) {
          errors[key] = `${field.label} is required`;
          continue;
        }
      }

      if (val && typeof val === "string") {
        if (rules.minLength && val.length < rules.minLength) {
          errors[key] = rules.customErrorMessage || `${field.label} must be at least ${rules.minLength} characters`;
        } else if (rules.maxLength && val.length > rules.maxLength) {
          errors[key] = rules.customErrorMessage || `${field.label} must be at most ${rules.maxLength} characters`;
        } else if (rules.pattern) {
          try {
            if (!new RegExp(rules.pattern).test(val)) {
              errors[key] = rules.customErrorMessage || `${field.label} format is invalid`;
            }
          } catch (e) {}
        }
      }

      if (val && field.type === "NUMBER") {
        const num = Number(val);
        if (isNaN(num)) {
          errors[key] = `${field.label} must be a valid number`;
        } else if (rules.minValue !== undefined && num < rules.minValue) {
          errors[key] = rules.customErrorMessage || `${field.label} must be at least ${rules.minValue}`;
        } else if (rules.maxValue !== undefined && num > rules.maxValue) {
          errors[key] = rules.customErrorMessage || `${field.label} must be at most ${rules.maxValue}`;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (honeypotTrap.trim() !== "") {
      alert("Spam submission blocked");
      return;
    }

    if (!validateForm()) return;

    try {
      await submitFormAsync({
        formId,
        responseData: responses,
        honeypotTrap,
      } as any);
      router.push("/thank-you");
    } catch (err: any) {
      alert(err?.message || "Submission Failed");
    }
  };

  if (formLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#090d16", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(6,182,212,0.2)", borderTop: "3px solid #06b6d4", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
        <p style={{ color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>Loading form…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#090d16", fontFamily: "'Plus Jakarta Sans',sans-serif", padding: 24, textAlign: "center" }}>
        <span style={{ fontSize: 52, marginBottom: 16 }}>⚡</span>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Form Not Found</h2>
        <p style={{ color: "#94a3b8", fontSize: 15 }}>This form doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (!form.isPublished) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#090d16", fontFamily: "'Plus Jakarta Sans',sans-serif", padding: 24, textAlign: "center" }}>
        <span style={{ fontSize: 56, marginBottom: 16 }}>🔒</span>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Form Unavailable</h2>
        <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 440, lineHeight: 1.6 }}>This form is currently unlisted or unpublished by its creator.</p>
      </div>
    );
  }

  const accent = currentTheme.accent;
  const progress = Math.round((completedFields / Math.max(visibleFields.length, 1)) * 100);

  return (
    <div className={`min-h-screen relative overflow-hidden px-4 py-16 md:py-24 ${currentTheme.bg}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatSlow { 0%,100%{ transform: translateY(0px) scale(1); } 50%{ transform: translateY(-20px) scale(1.05); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fieldIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

        .form-wrap { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .field-wrap { opacity:0; animation: fieldIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .fi {
          width:100%; height:62px;
          border-radius:18px;
          padding:0 22px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; transition:all 0.2s ease;
        }

        .fta {
          width:100%; min-height:120px;
          border-radius:18px;
          padding:18px 22px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; resize:vertical;
          transition:all 0.2s ease;
        }

        .opt-card {
          display:flex; align-items:center; gap:14px;
          padding:16px 20px; border-radius:16px;
          cursor:pointer; user-select:none;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:500;
          transition:all 0.2s ease;
        }
        .opt-card:hover { transform:translateX(4px); }

        .sub-btn {
          width:100%; height:66px;
          border-radius:20px; border:none;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:18px; font-weight:700;
          cursor:pointer; transition:all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sub-btn:hover:not(:disabled) { transform:translateY(-3px); filter:brightness(1.1); }
        .sub-btn:disabled { opacity:0.65; cursor:not-allowed; }
      `}</style>

      {/* Floating Ambient Light Blobs */}
      <div className={`absolute top-10 left-10 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none ${currentTheme.blob1 || "bg-cyan-500/20"}`} style={{ animation: "floatSlow 8s ease-in-out infinite" }} />
      <div className={`absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none ${currentTheme.blob2 || "bg-purple-500/20"}`} style={{ animation: "floatSlow 10s ease-in-out infinite continuous" }} />

      {/* Honeypot Hidden Input */}
      <input
        type="text"
        name="website_url_hp"
        value={honeypotTrap}
        onChange={(e) => setHoneypotTrap(e.target.value)}
        style={{ position: "absolute", opacity: 0, left: "-9999px", pointerEvents: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="max-w-2xl mx-auto relative z-10 form-wrap">
        <div className={`rounded-[38px] overflow-hidden p-8 md:p-12 border ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
          
          {/* Superhero / Cartoon Header Decorations */}
          {currentTheme.isSpiderman && (
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e63946]/40">
              <span className="text-xs font-black tracking-widest text-[#e63946] uppercase">🕷️ SPIDER-SUIT WEB ENGINE</span>
              <span className="text-sm">🕸️ 🕷️ 🔴</span>
            </div>
          )}

          {currentTheme.isSuperman && (
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#dc2626]/40">
              <span className="text-xs font-black tracking-widest text-[#eab308] uppercase">🦸‍♂️ SUPERMAN METROPOLIS SHIELD</span>
              <span className="text-sm">⚡ 🛡️ 🔴</span>
            </div>
          )}

          {currentTheme.isNinja && (
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#38bdf8]/40">
              <span className="text-xs font-black tracking-widest text-[#38bdf8] uppercase">🥷 IGA NINJA SHADOW ENGINE</span>
              <span className="text-sm">⭐ 🥷 🗡️</span>
            </div>
          )}

          {currentTheme.isDoraemon && (
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#38bdf8]/40">
              <span className="text-xs font-black tracking-widest text-[#0284c7] uppercase">🐱 DORAEMON GADGET POCKET</span>
              <span className="text-sm">🔔 🐱 🚀</span>
            </div>
          )}

          {currentTheme.isDiscord && (
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#383a40]">
              <span className="w-3 h-3 rounded-full bg-[#5865f2]" />
              <span className="text-xs font-bold text-[#f2f3f5] tracking-wide"># formverse-general</span>
              <span className="ml-auto text-xs text-[#80848e]">Discord Dark Engine</span>
            </div>
          )}

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.badge}`}>
              {currentTheme.isSpiderman ? "🕷️ " : currentTheme.isSuperman ? "🦸‍♂️ " : currentTheme.isNinja ? "🥷 " : currentTheme.isDoraemon ? "🐱 " : currentTheme.isDiscord ? "🎮 " : currentTheme.type === "WHITE" ? "☀️ " : "🌙 "}
              {currentTheme.name}
            </div>
            <div style={{ padding: "6px 14px", borderRadius: 50, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, opacity: 0.8 }} className={currentTheme.sub}>
              {completedFields} / {visibleFields.length} Completed
            </div>
          </div>

          <h1 className={`${currentTheme.text}`} style={{ fontFamily: currentTheme.isVSCode ? "'Fira Code', monospace" : "'Playfair Display', serif", fontSize: "clamp(36px,5vw,54px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 14 }}>
            {form.title}
          </h1>

          {form.description && (
            <p className={`${currentTheme.sub}`} style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 400, marginBottom: 34, fontFamily: currentTheme.isVSCode ? "'Fira Code', monospace" : "'Plus Jakarta Sans',sans-serif" }}>
              {form.description}
            </p>
          )}

          {/* Progress bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
              <span className={currentTheme.sub}>Form Progress</span>
              <span className={currentTheme.text}>{progress}%</span>
            </div>
            <div style={{ height: 8, background: currentTheme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", borderRadius: 50, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: 50, transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {visibleFields.map((field, index) => {
              const opts = getOptions(field.options);
              const key = field.labelKey || field.id;
              const error = fieldErrors[key];

              return (
                <div key={field.id} className="field-wrap" style={{ animationDelay: `${index * 0.07}s` }}>
                  <label className={`block mb-2 font-bold text-[16px] ${currentTheme.text}`} style={{ fontFamily: currentTheme.isVSCode ? "'Fira Code', monospace" : "'Plus Jakarta Sans',sans-serif" }}>
                    {field.label}
                    {field.isRequired && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
                  </label>

                  {field.description && (
                    <p className={currentTheme.sub} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, marginBottom: 12 }}>{field.description}</p>
                  )}

                  {field.type === "TEXTAREA" ? (
                    <textarea
                      className={`fta ${currentTheme.input}`}
                      placeholder={field.placeholder || `Enter ${field.label}…`}
                      value={responses[key] || ""}
                      onChange={(e) => {
                        setResponses((p) => ({ ...p, [key]: e.target.value }));
                        if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                      }}
                    />
                  ) : field.type === "SELECT" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {opts.map((opt: string) => {
                        const isSel = responses[key] === opt;
                        return (
                          <div
                            key={opt}
                            className={`opt-card ${currentTheme.input} ${isSel ? "border-2" : ""}`}
                            style={{ borderColor: isSel ? accent : undefined, boxShadow: isSel ? `0 0 20px ${accent}30` : "none" }}
                            onClick={() => {
                              setResponses((p) => ({ ...p, [key]: opt }));
                              if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                            }}
                          >
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isSel ? accent : "currentColor"}`, opacity: isSel ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isSel && <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />}
                            </div>
                            <span className={currentTheme.text}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : field.type === "CHECKBOX" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {opts.map((opt: string) => {
                        const raw = responses[key];
                        const vals: string[] = Array.isArray(raw) ? raw : raw ? raw.split(",").filter(Boolean) : [];
                        const isChk = vals.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`opt-card ${currentTheme.input} ${isChk ? "border-2" : ""}`}
                            style={{ borderColor: isChk ? accent : undefined, boxShadow: isChk ? `0 0 20px ${accent}30` : "none" }}
                            onClick={() => {
                              const next = isChk ? vals.filter((v) => v !== opt) : [...vals, opt];
                              setResponses((p) => ({ ...p, [key]: next.join(",") }));
                              if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                            }}
                          >
                            <div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${isChk ? accent : "currentColor"}`, background: isChk ? accent : "transparent", opacity: isChk ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800 }}>
                              {isChk && "✓"}
                            </div>
                            <span className={currentTheme.text}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      type={field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : "text"}
                      className={`fi ${currentTheme.input}`}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      value={responses[key] || ""}
                      onChange={(e) => {
                        setResponses((p) => ({ ...p, [key]: e.target.value }));
                        if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                      }}
                    />
                  )}

                  {error && (
                    <p style={{ color: "#ef4444", fontSize: 13.5, marginTop: 8, fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                      ⚠️ {error}
                    </p>
                  )}
                </div>
              );
            })}

            <button disabled={isPending} onClick={handleSubmit} className={`sub-btn bg-gradient-to-r ${currentTheme.button}`} style={{ marginTop: 16 }}>
              {isPending ? "Submitting Response…" : "Submit Response →"}
            </button>
          </div>

          <div style={{ marginTop: 36, paddingTop: 24, borderTop: currentTheme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)", textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, opacity: 0.6 }} className={currentTheme.sub}>
            Powered by <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: accent }}>FormVerse</span>
          </div>
        </div>
      </div>
    </div>
  );
}