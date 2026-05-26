"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useListFields } from "~/hooks/api/form-field";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { useGetForm } from "~/hooks/api/form";

/* ─── TYPES — untouched ─── */
type FormField = {
  id: string;
  label: string;
  labelKey: string;
  placeholder?: string;
  type: string;
  options?: string;
  isRequired: boolean;
};

/* ─── THEMES — untouched ─── */
const themes = {
  Aurora: {
    text:   "text-[#4b3428]",
    sub:    "text-[#6f625b]",
    input:  "bg-[#fffdfa] border-[#eadfd5]",
    button: "from-[#d58a52] to-[#e6a772]",
    badge:  "bg-[#fde8e5] text-[#d58a52]",
    accent: "#d58a52",
  },
  Sakura: {
    text:   "text-[#6b3948]",
    sub:    "text-[#7f6870]",
    input:  "bg-[#fffafb] border-pink-100",
    button: "from-pink-400 to-rose-400",
    badge:  "bg-pink-100 text-pink-500",
    accent: "#ec4899",
  },
  Kyoto: {
    text:   "text-[#5b3c2f]",
    sub:    "text-[#7f6d63]",
    input:  "bg-[#fffdfb] border-[#ead8c8]",
    button: "from-[#c97845] to-[#e2a16e]",
    badge:  "bg-[#f4e5d8] text-[#c97845]",
    accent: "#c97845",
  },
  Zen: {
    text:   "text-[#41593c]",
    sub:    "text-[#677460]",
    input:  "bg-[#fafdf8] border-[#d8e6d1]",
    button: "from-[#88a66f] to-[#a7c38e]",
    badge:  "bg-[#edf5e7] text-[#6b8e58]",
    accent: "#7a9e65",
  },
};

/* ─── COMPONENT ─── */
export default function PublicFormPage() {
  const params  = useParams();
  const formId  = params.id as string;
  const router  = useRouter();

  const [responses, setResponses] = useState<Record<string, any>>({});

  /* ── ALL ORIGINAL HOOKS — untouched ── */
  const { fields = [] }                  = useListFields(formId);
  const { form, isLoading: formLoading } = useGetForm(formId);
  const { submitFormAsync, isPending }   = useSubmitForm();

  /* ── ALL ORIGINAL FUNCTIONS — untouched ── */
  const currentTheme = (() => {
    const theme = form?.theme?.toLowerCase() || "";
    if (theme.includes("sakura")) return themes.Sakura;
    if (theme.includes("kyoto"))  return themes.Kyoto;
    if (theme.includes("zen"))    return themes.Zen;
    return themes.Aurora;
  })();

  const getOptions = (options?: string): string[] => {
    try { return options ? JSON.parse(options) : []; }
    catch { return []; }
  };

  // FIX: properly count checkbox (comma-separated) and other fields
  const completedFields = (fields as FormField[]).filter(f => {
    const val = responses[f.labelKey];
    if (!val) return false;
    if (f.type === "CHECKBOX") return val.split(",").filter(Boolean).length > 0;
    return val !== "";
  }).length;

  const validate = () => {
    for (const field of fields as FormField[]) {
      const value = responses[field.labelKey];
      if (field.isRequired && (!value || value === "")) {
        alert(`${field.label} required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await submitFormAsync({ formId, responseData: responses });
      router.push("/thank-you");
    } catch {
      alert("Submission Failed");
    }
  };

  /* ── LOADING / 404 ── */
  if (formLoading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fff9f6,#fefcfb,#eef5ea)", fontFamily:"'DM Sans',sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #f0ebe5", borderTop:"3px solid #d58a52", animation:"spin 0.8s linear infinite", marginBottom:14 }}/>
        <p style={{ color:"#aaa", fontSize:15 }}>Loading form…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fff9f6,#fefcfb,#eef5ea)", fontFamily:"'DM Sans',sans-serif" }}>
        <span style={{ fontSize:48, marginBottom:12 }}>🌸</span>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:700, color:"#4b3428", marginBottom:8 }}>Form Not Found</h2>
        <p style={{ color:"#aaa", fontSize:15 }}>This form doesn't exist or has been removed.</p>
      </div>
    );
  }

  const accent  = currentTheme.accent;
  const progress = Math.round((completedFields / Math.max(fields.length, 1)) * 100);

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-20 bg-gradient-to-br from-[#fff9f6] via-[#fefcfb] to-[#eef5ea]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fieldIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes progFill { from { width: 0%; } }

        .form-wrap { animation: fadeUp 0.6s ease forwards; }

        /* field-level animation */
        .field-wrap { opacity:0; animation: fieldIn 0.4s ease forwards; }

        /* text inputs */
        .fi {
          width:100%; height:60px;
          border-radius:16px; border:1.5px solid;
          padding:0 20px;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; transition:border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          color:#1a1a1a;
        }
        .fi:focus { transform:translateY(-1px); }
        .fi::placeholder { color:#ccc; font-weight:400; }

        /* textarea */
        .fta {
          width:100%; min-height:110px;
          border-radius:16px; border:1.5px solid;
          padding:16px 20px;
          font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500;
          outline:none; resize:vertical;
          transition:border-color 0.2s, box-shadow 0.2s;
          color:#1a1a1a;
        }
        .fta::placeholder { color:#ccc; font-weight:400; }

        /* option cards (SELECT + CHECKBOX) */
        .opt-card {
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; border-radius:14px;
          border:1.5px solid #ede8e3; background:#faf8f5;
          cursor:pointer; user-select:none;
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
          color:#333;
          transition:border-color 0.15s, background 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .opt-card:hover { transform:translateX(3px); box-shadow:0 3px 12px rgba(0,0,0,0.06); }
        .opt-card.sel { background:#fff8f4; }

        /* submit */
        .sub-btn {
          width:100%; height:64px;
          border-radius:18px; border:none;
          color:#fff; font-family:'DM Sans',sans-serif;
          font-size:17px; font-weight:700;
          cursor:pointer; letter-spacing:0.2px;
          transition:transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          position:relative; overflow:hidden;
        }
        .sub-btn:not(:disabled):hover {
          transform:translateY(-2px);
          box-shadow:0 12px 36px rgba(0,0,0,0.18);
        }
        .sub-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .sub-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(rgba(255,255,255,0.1),transparent); }

        /* spinner in button */
        @keyframes btnSpin { to { transform:rotate(360deg); } }
        .btn-spin { width:20px; height:20px; border-radius:50%; border:2.5px solid rgba(255,255,255,0.35); border-top:2.5px solid #fff; animation:btnSpin 0.8s linear infinite; display:inline-block; }

        /* progress bar */
        @keyframes progFill { from { width:0%; } }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-pink-100/30 rounded-full blur-[120px]" style={{ animation:"none" }}/>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-green-100/30 rounded-full blur-[120px]"/>

      {/* Sakura branch decoration */}
      <svg style={{ position:"fixed", top:0, left:0, pointerEvents:"none", opacity:0.07, zIndex:0 }} width="240" height="180" viewBox="0 0 240 180">
        <path d="M6,0 Q55,52 112,68 Q168,84 218,55" stroke="#c8a4a4" strokeWidth="2.5" fill="none"/>
        {[[115,75],[132,70],[122,88]].map(([cx,cy],i)=>(
          <g key={i} transform={`translate(${cx},${cy})`}>
            {[0,72,144,216,288].map(deg=>(
              <ellipse key={deg} cx={Math.cos(deg*Math.PI/180)*5} cy={Math.sin(deg*Math.PI/180)*5} rx="4.5" ry="2.5" transform={`rotate(${deg})`} fill={i%2===0?"#f4a7b9":"#fadadd"} opacity="0.8"/>
            ))}
          </g>
        ))}
      </svg>

      {/* ── Main card ── */}
      <div className="max-w-2xl mx-auto relative z-10 form-wrap">
        <div
          className="bg-white/95 backdrop-blur-xl rounded-[38px] border border-[#efe5db] p-8 md:p-12"
          style={{ boxShadow:"0 25px 70px rgba(0,0,0,0.07)" }}
        >

          {/* Header: badge + counter */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${currentTheme.badge}`}
              style={{ fontFamily:"'DM Sans',sans-serif" }}>
              ✨ FormVerse
            </div>
            <div style={{
              background:"#f5f5f5", padding:"6px 14px", borderRadius:50,
              fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#888",
            }}>
              {completedFields} / {fields.length}
            </div>
          </div>

          {/* Title */}
          <h1 className={currentTheme.text} style={{ fontFamily:"Georgia,serif", fontSize:"clamp(36px,5vw,54px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1px", marginBottom:12 }}>
            {form.title}
          </h1>

          {/* Description */}
          {form.description && (
            <p className={`${currentTheme.sub}`} style={{ fontSize:17, lineHeight:1.75, fontWeight:500, marginBottom:32, fontFamily:"'DM Sans',sans-serif" }}>
              {form.description}
            </p>
          )}

          {/* Progress bar */}
          <div style={{ marginBottom:36 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'DM Sans',sans-serif", fontSize:13, marginBottom:8 }}>
              <span className={currentTheme.sub}>Progress</span>
              <span className={currentTheme.text} style={{ fontWeight:600 }}>{progress}%</span>
            </div>
            <div style={{ height:7, background:"#f0ebe5", borderRadius:50, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`,
                background:`linear-gradient(90deg, ${accent}, ${accent}cc)`,
                borderRadius:50,
                transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",
                animation:"progFill 0.8s ease forwards",
              }}/>
            </div>
          </div>

          {/* ── Fields ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            {(fields as FormField[]).map((field, index) => {
              const opts    = getOptions(field.options);
              const pholder = (field as any).placeholder;

              return (
                <div key={field.id} className="field-wrap" style={{ animationDelay:`${index*0.07}s` }}>

                  {/* Label */}
                  <label className={`block mb-3 font-semibold text-[16px] ${currentTheme.text}`}
                    style={{ fontFamily:"'DM Sans',sans-serif" }}>
                    {field.label}
                    {field.isRequired && <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>}
                  </label>

                  {/* ── TEXTAREA ── */}
                  {field.type === "TEXTAREA" ? (
                    <textarea
                      className={`fta ${currentTheme.input}`}
                      placeholder={pholder || `Enter ${field.label}…`}
                      value={responses[field.labelKey] || ""}
                      onChange={e => setResponses(p => ({ ...p, [field.labelKey]: e.target.value }))}
                      onFocus={e  => { e.target.style.borderColor=accent; e.target.style.boxShadow=`0 0 0 4px ${accent}18`; }}
                      onBlur={e   => { e.target.style.borderColor=""; e.target.style.boxShadow="none"; }}
                    />

                  /* ── SELECT — radio cards, pick ONE ── */
                  ) : field.type === "SELECT" ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {pholder && (
                        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#bbb", margin:"0 0 4px" }}>{pholder}</p>
                      )}
                      {opts.map((opt:string) => {
                        const isSel = responses[field.labelKey] === opt;
                        return (
                          <div
                            key={opt}
                            className={`opt-card${isSel?" sel":""}`}
                            style={{ borderColor: isSel ? accent : "#ede8e3", boxShadow: isSel ? `0 0 0 3px ${accent}18` : "none" }}
                            onClick={() => setResponses(p => ({ ...p, [field.labelKey]: opt }))}
                          >
                            {/* Radio dot */}
                            <div style={{
                              width:20, height:20, borderRadius:"50%", flexShrink:0,
                              border:`2px solid ${isSel ? accent : "#ccc"}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"border-color 0.15s",
                            }}>
                              {isSel && <div style={{ width:10, height:10, borderRadius:"50%", background:accent }}/>}
                            </div>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                  /* ── CHECKBOX — square cards, pick MULTIPLE ── */
                  ) : field.type === "CHECKBOX" ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {pholder && (
                        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#bbb", margin:"0 0 4px" }}>{pholder}</p>
                      )}
                      {opts.map((opt:string) => {
                        const vals:string[] = responses[field.labelKey]
                          ? responses[field.labelKey].split(",").filter(Boolean)
                          : [];
                        const isChk = vals.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`opt-card${isChk?" sel":""}`}
                            style={{ borderColor: isChk ? accent : "#ede8e3", boxShadow: isChk ? `0 0 0 3px ${accent}18` : "none" }}
                            onClick={() => {
                              const next = isChk
                                ? vals.filter(v => v !== opt)
                                : [...vals, opt];
                              setResponses(p => ({ ...p, [field.labelKey]: next.join(",") }));
                            }}
                          >
                            {/* Square checkbox */}
                            <div style={{
                              width:20, height:20, borderRadius:6, flexShrink:0,
                              border:`2px solid ${isChk ? accent : "#ccc"}`,
                              background: isChk ? accent : "transparent",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"all 0.15s",
                              color:"#fff", fontSize:12, fontWeight:700,
                            }}>
                              {isChk && "✓"}
                            </div>
                            {opt}
                          </div>
                        );
                      })}
                      {/* Selected count */}
                      {responses[field.labelKey] && responses[field.labelKey].split(",").filter(Boolean).length > 0 && (
                        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:accent, margin:"2px 0 0", fontWeight:600 }}>
                          {responses[field.labelKey].split(",").filter(Boolean).length} selected
                        </p>
                      )}
                    </div>

                  /* ── TEXT / EMAIL / NUMBER ── */
                  ) : (
                    <input
                      type={field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : "text"}
                      className={`fi ${currentTheme.input}`}
                      placeholder={pholder || `Enter ${field.label}`}
                      value={responses[field.labelKey] || ""}
                      onChange={e => setResponses(p => ({ ...p, [field.labelKey]: e.target.value }))}
                      onFocus={e  => { e.target.style.borderColor=accent; e.target.style.boxShadow=`0 0 0 4px ${accent}18`; }}
                      onBlur={e   => { e.target.style.borderColor=""; e.target.style.boxShadow="none"; }}
                    />
                  )}
                </div>
              );
            })}

            {/* Submit button */}
            <button
              disabled={isPending}
              onClick={handleSubmit}
              className={`sub-btn bg-gradient-to-r ${currentTheme.button}`}
              style={{ marginTop:8 }}
            >
              {isPending ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <span className="btn-spin"/> Submitting…
                </span>
              ) : "Submit Response →"}
            </button>
          </div>

          {/* Footer brand */}
          <div style={{ marginTop:28, paddingTop:20, borderTop:"1px solid #f0ebe5", textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#ccc" }}>
            Powered by <span style={{ fontFamily:"Georgia,serif", fontSize:14, color:accent }}>FormVerse</span>
          </div>
        </div>
      </div>
    </div>
  );
}