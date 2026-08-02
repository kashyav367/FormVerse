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

type CreateFormValues = {
  title: string;
  description: string;
};

type ThemeKey = keyof typeof THEMES;
type Visibility = "PUBLIC" | "UNLISTED";

const TEMPLATES = [
  { name: "Feedback", icon: "📋", title: "Customer Feedback Form", description: "Help us improve our service" },
  { name: "Survey", icon: "📊", title: "Survey Form", description: "Quick survey questions" },
  { name: "Event", icon: "🎉", title: "Event Registration", description: "Register for our event" },
  { name: "Job", icon: "💼", title: "Job Application", description: "Apply for a position" },
];

const THEMES = {
  Aurora: {
    name: "Aurora Cyber",
    subtitle: "Dark Neon Glass",
    page: "#0b0f19",
    card: "#111827",
    preview: "#1e293b",
    buttonFrom: "#06b6d4",
    buttonTo: "#8b5cf6",
    accent: "#06b6d4",
    bar: "#06b6d4",
    isDark: true,
  },
  VSCode: {
    name: "VS Code Dark",
    subtitle: "IDE Syntax Theme",
    page: "#181818",
    card: "#1e1e1e",
    preview: "#252526",
    buttonFrom: "#007acc",
    buttonTo: "#005a9e",
    accent: "#007acc",
    bar: "#007acc",
    isDark: true,
  },
  MacOS: {
    name: "macOS Glass",
    subtitle: "Apple Sonoma Dark",
    page: "#0f172a",
    card: "#1e1b4b",
    preview: "#31103f",
    buttonFrom: "#3b82f6",
    buttonTo: "#4f46e5",
    accent: "#3b82f6",
    bar: "#3b82f6",
    isDark: true,
  },
  Windows11: {
    name: "Windows 11 Mica",
    subtitle: "Fluent Acrylic",
    page: "#0f172a",
    card: "#111c38",
    preview: "#1e293b",
    buttonFrom: "#0078d4",
    buttonTo: "#106ebe",
    accent: "#0078d4",
    bar: "#0078d4",
    isDark: true,
  },
  Anime: {
    name: "Anime Cyber Kawaii",
    subtitle: "Tokyo Sparkle Cyber",
    page: "#130022",
    card: "#1a0033",
    preview: "#240046",
    buttonFrom: "#ff00a0",
    buttonTo: "#7b2cbf",
    accent: "#ff00a0",
    bar: "#ff00a0",
    isDark: true,
  },
  Sakura: {
    name: "Sakura Blossom",
    subtitle: "Japanese Minimal",
    page: "#fff0f3",
    card: "#ffffff",
    preview: "#fff0f1",
    buttonFrom: "#f43f5e",
    buttonTo: "#ec4899",
    accent: "#f43f5e",
    bar: "#f43f5e",
    isDark: false,
  },
  Kyoto: {
    name: "Kyoto Sunset",
    subtitle: "Warm Obsidian",
    page: "#1c120c",
    card: "#241710",
    preview: "#2a1a12",
    buttonFrom: "#f59e0b",
    buttonTo: "#d97706",
    accent: "#f59e0b",
    bar: "#f59e0b",
    isDark: true,
  },
  Zen: {
    name: "Emerald Zen",
    subtitle: "Forest Glass",
    page: "#061e14",
    card: "#0c3222",
    preview: "#0b2d1f",
    buttonFrom: "#10b981",
    buttonTo: "#06b6d4",
    accent: "#10b981",
    bar: "#10b981",
    isDark: true,
  },
  Cyberpunk: {
    name: "Synthwave Cyber",
    subtitle: "Neon Vaporwave",
    page: "#0d0714",
    card: "#160826",
    preview: "#1a0b2e",
    buttonFrom: "#ff007f",
    buttonTo: "#b500ff",
    accent: "#ff007f",
    bar: "#ff007f",
    isDark: true,
  },
  Obsidian: {
    name: "Obsidian Black",
    subtitle: "Ultra OLED Minimal",
    page: "#050505",
    card: "#111111",
    preview: "#18181b",
    buttonFrom: "#ffffff",
    buttonTo: "#e4e4e7",
    accent: "#ffffff",
    bar: "#ffffff",
    isDark: true,
  },
} as const;

export default function CreateFormPage() {
  const router = useRouter();

  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("Aurora");
  const [selectedTemplate, setSelectedTemplate] = useState("Feedback");
  const [visibility, setVisibility] = useState<Visibility>("UNLISTED");

  const { createFormAsync, isPending } = useCreateForm();

  const [previewTitle, setPreviewTitle] = useState("Customer Feedback Form");
  const [previewDesc, setPreviewDesc] = useState("Help us improve our service");

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<CreateFormValues>({
      defaultValues: {
        title: "Customer Feedback Form",
        description: "Help us improve our service",
      },
    });

  const theme = THEMES[selectedTheme];

  const handleTemplateClick = (tpl: (typeof TEMPLATES)[number]) => {
    setSelectedTemplate(tpl.name);
    setValue("title", tpl.title, { shouldValidate: true });
    setValue("description", tpl.description, { shouldValidate: true });
    setPreviewTitle(tpl.title);
    setPreviewDesc(tpl.description);
  };

  const onSubmit = async (values: CreateFormValues) => {
    try {
      const response = await createFormAsync({
        title: values.title,
        description: values.description,
        theme: selectedTheme,
        template: selectedTemplate,
        visibility,
      });
      router.push(`/dashboard/builder/${response.id}`);
    } catch (err) {
      console.error("Create form error:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.page, position: "relative", overflowX: "hidden", color: theme.isDark ? "#fff" : "#1a1a1a", transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
        {/* Top nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 48 }}>
          <Link href="/dashboard">
            <Button variant="outline" className={`rounded-full gap-2 shadow-sm ${theme.isDark ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800" : "bg-white"}`}>
              <ArrowLeft size={15} /> Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className={`rounded-full gap-2 shadow-sm ${theme.isDark ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800" : "bg-white"}`}>
              <House size={15} /> Home
            </Button>
          </Link>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 60, alignItems: "start" }} className="lg:grid-cols-[1fr_440px] grid-cols-1">
          {/* Left Panel */}
          <div style={{ paddingTop: 16 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: theme.isDark ? "rgba(255,255,255,0.08)" : "#fff",
              borderRadius: 50, padding: "10px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              marginBottom: 28, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            }}>
              <Sparkles size={14} style={{ color: theme.accent }} />
              FormVerse Theme Engine
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(52px, 6vw, 80px)",
              lineHeight: 1.05, letterSpacing: -2,
              marginBottom: 16, fontWeight: 400,
            }}>
              Create<br />
              <span style={{ color: theme.accent }}>stunning forms</span>
            </h1>

            <p style={{ fontFamily: "'DM Sans', sans-serif", color: theme.isDark ? "#94a3b8" : "#888", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
              Select an ultra-cool theme (VS Code, macOS, Windows 11, Anime, etc.) & template to transform your public forms.
            </p>

            {/* Theme picker */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 14 }}>
                <WandSparkles size={16} style={{ color: theme.accent }} />
                Choose Ultra Theme (10 Presets)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                        border: active ? `2px solid ${val.accent}` : val.isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid #ece4dc",
                        boxShadow: active ? `0 4px 20px ${val.accent}40` : "none",
                        transform: active ? "scale(1.02)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ width: 8, background: val.bar, flexShrink: 0 }} />
                        <div style={{ background: val.isDark ? "#1e293b" : "#fff", padding: "14px", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 2, color: val.isDark ? "#fff" : "#1a1a1a" }}>
                              {val.name}
                            </p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: val.isDark ? "#94a3b8" : "#aaa" }}>
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

          {/* Right Panel */}
          <Card style={{
            borderRadius: 36, border: valBorder(theme.isDark),
            boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
            background: theme.card,
            color: theme.isDark ? "#fff" : "#1a1a1a",
            position: "sticky", top: 24,
          }}>
            <CardContent style={{ padding: 28 }}>
              <h2 style={{ textAlign: "center", fontFamily: "'Instrument Serif', serif", fontSize: 34, fontWeight: 400, marginBottom: 22 }}>
                Create Form
              </h2>

              <div style={{ marginBottom: 12 }}>
                <Input
                  placeholder="Form title *"
                  {...register("title", { required: "Title is required" })}
                  onChange={(e) => {
                    setValue("title", e.target.value, { shouldValidate: true });
                    setPreviewTitle(e.target.value);
                  }}
                  className={theme.isDark ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : ""}
                  style={{ borderRadius: 14, padding: "12px 16px", fontFamily: "'DM Sans', sans-serif" }}
                />
                {errors.title && (
                  <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <Input
                  placeholder="Description (optional)"
                  {...register("description")}
                  onChange={(e) => {
                    setValue("description", e.target.value);
                    setPreviewDesc(e.target.value);
                  }}
                  className={theme.isDark ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : ""}
                  style={{ borderRadius: 14, padding: "12px 16px", fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
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
                          background: active ? theme.preview : theme.isDark ? "rgba(255,255,255,0.05)" : "#faf8f5",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.15s",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        <span style={{ fontSize: 17 }}>{tpl.icon}</span>
                        {tpl.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
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
                          background: active ? theme.preview : theme.isDark ? "rgba(255,255,255,0.05)" : "#faf8f5",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5,
                          textAlign: "center",
                          fontWeight: active ? 600 : 400,
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
              <div style={{ borderRadius: 22, padding: 18, background: theme.preview, marginBottom: 20, border: `1px solid ${theme.accent}30` }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 10, color: theme.accent }}>
                  Live Theme Preview ({theme.name})
                </p>
                <div style={{ fontSize: 30, marginBottom: 6 }}>📝</div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, marginBottom: 4, wordBreak: "break-word" }}>
                  {previewTitle || "Untitled Form"}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginBottom: 12, opacity: 0.8, wordBreak: "break-word" }}>
                  {previewDesc || "No description yet"}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[selectedTemplate, visibility, theme.name].map((tag) => (
                    <span key={tag} style={{ background: theme.isDark ? "rgba(0,0,0,0.4)" : "#fff", padding: "4px 12px", borderRadius: 50, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
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
                  height: 52,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${theme.buttonFrom}, ${theme.buttonTo})`,
                  color: selectedTheme === "Obsidian" ? "#000" : "#fff",
                  border: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: isPending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: `0 6px 28px ${theme.accent}50`,
                  transition: "opacity 0.2s, transform 0.15s",
                  opacity: isPending ? 0.75 : 1,
                }}
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

function valBorder(isDark?: boolean) {
  return isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #efe5db";
}
