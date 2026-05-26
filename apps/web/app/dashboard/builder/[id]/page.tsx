"use client";

import Link from "next/link";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import {
  Trash2, Copy, Eye, CheckCircle, Plus, LayoutGrid, AlignLeft,
  Hash, Mail, List, CheckSquare, Circle, QrCode, Send, EyeOff,
  Globe, Lock, GripVertical, Settings2,
} from "lucide-react";
import { useState } from "react";

import { useCreateField, useListFields, useDeleteField } from "~/hooks/api/form-field";
import { useUpdateForm, useGetForm } from "~/hooks/api/form";

/* ─────────────────────────────────────────────
   TYPES  — untouched
───────────────────────────────────────────── */
type FieldType = "TEXT" | "EMAIL" | "NUMBER" | "TEXTAREA" | "SELECT" | "CHECKBOX";

type Field = {

id:string;

label:string;

description?:string;

type:FieldType;

options?:string|null;

isRequired:boolean;

allowMultiple?:boolean;

};

/* ─────────────────────────────────────────────
   FIELD CONFIG
───────────────────────────────────────────── */
const FIELD_BUTTONS: {
  type: FieldType; label: string; defaultLabel: string;
  icon: React.ReactNode; color: string; bg: string;
}[] = [
  { type: "TEXT",     label: "Text",     defaultLabel: "Name",        icon: <AlignLeft   size={14}/>, color: "#4a9eed", bg: "#eef6ff" },
  { type: "EMAIL",    label: "Email",    defaultLabel: "Email",       icon: <Mail        size={14}/>, color: "#d25543", bg: "#fde8e5" },
  { type: "NUMBER",   label: "Number",   defaultLabel: "Phone",       icon: <Hash        size={14}/>, color: "#f59e0b", bg: "#fef9ee" },
  { type: "TEXTAREA", label: "TextArea", defaultLabel: "Description", icon: <LayoutGrid  size={14}/>, color: "#8b5cf6", bg: "#f3eeff" },
  { type: "SELECT",   label: "Select",   defaultLabel: "Country",     icon: <List        size={14}/>, color: "#22c55e", bg: "#f0fdf4" },
  { type: "CHECKBOX", label: "Checkbox", defaultLabel: "Skills",      icon: <CheckSquare size={14}/>, color: "#f97316", bg: "#fff7ed" },
 
];

const FIELD_COLOR: Record<FieldType, string> = {
  TEXT: "#4a9eed", EMAIL: "#d25543", NUMBER: "#f59e0b",
  TEXTAREA: "#8b5cf6", SELECT: "#22c55e", CHECKBOX: "#f97316"
};
const FIELD_BG: Record<FieldType, string> = {
  TEXT: "#eef6ff", EMAIL: "#fde8e5", NUMBER: "#fef9ee",
  TEXTAREA: "#f3eeff", SELECT: "#f0fdf4", CHECKBOX: "#fff7ed"
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function BuilderPage() {
  const params = useParams();
  const formId = params.id as string;

  const [copied,  setCopied]  = useState(false);
  const [showQR,  setShowQR]  = useState(false);
  // FIX: track which action is pending for granular loading states
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  /* ── ALL ORIGINAL HOOKS — UNTOUCHED (removed unused updateFieldAsync) ── */
  const { createFieldAsync }             = useCreateField();
  const { deleteFieldAsync }             = useDeleteField();
  const { updateFormAsync, isPending }   = useUpdateForm();
  const { form, isLoading: formLoading } = useGetForm(formId);
  const { fields = [], isLoading }       = useListFields(formId);

  /* ── ALL ORIGINAL FUNCTIONS — UNTOUCHED ── */
  const addField = async (type: FieldType, label: string) => {
    try {
      await createFieldAsync({
        formId, label, type, isRequired: false,
        options:
          type === "SELECT" || type === "CHECKBOX" 
            ? JSON.stringify(["Option 1", "Option 2"])
            : undefined,
      });
    } catch (error) { console.log(error); }
  };

  const handleDelete = async (fieldId: string) => {
    const confirmed = confirm("Delete this field?");
    if (!confirmed) return;
    try {
      await deleteFieldAsync({ fieldId });
    } catch (error) { console.log(error); }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) { console.log(error); }
  };

  const getOptions = (options?: string | null) => {
    try { return options ? JSON.parse(options) : []; }
    catch { return []; }
  };

  // FIX: wrapper so each action button shows its own loading state
  const handleFormUpdate = async (payload: Record<string, any>, actionKey: string) => {
    setPendingAction(actionKey);
    try { await updateFormAsync({ formId, ...payload }); }
    finally { setPendingAction(null); }
  };

  /* ── LOADING STATE ── */
  if (formLoading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f7f2ec",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          border: "3px solid #f0ebe5", borderTop: "3px solid #d25543",
          animation: "spin 0.8s linear infinite",
        }}/>
        <p style={{ color: "#888", fontSize: 15 }}>Loading your form…</p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "#f7f2ec", position: "relative", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

        /* ── Action buttons ── */
        .ab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 50px;
          border: 1.5px solid #e8e3dd; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; white-space: nowrap; text-decoration: none; color: #333;
          transition: all 0.18s ease; flex-shrink: 0;
        }
        .ab:hover          { border-color:#d25543; color:#d25543; transform:translateY(-1px); box-shadow:0 4px 14px rgba(210,85,67,0.12); }
        .ab.on             { background:#d25543; border-color:#d25543; color:#fff; }
        .ab.on:hover       { background:#bf4938; color:#fff; }
        .ab.green          { background:#f0fdf4; border-color:#22c55e; color:#15803d; }
        .ab.green:hover    { background:#22c55e; color:#fff; border-color:#22c55e; }
        .ab.dark           { background:#1a1a1a; border-color:#1a1a1a; color:#fff; }
        .ab.dark:hover     { background:#d25543; border-color:#d25543; }
        .ab:disabled       { opacity:0.55; cursor:not-allowed; transform:none !important; }

        /* ── Field type buttons ── */
        .fb {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 50px;
          border: 1.5px solid transparent; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          transition: all 0.18s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .fb:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.10); }

        /* ── Field cards ── */
        .fc {
          background: #fff; border-radius: 20px;
          border: 1.5px solid #f0ebe5;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          padding: 20px 22px;
          transition: all 0.2s ease;
          animation: slideIn 0.3s ease both;
        }
        .fc:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); border-color:#e0d8d0; }

        /* ── Delete btn ── */
        .del {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 50px;
          border: 1.5px solid #fee2e2; background: #fff5f5; color: #ef4444;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; flex-shrink: 0;
        }
        .del:hover { background:#ef4444; color:#fff; border-color:#ef4444; transform:translateY(-1px); }

        /* ── Type badge ── */
        .tb {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.3px;
        }

        .float-anim { animation: float 3s ease-in-out infinite; }

        /* ── Skeleton ── */
        .sk {
          background: linear-gradient(90deg, #f0ebe5 25%, #faf6f2 50%, #f0ebe5 75%);
          background-size: 200% 100%; border-radius: 10px;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* ── Decorative sakura ── */}
      <svg style={{ position:"absolute", top:0, left:0, pointerEvents:"none", opacity:0.06 }}
        width="280" height="210" viewBox="0 0 280 210">
        <path d="M6,0 Q58,58 125,76 Q192,95 252,62" stroke="#c0392b" strokeWidth="2" fill="none"/>
        {[[128,84],[147,78],[137,97]].map(([cx,cy],i)=>(
          <g key={i} transform={`translate(${cx},${cy})`}>
            {[0,72,144,216,288].map((deg,j)=>(
              <ellipse key={j} cx={Math.cos(deg*Math.PI/180)*5} cy={Math.sin(deg*Math.PI/180)*5} rx="4.5" ry="2.5" transform={`rotate(${deg})`} fill="#f4a7b9"/>
            ))}
          </g>
        ))}
      </svg>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>

        {/* ══════════ TOP HEADER CARD ══════════ */}
        <div style={{
          background: "#fff", borderRadius: 28,
          border: "1.5px solid #f0ebe5",
          boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
          padding: "26px 28px", marginBottom: 20,
        }}>

          {/* Row 1: brand left + actions right */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom: showQR ? 24 : 0 }}>

            {/* ── Left ── */}
            <div>
              <Link href="/dashboard" style={{
                display:"inline-flex", alignItems:"center", gap:5,
                fontFamily:"'DM Sans', sans-serif", fontSize:12.5,
                color:"#aaa", textDecoration:"none", marginBottom:12,
                transition:"color 0.2s",
              }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="#d25543"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="#aaa"}
              >
                ← Dashboard
              </Link>

              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{
                  width:44, height:44, background:"#1a1a1a", borderRadius:12,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:20,
                }}>⛩</div>
                <div>
                  <h1 style={{
                    fontFamily:"'Instrument Serif', serif",
                    fontSize:26, fontWeight:400, color:"#1a1a1a",
                    lineHeight:1.1, margin:"0 0 5px",
                  }}>
                    Form Builder
                  </h1>
                  {/* Status pills */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{
                      fontFamily:"'DM Sans', sans-serif", fontSize:12.5, color:"#999",
                    }}>
                      {fields.length} field{fields.length !== 1 ? "s" : ""}
                    </span>
                    {form?.isPublished && (
                      <span style={{
                        display:"inline-flex", alignItems:"center", gap:4,
                        background:"#f0fdf4", color:"#15803d", borderRadius:50,
                        padding:"2px 10px", fontFamily:"'DM Sans', sans-serif",
                        fontSize:11.5, fontWeight:600,
                      }}>
                        <CheckCircle size={11}/> Published
                      </span>
                    )}
                    {form?.visibility && (
                      <span style={{
                        display:"inline-flex", alignItems:"center", gap:4,
                        background:"#f5f5f5", color:"#666", borderRadius:50,
                        padding:"2px 10px", fontFamily:"'DM Sans', sans-serif", fontSize:11.5,
                      }}>
                        {form.visibility === "PUBLIC"
                          ? <><Globe size={10}/> Public</>
                          : <><Lock size={10}/> Unlisted</>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: all action buttons ── */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, alignItems:"center" }}>

              {/* Publish */}
              <button
                className={`ab${!form?.isPublished ? " on" : ""}`}
                disabled={isPending || pendingAction === "publish"}
                onClick={() => handleFormUpdate({ isPublished: true }, "publish")}
              >
                {pendingAction === "publish"
                  ? <span style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                  : <Send size={13}/>}
                Publish
              </button>

              {/* Unpublish */}
              <button
                className={`ab${form?.isPublished ? " on" : ""}`}
                disabled={isPending || pendingAction === "unpublish"}
                onClick={() => handleFormUpdate({ isPublished: false }, "unpublish")}
              >
                {pendingAction === "unpublish"
                  ? <span style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                  : <EyeOff size={13}/>}
                Unpublish
              </button>

              <div style={{ width:1, height:24, background:"#e8e3dd" }}/>

              {/* Public */}
              <button
                className={`ab${form?.visibility === "PUBLIC" ? " green" : ""}`}
                disabled={pendingAction === "public"}
                onClick={() => handleFormUpdate({ visibility: "PUBLIC" }, "public")}
              >
                {pendingAction === "public"
                  ? <span style={{ width:13, height:13, border:"2px solid #15803d44", borderTop:"2px solid #15803d", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                  : <Globe size={13}/>}
                Public
              </button>

              {/* Unlisted */}
              <button
                className={`ab${form?.visibility === "UNLISTED" ? " on" : ""}`}
                disabled={pendingAction === "unlisted"}
                onClick={() => handleFormUpdate({ visibility: "UNLISTED" }, "unlisted")}
              >
                {pendingAction === "unlisted"
                  ? <span style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                  : <Lock size={13}/>}
                Unlisted
              </button>

              <div style={{ width:1, height:24, background:"#e8e3dd" }}/>

              {/* Copy */}
              <button
                className={`ab${copied ? " green" : ""}`}
                onClick={copyLink}
              >
                {copied ? <><CheckCircle size={13}/> Copied!</> : <><Copy size={13}/> Copy Link</>}
              </button>

              {/* QR */}
              <button
                className={`ab${showQR ? " on" : ""}`}
                onClick={() => setShowQR(p => !p)}
              >
                <QrCode size={13}/> QR Code
              </button>

              {/* Preview */}
              <Link href={`/form/${formId}`} className="ab">
                <Eye size={13}/> Preview
              </Link>

              {/* Responses */}
              <Link href={`/responses/${formId}`} className="ab dark">
                <Settings2 size={13}/> Responses
              </Link>
            </div>
          </div>

          {/* ── QR panel ── */}
          {showQR && (
            <div style={{
              paddingTop:22, borderTop:"1px solid #f0ebe5",
              display:"flex", flexDirection:"column", alignItems:"center", gap:14,
              animation:"slideIn 0.25s ease",
            }}>
              <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:20, fontWeight:400, margin:0, color:"#1a1a1a" }}>
                Scan to open form
              </h3>
              <div style={{
                background:"#fff", padding:18, borderRadius:20,
                boxShadow:"0 8px 32px rgba(0,0,0,0.10)",
                border:"1.5px solid #f0ebe5",
              }}>
                <QRCode value={`${window.location.origin}/form/${formId}`} size={180}/>
              </div>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12.5, color:"#bbb", margin:0 }}>
                {`${window.location.origin}/form/${formId}`}
              </p>
            </div>
          )}
        </div>

        {/* ══════════ ADD FIELD BAR ══════════ */}
        <div style={{
          background:"#fff", borderRadius:20,
          border:"1.5px solid #f0ebe5",
          boxShadow:"0 4px 16px rgba(0,0,0,0.04)",
          padding:"18px 22px", marginBottom:20,
        }}>
          <p style={{
            fontFamily:"'DM Sans', sans-serif", fontWeight:600,
            fontSize:11.5, color:"#aaa", letterSpacing:"0.8px",
            textTransform:"uppercase", margin:"0 0 12px",
          }}>
            Add Field
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FIELD_BUTTONS.map((fb) => (
              <button
                key={fb.type}
                className="fb"
                style={{ color:fb.color, borderColor:`${fb.color}25` }}
                onClick={() => addField(fb.type, fb.defaultLabel)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = fb.bg;
                  (e.currentTarget as HTMLElement).style.borderColor = fb.color;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = `${fb.color}25`;
                }}
              >
                {fb.icon} <Plus size={11}/> {fb.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ FIELDS LIST ══════════ */}
        {isLoading ? (
          /* Skeleton loaders */
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[...Array(3)].map((_,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:20, padding:"20px 22px", border:"1.5px solid #f0ebe5" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div className="sk" style={{ width:36, height:36, borderRadius:10 }}/>
                  <div style={{ flex:1 }}>
                    <div className="sk" style={{ height:18, width:"40%", marginBottom:8 }}/>
                    <div className="sk" style={{ height:13, width:"20%"}}/>
                  </div>
                  <div className="sk" style={{ width:72, height:32, borderRadius:50 }}/>
                </div>
              </div>
            ))}
          </div>

        ) : (fields as Field[]).length === 0 ? (
          /* Empty state */
          <div style={{
            textAlign:"center", padding:"72px 32px",
            background:"#fff", borderRadius:24,
            border:"1.5px dashed #e8e3dd",
          }}>
            <div className="float-anim" style={{ fontSize:50, marginBottom:14 }}>📋</div>
            <h3 style={{
              fontFamily:"'Instrument Serif', serif",
              fontSize:24, fontWeight:400, color:"#1a1a1a", marginBottom:8,
            }}>
              No fields yet
            </h3>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14.5, color:"#999", lineHeight:1.6 }}>
              Click any field button above to start building your form.
            </p>
          </div>

        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

            {/* Divider with count */}
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              fontFamily:"'DM Sans', sans-serif", fontSize:12.5, color:"#bbb",
              padding:"0 2px", marginBottom:4,
            }}>
              <div style={{ flex:1, height:1, background:"#f0ebe5" }}/>
              {fields.length} field{fields.length !== 1 ? "s" : ""}
              <div style={{ flex:1, height:1, background:"#f0ebe5" }}/>
            </div>

            {(fields as Field[]).map((field, index) => {
              const color = FIELD_COLOR[field.type] ?? "#888";
              const bg    = FIELD_BG[field.type]    ?? "#f5f5f5";
              const btn   = FIELD_BUTTONS.find(f => f.type === field.type);

              return (
                <div key={field.id} className="fc" style={{ animationDelay:`${index * 0.05}s` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>

                    {/* Drag handle (visual only) */}
                    <GripVertical size={16} style={{ color:"#ddd", flexShrink:0, cursor:"grab" }}/>

                    {/* Index bubble */}
                    <div style={{
                      width:36, height:36, borderRadius:10,
                      background:bg, border:`1.5px solid ${color}25`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"'DM Sans', sans-serif",
                      fontSize:13, fontWeight:700, color,
                      flexShrink:0,
                    }}>
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <h3 style={{
                        fontFamily:"'Instrument Serif', serif",
                        fontSize:18, fontWeight:400, color:"#1a1a1a",
                        margin:"0 0 7px", wordBreak:"break-word",
                      }}>
                        {field.label}
                      </h3>
                      <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                        <span className="tb" style={{ background:bg, color }}>
                          {btn?.icon} {field.type}
                        </span>
                        {field.isRequired && (
                          <span className="tb" style={{ background:"#fde8e5", color:"#d25543" }}>
                            Required
                          </span>
                        )}
                        {/* Options preview */}
                        {["SELECT","CHECKBOX","RADIO"].includes(field.type) && field.options && (
                          <span style={{
                            fontFamily:"'DM Sans', sans-serif", fontSize:12, color:"#bbb",
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200,
                          }}>
                            {getOptions(field.options).join("  ·  ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button className="del" onClick={() => handleDelete(field.id)}>
                      <Trash2 size={13}/> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height:48 }}/>
      </div>
    </div>
  );
}