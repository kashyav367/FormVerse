"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, Flame, Sparkles, Globe, FileText, ArrowLeft, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { usePublicForms } from "~/hooks/api/form";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORIES = ["All", "Survey", "Feedback", "Registration", "Gaming", "Events"];

const THEME_LABELS: Record<string, string> = {
  "Sakura Blossom": "🌸 Sakura",
  "Kyoto Night":    "🌙 Kyoto",
  "Zen Garden":     "🍃 Zen",
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function ExplorePage() {
  const [search,           setSearch]           = useState("");
  const [debouncedSearch,  setDebouncedSearch]  = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ── ALL ORIGINAL HOOKS — UNTOUCHED ── */
  const { forms = [], isLoading } = usePublicForms();

  /* ── Debounce search (300ms) — fix for perf ── */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ── ALL ORIGINAL FILTER LOGIC — UNTOUCHED ── */
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        form.description?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        form.description?.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [forms, debouncedSearch, selectedCategory]);

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f7f2ec 0%, #fff7f3 50%, #fde8e5 100%)", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes blobDrift {
          0%,100% { transform: scale(1) translate(0,0); }
          50%      { transform: scale(1.1) translate(20px,-15px); }
        }

        .page-header { animation: fadeUp 0.6s ease forwards; }

        .search-wrap { animation: fadeUp 0.6s ease 0.1s both; }

        .cat-btn {
          padding: 9px 20px;
          border-radius: 50px;
          border: 1.5px solid #e8e3dd;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
          color: #444;
        }
        .cat-btn:hover {
          border-color: #d25543;
          color: #d25543;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(210,85,67,0.12);
        }
        .cat-btn.active {
          background: #d25543;
          border-color: #d25543;
          color: #fff;
          box-shadow: 0 4px 16px rgba(210,85,67,0.25);
        }

        .form-card {
          background: #fff;
          border-radius: 28px;
          border: 1.5px solid #f0ebe5;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          animation: cardIn 0.4s ease both;
          position: relative;
          overflow: hidden;
        }
        .form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d25543, #ff8a7a);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.10);
          border-color: #e8d8d0;
        }
        .form-card:hover::before { opacity: 1; }

        .open-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          border-radius: 50px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: auto;
        }
        .open-btn:hover {
          background: #d25543;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(210,85,67,0.28);
        }

        .skeleton {
          background: linear-gradient(90deg, #f0ebe5 25%, #faf6f2 50%, #f0ebe5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .float-anim { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ── Background blobs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,182,193,0.18)", filter: "blur(100px)", animation: "blobDrift 9s ease-in-out infinite" }}/>
        <div style={{ position: "absolute", bottom: -120, right: -80, width: 450, height: 450, borderRadius: "50%", background: "rgba(144,238,144,0.12)", filter: "blur(100px)", animation: "blobDrift 11s ease-in-out infinite reverse" }}/>
        {/* Sakura branch */}
        <svg style={{ position: "absolute", top: 0, left: 0, opacity: 0.07 }} width="280" height="200" viewBox="0 0 280 200">
          <path d="M8,0 Q60,60 130,75 Q200,90 265,58" stroke="#c0392b" strokeWidth="2" fill="none"/>
          {[[133,83],[152,77],[142,96]].map(([cx,cy],i) => (
            <g key={i} transform={`translate(${cx},${cy})`}>
              {[0,72,144,216,288].map((deg,j) => (
                <ellipse key={j} cx={Math.cos(deg*Math.PI/180)*5} cy={Math.sin(deg*Math.PI/180)*5} rx="4" ry="2.5" transform={`rotate(${deg})`} fill="#f4a7b9"/>
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>

        {/* ══════════ HEADER ══════════ */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#fde8e5", color: "#d25543",
              borderRadius: 50, padding: "8px 18px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              marginBottom: 18,
              boxShadow: "0 2px 10px rgba(210,85,67,0.15)",
            }}>
              <Sparkles size={14}/> FormVerse Explore
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(42px, 6vw, 64px)",
              fontWeight: 400, lineHeight: 1.05,
              letterSpacing: -1.5, color: "#1a1a1a", margin: "0 0 12px",
            }}>
              Discover Forms
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, color: "#888", margin: 0,
            }}>
              Explore community templates and public forms
            </p>
          </div>

          {/* Back button */}
          <Link href="/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 50,
            border: "1.5px solid #e8e3dd", background: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            color: "#333", textDecoration: "none",
            transition: "all 0.18s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d25543"; (e.currentTarget as HTMLElement).style.color = "#d25543"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e3dd"; (e.currentTarget as HTMLElement).style.color = "#333"; }}
          >
            <ArrowLeft size={14}/> Dashboard
          </Link>
        </div>

        {/* ══════════ SEARCH ══════════ */}
        <div className="search-wrap" style={{ position: "relative", marginBottom: 24 }}>
          <Search size={18} style={{
            position: "absolute", left: 20, top: "50%",
            transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none",
          }}/>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search forms by name or description…"
            style={{
              width: "100%", height: 56,
              paddingLeft: 52, paddingRight: search ? 48 : 20,
              borderRadius: 50, border: "1.5px solid #e8e3dd",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              outline: "none", color: "#1a1a1a",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = "#d25543"; e.target.style.boxShadow = "0 0 0 3px rgba(210,85,67,0.10), 0 4px 20px rgba(0,0,0,0.06)"; }}
            onBlur={e  => { e.target.style.borderColor = "#e8e3dd"; e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
          />
          {/* Clear button — FIX: was missing in original */}
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                background: "#f0ebe5", border: "none", borderRadius: "50%",
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#888",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#e8e3dd"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#f0ebe5"}
            >
              <X size={14}/>
            </button>
          )}
        </div>

        {/* ══════════ CATEGORY FILTERS ══════════ */}
        {/* FIX: was using <div> instead of <button> — accessibility + click semantics */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-btn${selectedCategory === cat ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ══════════ TRENDING HEADER ══════════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flame size={20} style={{ color: "#f97316" }}/>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 26, fontWeight: 400, color: "#1a1a1a", margin: 0,
            }}>
              Trending Forms
            </h2>
          </div>

          {/* Live count */}
          {!isLoading && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999",
              background: "#f5f5f5", borderRadius: 50, padding: "4px 14px",
            }}>
              {filteredForms.length} form{filteredForms.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ══════════ LOADING SKELETONS ══════════ */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 28, padding: 24,
                border: "1.5px solid #f0ebe5",
                animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
              }}>
                <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: 16 }}/>
                <div className="skeleton" style={{ height: 32, width: "85%", marginBottom: 10 }}/>
                <div className="skeleton" style={{ height: 16, width: "100%", marginBottom: 6 }}/>
                <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 24 }}/>
                <div className="skeleton" style={{ height: 44, borderRadius: 50 }}/>
              </div>
            ))}
          </div>

        /* ══════════ EMPTY STATE ══════════ */
        ) : filteredForms.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 28, padding: "80px 32px",
            textAlign: "center", border: "1.5px dashed #e8e3dd",
          }}>
            <div className="float-anim" style={{ fontSize: 52, marginBottom: 16 }}>
              {search ? "🔍" : "📋"}
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 26, fontWeight: 400, color: "#1a1a1a", marginBottom: 8,
            }}>
              {search ? `No results for "${search}"` : "No forms found"}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#999", marginBottom: 20 }}>
              {search ? "Try a different search term or clear filters." : "Be the first to publish a form!"}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                style={{
                  padding: "10px 24px", borderRadius: 50,
                  background: "#d25543", color: "#fff", border: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear search
              </button>
            )}
          </div>

        /* ══════════ FORM CARDS GRID ══════════ */
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {filteredForms.map((form, index) => (
              <div
                key={form.id}
                className="form-card"
                style={{ animationDelay: `${Math.min(index * 0.06, 0.4)}s` }}
              >
                {/* Top badges row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{
                    background: "#f0fdf4", color: "#15803d",
                    borderRadius: 50, padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Globe size={11}/> PUBLIC
                  </span>

                  {/* FIX: trending badge now based on top 3 by position, not hardcoded index < 2 */}
                  {index < 3 && (
                    <span style={{
                      background: "#fff7ed", color: "#f97316",
                      borderRadius: 50, padding: "4px 12px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    }}>
                      🔥 Trending
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 26, fontWeight: 400, lineHeight: 1.2,
                  color: "#1a1a1a", margin: "0 0 10px",
                  wordBreak: "break-word",
                }}>
                  {form.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, color: "#888", lineHeight: 1.6,
                  margin: "0 0 18px", minHeight: 48,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {form.description || "No description available"}
                </p>

                {/* Tags row — FIX: removed double-nested div wrapper bug */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  <span style={{
                    background: "#fde8e5", color: "#d25543",
                    borderRadius: 50, padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                  }}>
                    {THEME_LABELS[form.theme ?? ""] ?? "✨ Aurora"}
                  </span>
                  <span style={{
                    background: "#f7f2ec", color: "#666",
                    borderRadius: 50, padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  }}>
                    🌍 Community
                  </span>
                  <span style={{
                    background: "#f7f2ec", color: "#666",
                    borderRadius: 50, padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  }}>
                    📊 Public
                  </span>
                </div>

                {/* CTA */}
                <Link href={`/form/${form.id}`} className="open-btn">
                  <Globe size={14}/> Open Form
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 60 }}/>
      </div>
    </div>
  );
}