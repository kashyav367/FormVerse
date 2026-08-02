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
};

const themes: Record<string, ThemeConfig> = {
  Aurora: {
    bg: "bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1e1b4b]",
    cardBg: "bg-slate-900/85 backdrop-blur-2xl",
    cardBorder: "border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.18)]",
    text: "text-white",
    sub: "text-slate-400",
    input: "bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20",
    button: "from-cyan-500 via-indigo-500 to-fuchsia-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    accent: "#06b6d4",
    isDark: true,
    blob1: "bg-cyan-500/25",
    blob2: "bg-fuchsia-500/25",
  },
  Sakura: {
    bg: "bg-gradient-to-br from-[#fff0f3] via-[#fff5f7] to-[#ffe6ec]",
    cardBg: "bg-white/95 backdrop-blur-xl",
    cardBorder: "border-rose-300/60 shadow-[0_20px_60px_rgba(244,63,94,0.12)]",
    text: "text-[#68182b]",
    sub: "text-[#9f495e]",
    input: "bg-[#fffafc] border-rose-200 text-[#4c111e] placeholder-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20",
    button: "from-rose-500 via-pink-500 to-red-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)]",
    badge: "bg-rose-100 text-rose-600 border border-rose-200",
    accent: "#f43f5e",
    blob1: "bg-rose-300/30",
    blob2: "bg-pink-300/30",
  },
  Kyoto: {
    bg: "bg-gradient-to-br from-[#1c120c] via-[#2a1a12] to-[#120a06]",
    cardBg: "bg-[#241710]/90 backdrop-blur-2xl",
    cardBorder: "border-amber-600/35 shadow-[0_0_50px_rgba(217,119,6,0.18)]",
    text: "text-amber-50",
    sub: "text-amber-200/70",
    input: "bg-[#180f0a] border-amber-900/70 text-amber-100 placeholder-amber-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
    button: "from-amber-500 via-orange-500 to-rose-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    accent: "#f59e0b",
    isDark: true,
    blob1: "bg-amber-500/20",
    blob2: "bg-orange-500/20",
  },
  Zen: {
    bg: "bg-gradient-to-br from-[#061e14] via-[#0b2d1f] to-[#04140d]",
    cardBg: "bg-[#0c3222]/90 backdrop-blur-2xl",
    cardBorder: "border-emerald-500/35 shadow-[0_0_50px_rgba(16,185,129,0.18)]",
    text: "text-emerald-50",
    sub: "text-emerald-200/70",
    input: "bg-[#061a11] border-emerald-800/70 text-emerald-100 placeholder-emerald-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20",
    button: "from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    accent: "#10b981",
    isDark: true,
    blob1: "bg-emerald-500/20",
    blob2: "bg-teal-500/20",
  },
  Cyberpunk: {
    bg: "bg-gradient-to-br from-[#0d0714] via-[#1a0b2e] to-[#2a0845]",
    cardBg: "bg-[#160826]/90 backdrop-blur-2xl",
    cardBorder: "border-[#ff007f]/40 shadow-[0_0_50px_rgba(255,0,127,0.3)]",
    text: "text-white",
    sub: "text-purple-200/70",
    input: "bg-[#0f041c] border-purple-800/70 text-pink-100 placeholder-purple-600 focus:border-[#ff007f] focus:ring-2 focus:ring-[#ff007f]/30",
    button: "from-[#ff007f] via-[#b500ff] to-[#00f0ff] text-white shadow-[0_0_35px_rgba(255,0,127,0.5)]",
    badge: "bg-pink-500/10 text-[#ff007f] border border-pink-500/40",
    accent: "#ff007f",
    isDark: true,
    blob1: "bg-[#ff007f]/25",
    blob2: "bg-[#00f0ff]/25",
  },
  Obsidian: {
    bg: "bg-[#050505]",
    cardBg: "bg-[#111111]/95 backdrop-blur-2xl",
    cardBorder: "border-[#262626] shadow-[0_20px_70px_rgba(0,0,0,0.95)]",
    text: "text-white",
    sub: "text-zinc-400",
    input: "bg-[#18181b] border-[#27272a] text-white placeholder-zinc-600 focus:border-zinc-300 focus:ring-2 focus:ring-white/10",
    button: "from-zinc-100 via-white to-zinc-300 text-black shadow-[0_0_30px_rgba(255,255,255,0.25)]",
    badge: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    accent: "#ffffff",
    isDark: true,
    blob1: "bg-zinc-700/15",
    blob2: "bg-zinc-600/15",
  },
};

const defaultTheme: ThemeConfig = themes.Aurora!;

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
    const themeName = form?.theme || "Aurora";
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
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
        <div className={`rounded-[38px] p-8 md:p-12 border ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.badge}`}>
              ⚡ FormVerse Premium
            </div>
            <div style={{ padding: "6px 14px", borderRadius: 50, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, opacity: 0.8 }} className={currentTheme.sub}>
              {completedFields} / {visibleFields.length} Completed
            </div>
          </div>

          <h1 className={`${currentTheme.text}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 14 }}>
            {form.title}
          </h1>

          {form.description && (
            <p className={`${currentTheme.sub}`} style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 400, marginBottom: 34, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
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
                  <label className={`block mb-2 font-bold text-[16px] ${currentTheme.text}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
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