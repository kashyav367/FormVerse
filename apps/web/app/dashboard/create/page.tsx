"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sparkles, ArrowLeft, House, Check, WandSparkles, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useCreateForm } from "~/hooks/api/form";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type CreateFormValues = {
  title: string;
  description: string;
};

type ThemeKey = keyof typeof THEMES;
type Visibility = "PUBLIC" | "UNLISTED";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TEMPLATES = [
  { name: "Feedback", icon: "📋", title: "Customer Feedback Form",  description: "Help us improve our service"   },
  { name: "Survey",   icon: "📊", title: "Survey Form",             description: "Quick survey questions"         },
  { name: "Event",    icon: "🎉", title: "Event Registration",      description: "Register for our event"         },
  { name: "Job",      icon: "💼", title: "Job Application",         description: "Apply for a position"           },
];

const THEMES = {
  sakura: {
    name: "Sakura Blossom",
    subtitle: "Japanese minimal",
    page: "#f7f2ec",
    card: "#fffaf7",
    preview: "#fff0f1",
    buttonFrom: "#d25543",
    buttonTo: "#ff8a7a",
    accent: "#d25543",
    bar: "#d25543",
  },
  kyoto: {
    name: "Kyoto Night",
    subtitle: "Japanese minimal",
    page: "#f4efe8",
    card: "#fffdfa",
    preview: "#f4e6d8",
    buttonFrom: "#8b3a2e",
    buttonTo: "#d25543",
    accent: "#8b3a2e",
    bar: "#8b3a2e",
  },
  zen: {
    name: "Zen Garden",
    subtitle: "Japanese minimal",
    page: "#f4f3ed",
    card: "#ffffff",
    preview: "#edf2eb",
    buttonFrom: "#7a8f68",
    buttonTo: "#a5b68d",
    accent: "#7a8f68",
    bar: "#7a8f68",
  },
} as const;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function CreateFormPage() {
  const router = useRouter();

  const [selectedTheme,    setSelectedTheme]    = useState<ThemeKey>("sakura");
  const [selectedTemplate, setSelectedTemplate] = useState("Feedback");
  const [visibility,       setVisibility]       = useState<Visibility>("UNLISTED");

  const { createFormAsync, isPending } = useCreateForm();

  // Separate state for live preview — guaranteed instant re-render on every keystroke
  const [previewTitle, setPreviewTitle]       = useState("Customer Feedback Form");
  const [previewDesc,  setPreviewDesc]        = useState("Help us improve our service");

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<CreateFormValues>({
      defaultValues: {
        title:       "Customer Feedback Form",
        description: "Help us improve our service",
      },
    });

  const theme = THEMES[selectedTheme];

  /* ── handlers ── */
  const handleTemplateClick = (tpl: (typeof TEMPLATES)[number]) => {
    setSelectedTemplate(tpl.name);
    // Update react-hook-form values (for submit)
    setValue("title",       tpl.title,       { shouldValidate: true });
    setValue("description", tpl.description, { shouldValidate: true });
    // Update preview state immediately
    setPreviewTitle(tpl.title);
    setPreviewDesc(tpl.description);
  };

  const onSubmit = async (values: CreateFormValues) => {
    try {
      const response = await createFormAsync({
        title:       values.title,
        description: values.description,
        theme:       selectedTheme,
        template:    selectedTemplate,
        visibility,
      });
      router.push(`/dashboard/builder/${response.id}`);
    } catch (err) {
      console.error("Create form error:", err);
    }
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div
      style={{ minHeight: "100vh", background: theme.page, position: "relative", overflowX: "hidden" }}
    >
      {/* ── Subtle background decoration ── */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", opacity: 0.07 }}
        width="340" height="280" viewBox="0 0 340 280"
      >
        <path d="M10,0 Q70,70 140,90 Q210,110 280,70 Q320,50 338,28"
          stroke="#c0392b" strokeWidth="2.5" fill="none"/>
        {[[145,98],[170,95],[158,112]].map(([cx,cy],i) => (
          <g key={i} transform={`translate(${cx},${cy})`}>
            {[0,72,144,216,288].map((deg,j) => (
              <ellipse key={j}
                cx={Math.cos((deg*Math.PI)/180)*6} cy={Math.sin((deg*Math.PI)/180)*6}
                rx="5" ry="3" transform={`rotate(${deg})`} fill="#f4a7b9"/>
            ))}
          </g>
        ))}
      </svg>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── Top nav ── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 48 }}>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full bg-white gap-2 shadow-sm hover:shadow-md transition-shadow">
              <ArrowLeft size={15} /> Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full bg-white gap-2 shadow-sm hover:shadow-md transition-shadow">
              <House size={15} /> Home
            </Button>
          </Link>
        </div>

        {/* ── Main grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 80,
            alignItems: "start",
          }}
          className="lg:grid-cols-[1fr_420px] grid-cols-1"
        >

          {/* ══ LEFT PANEL ══ */}
          <div style={{ paddingTop: 16 }}>

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", borderRadius: 50,
              padding: "10px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              marginBottom: 28,
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <Sparkles size={14} style={{ color: theme.accent }}/>
              FormVerse Creator
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(52px, 6vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 16,
              fontWeight: 400,
            }}>
              Create<br />
              <span style={{ color: theme.accent }}>beautiful forms</span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#888", fontSize: 16, marginBottom: 40, lineHeight: 1.6,
            }}>
              Build gorgeous forms in seconds using<br />
              templates and Japanese-inspired themes.
            </p>

            {/* Theme picker */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 15, marginBottom: 14,
              }}>
                <WandSparkles size={16} style={{ color: theme.accent }}/>
                Choose Style
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, val]) => {
                  const active = selectedTheme === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTheme(key)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        display: "block",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: active ? `2px solid ${val.accent}` : "2px solid #ece4dc",
                        boxShadow: active ? `0 4px 20px ${val.accent}30` : "none",
                        transform: active ? "scale(1.02)" : "scale(1)",
                        transition: "all 0.2s ease",
                        maxWidth: 340,
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        {/* colour bar */}
                        <div style={{ width: 10, background: val.bar, flexShrink: 0 }}/>
                        {/* content */}
                        <div style={{
                          background: "#fff",
                          padding: "14px 18px",
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                          <div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, marginBottom: 2 }}>
                              {val.name}
                            </p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>
                              {val.subtitle}
                            </p>
                          </div>
                          {active && <Check size={16} style={{ color: val.accent }} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <Card style={{
            borderRadius: 40, border: "none",
            boxShadow: "0 24px 80px rgba(0,0,0,0.10)",
            background: theme.card,
            position: "sticky",
            top: 24,
          }}>
            <CardContent style={{ padding: 28 }}>

              <h2 style={{
                textAlign: "center",
                fontFamily: "'Instrument Serif', serif",
                fontSize: 34, fontWeight: 400,
                marginBottom: 22,
              }}>
                Create Form
              </h2>

              {/* Title input */}
              <div style={{ marginBottom: 12 }}>
                <Input
                  placeholder="Form title *"
                  {...register("title", { required: "Title is required" })}
                  onChange={(e) => {
                    // Keep react-hook-form in sync
                    setValue("title", e.target.value, { shouldValidate: true });
                    // Update live preview instantly
                    setPreviewTitle(e.target.value);
                  }}
                  style={{
                    borderColor: errors.title ? "#e74c3c" : undefined,
                    borderRadius: 14, padding: "12px 16px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                {errors.title && (
                  <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description input */}
              <div style={{ marginBottom: 20 }}>
                <Input
                  placeholder="Description (optional)"
                  {...register("description")}
                  onChange={(e) => {
                    setValue("description", e.target.value);
                    // Update live preview instantly
                    setPreviewDesc(e.target.value);
                  }}
                  style={{
                    borderRadius: 14, padding: "12px 16px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>

              {/* Templates */}
              <div style={{ marginBottom: 20 }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 14, marginBottom: 10,
                }}>
                  Templates
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {TEMPLATES.map((tpl) => {
                    const active = selectedTemplate === tpl.name;
                    return (
                      <button
                        key={tpl.name}
                        type="button"
                        onClick={() => handleTemplateClick(tpl)}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "12px 14px",
                          borderRadius: 14,
                          border: active ? `1.5px solid ${theme.accent}` : "1.5px solid transparent",
                          background: active ? theme.preview : "#faf8f5",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.15s",
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        <span style={{ fontSize: 17 }}>{tpl.icon}</span>
                        {tpl.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility */}
              <div style={{ marginBottom: 20 }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 14, marginBottom: 10,
                }}>
                  🌍 Visibility
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {(["PUBLIC", "UNLISTED"] as Visibility[]).map((v) => {
                    const active = visibility === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisibility(v)}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "12px 14px",
                          borderRadius: 14,
                          border: active ? `1.5px solid ${theme.accent}` : "1.5px solid transparent",
                          background: active ? theme.preview : "#faf8f5",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5,
                          textAlign: "center",
                          fontWeight: active ? 500 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        {v === "PUBLIC" ? "🌍 Public" : "🔒 Unlisted"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live preview */}
              <div style={{
                borderRadius: 22,
                padding: 18,
                background: theme.preview,
                marginBottom: 20,
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 13,
                  marginBottom: 10, color: "#666",
                }}>
                  Live Preview
                </p>
                <div style={{ fontSize: 30, marginBottom: 6 }}>📝</div>
                <h3 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 20, fontWeight: 400,
                  marginBottom: 4,
                  color: "#1a1a1a",
                  wordBreak: "break-word",
                }}>
                  {previewTitle || "Untitled Form"}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#888", fontSize: 13, lineHeight: 1.5,
                  marginBottom: 12,
                  wordBreak: "break-word",
                }}>
                  {previewDesc || "No description yet"}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[selectedTemplate, visibility].map((tag) => (
                    <span key={tag} style={{
                      background: "#fff",
                      padding: "4px 12px",
                      borderRadius: 50,
                      fontSize: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#555",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${theme.buttonFrom}, ${theme.buttonTo})`,
                  color: "#fff",
                  border: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isPending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: `0 6px 24px ${theme.buttonFrom}40`,
                  transition: "opacity 0.2s, transform 0.15s",
                  opacity: isPending ? 0.75 : 1,
                }}
                onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {isPending ? (
                  <><Loader2 size={17} className="animate-spin" /> Creating...</>
                ) : (
                  "Create Form →"
                )}
              </Button>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
