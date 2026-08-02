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

const themes = {
  Aurora: {
    text: "text-[#4b3428]",
    sub: "text-[#6f625b]",
    input: "bg-[#fffdfa] border-[#eadfd5]",
    button: "from-[#d58a52] to-[#e6a772]",
    badge: "bg-[#fde8e5] text-[#d58a52]",
    accent: "#d58a52",
  },
  Sakura: {
    text: "text-[#6b3948]",
    sub: "text-[#7f6870]",
    input: "bg-[#fffafb] border-pink-100",
    button: "from-pink-400 to-rose-400",
    badge: "bg-pink-100 text-pink-500",
    accent: "#ec4899",
  },
  Kyoto: {
    text: "text-[#5b3c2f]",
    sub: "text-[#7f6d63]",
    input: "bg-[#fffdfb] border-[#ead8c8]",
    button: "from-[#c97845] to-[#e2a16e]",
    badge: "bg-[#f4e5d8] text-[#c97845]",
    accent: "#c97845",
  },
  Zen: {
    text: "text-[#41593c]",
    sub: "text-[#677460]",
    input: "bg-[#fafdf8] border-[#d8e6d1]",
    button: "from-[#88a66f] to-[#a7c38e]",
    badge: "bg-[#edf5e7] text-[#6b8e58]",
    accent: "#7a9e65",
  },
};

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

  const currentTheme = (() => {
    const theme = form?.theme?.toLowerCase() || "";
    if (theme.includes("sakura")) return themes.Sakura;
    if (theme.includes("kyoto")) return themes.Kyoto;
    if (theme.includes("zen")) return themes.Zen;
    return themes.Aurora;
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

  // Evaluate field visibility based on conditional logic
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
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff9f6,#fefcfb,#eef5ea)", fontFamily: "'DM Sans',sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #f0ebe5", borderTop: "3px solid #d58a52", animation: "spin 0.8s linear infinite", marginBottom: 14 }} />
        <p style={{ color: "#aaa", fontSize: 15 }}>Loading form…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff9f6,#fefcfb,#eef5ea)", fontFamily: "'DM Sans',sans-serif" }}>
        <span style={{ fontSize: 48, marginBottom: 12 }}>🌸</span>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, color: "#4b3428", marginBottom: 8 }}>Form Not Found</h2>
        <p style={{ color: "#aaa", fontSize: 15 }}>This form doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (!form.isPublished) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff9f6,#fefcfb,#eef5ea)", fontFamily: "'DM Sans',sans-serif", padding: 24, textAlign: "center" }}>
        <span style={{ fontSize: 54, marginBottom: 16 }}>🔒</span>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 700, color: "#4b3428", marginBottom: 12 }}>Form Unavailable</h2>
        <p style={{ color: "#888", fontSize: 16, maxWidth: 440, lineHeight: 1.6 }}>This form is currently unlisted or unpublished by its creator.</p>
      </div>
    );
  }

  const accent = currentTheme.accent;
  const progress = Math.round((completedFields / Math.max(visibleFields.length, 1)) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-20 bg-gradient-to-br from-[#fff9f6] via-[#fefcfb] to-[#eef5ea]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fieldIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }

        .form-wrap { animation: fadeUp 0.6s ease forwards; }
        .field-wrap { opacity:0; animation: fieldIn 0.4s ease forwards; }

        .fi {
          width:100%; height:60px;
          border-radius:16px; border:1.5px solid;
          padding:0 20px;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; transition:border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          color:#1a1a1a;
        }
        .fi:focus { transform:translateY(-1px); }

        .fta {
          width:100%; min-height:110px;
          border-radius:16px; border:1.5px solid;
          padding:16px 20px;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; resize:vertical;
          transition:border-color 0.2s, box-shadow 0.2s;
          color:#1a1a1a;
        }

        .opt-card {
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; border-radius:14px;
          border:1.5px solid #ede8e3; background:#faf8f5;
          cursor:pointer; user-select:none;
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
          color:#333; transition:all 0.15s;
        }
        .opt-card:hover { transform:translateX(3px); box-shadow:0 3px 12px rgba(0,0,0,0.06); }
        .opt-card.sel { background:#fff8f4; }

        .sub-btn {
          width:100%; height:64px;
          border-radius:18px; border:none;
          color:#fff; font-family:'DM Sans',sans-serif;
          font-size:17px; font-weight:700;
          cursor:pointer; transition:all 0.2s;
        }
        .sub-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 36px rgba(0,0,0,0.18); }
        .sub-btn:disabled { opacity:0.7; cursor:not-allowed; }
      `}</style>

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
        <div className="bg-white/95 backdrop-blur-xl rounded-[38px] border border-[#efe5db] p-8 md:p-12" style={{ boxShadow: "0 25px 70px rgba(0,0,0,0.07)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${currentTheme.badge}`}>
              ✨ FormVerse
            </div>
            <div style={{ background: "#f5f5f5", padding: "6px 14px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#888" }}>
              {completedFields} / {visibleFields.length}
            </div>
          </div>

          <h1 className={currentTheme.text} style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,54px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 12 }}>
            {form.title}
          </h1>

          {form.description && (
            <p className={currentTheme.sub} style={{ fontSize: 17, lineHeight: 1.75, fontWeight: 500, marginBottom: 32, fontFamily: "'DM Sans',sans-serif" }}>
              {form.description}
            </p>
          )}

          {/* Progress bar */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 8 }}>
              <span className={currentTheme.sub}>Progress</span>
              <span className={currentTheme.text} style={{ fontWeight: 600 }}>{progress}%</span>
            </div>
            <div style={{ height: 7, background: "#f0ebe5", borderRadius: 50, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: 50, transition: "width 0.5s ease" }} />
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {visibleFields.map((field, index) => {
              const opts = getOptions(field.options);
              const key = field.labelKey || field.id;
              const error = fieldErrors[key];

              return (
                <div key={field.id} className="field-wrap" style={{ animationDelay: `${index * 0.07}s` }}>
                  <label className={`block mb-2 font-semibold text-[16px] ${currentTheme.text}`}>
                    {field.label}
                    {field.isRequired && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
                  </label>

                  {field.description && (
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#888", marginBottom: 10 }}>{field.description}</p>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {opts.map((opt: string) => {
                        const isSel = responses[key] === opt;
                        return (
                          <div
                            key={opt}
                            className={`opt-card${isSel ? " sel" : ""}`}
                            style={{ borderColor: isSel ? accent : "#ede8e3", boxShadow: isSel ? `0 0 0 3px ${accent}18` : "none" }}
                            onClick={() => {
                              setResponses((p) => ({ ...p, [key]: opt }));
                              if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                            }}
                          >
                            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isSel ? accent : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isSel && <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />}
                            </div>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  ) : field.type === "CHECKBOX" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {opts.map((opt: string) => {
                        const raw = responses[key];
                        const vals: string[] = Array.isArray(raw) ? raw : raw ? raw.split(",").filter(Boolean) : [];
                        const isChk = vals.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`opt-card${isChk ? " sel" : ""}`}
                            style={{ borderColor: isChk ? accent : "#ede8e3", boxShadow: isChk ? `0 0 0 3px ${accent}18` : "none" }}
                            onClick={() => {
                              const next = isChk ? vals.filter((v) => v !== opt) : [...vals, opt];
                              setResponses((p) => ({ ...p, [key]: next.join(",") }));
                              if (fieldErrors[key]) setFieldErrors((p) => ({ ...p, [key]: "" }));
                            }}
                          >
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isChk ? accent : "#ccc"}`, background: isChk ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                              {isChk && "✓"}
                            </div>
                            {opt}
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
                    <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6, fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>
                      ⚠️ {error}
                    </p>
                  )}
                </div>
              );
            })}

            <button disabled={isPending} onClick={handleSubmit} className={`sub-btn bg-gradient-to-r ${currentTheme.button}`} style={{ marginTop: 12 }}>
              {isPending ? "Submitting Response…" : "Submit Response →"}
            </button>
          </div>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f0ebe5", textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#ccc" }}>
            Powered by <span style={{ fontFamily: "Georgia,serif", fontSize: 14, color: accent }}>FormVerse</span>
          </div>
        </div>
      </div>
    </div>
  );
}