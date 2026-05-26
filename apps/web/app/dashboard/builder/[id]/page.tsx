"use client";

import Link from "next/link";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import {
  Trash2, Copy, Eye, CheckCircle, Plus, LayoutGrid, AlignLeft,
  Hash, Mail, List, CheckSquare, QrCode, Send, EyeOff,
  Globe, Lock, GripVertical, Settings2, X,
} from "lucide-react";
import { useState } from "react";

import { useCreateField, useListFields, useDeleteField, useUpdateField } from "~/hooks/api/form-field";
import { useUpdateForm, useGetForm } from "~/hooks/api/form";

/* ─── TYPES ─── */
type FieldType = "TEXT" | "EMAIL" | "NUMBER" | "TEXTAREA" | "SELECT" | "CHECKBOX";

type Field = {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  type: FieldType;
  options?: string | null;
  isRequired: boolean;
  allowMultiple?: boolean;
};

/* ─── FIELD CONFIG ─── */
const FIELD_BUTTONS: { type: FieldType; label: string; defaultLabel: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { type: "TEXT",     label: "Text",     defaultLabel: "Name",        icon: <AlignLeft   size={14}/>, color: "#4a9eed", bg: "#eef6ff" },
  { type: "EMAIL",    label: "Email",    defaultLabel: "Email",       icon: <Mail        size={14}/>, color: "#d25543", bg: "#fde8e5" },
  { type: "NUMBER",   label: "Number",   defaultLabel: "Phone",       icon: <Hash        size={14}/>, color: "#f59e0b", bg: "#fef9ee" },
  { type: "TEXTAREA", label: "TextArea", defaultLabel: "Description", icon: <LayoutGrid  size={14}/>, color: "#8b5cf6", bg: "#f3eeff" },
  { type: "SELECT",   label: "Select",   defaultLabel: "Country",     icon: <List        size={14}/>, color: "#22c55e", bg: "#f0fdf4" },
  { type: "CHECKBOX", label: "Checkbox", defaultLabel: "Skills",      icon: <CheckSquare size={14}/>, color: "#f97316", bg: "#fff7ed" },
];

const FIELD_COLOR: Record<FieldType, string> = {
  TEXT: "#4a9eed", EMAIL: "#d25543", NUMBER: "#f59e0b",
  TEXTAREA: "#8b5cf6", SELECT: "#22c55e", CHECKBOX: "#f97316",
};
const FIELD_BG: Record<FieldType, string> = {
  TEXT: "#eef6ff", EMAIL: "#fde8e5", NUMBER: "#fef9ee",
  TEXTAREA: "#f3eeff", SELECT: "#f0fdf4", CHECKBOX: "#fff7ed",
};

/* ─── COMPONENT ─── */
export default function BuilderPage() {
  const params = useParams();
  const formId = params.id as string;

  const [copied,        setCopied]        = useState(false);
  const [showQR,        setShowQR]        = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  /* ── HOOKS — untouched ── */
  const { createFieldAsync }             = useCreateField();
  const { deleteFieldAsync }             = useDeleteField();
  const { updateFieldAsync }             = useUpdateField();
  const { updateFormAsync, isPending }   = useUpdateForm();
  const { form, isLoading: formLoading } = useGetForm(formId);
  const { fields = [], isLoading }       = useListFields(formId);

  /* ── FUNCTIONS — untouched ── */
  const addField = async (type: FieldType, label: string) => {
    try {
      await createFieldAsync({
        formId, label, type, placeholder: "", isRequired: false,
        options: type === "SELECT" || type === "CHECKBOX"
          ? JSON.stringify(["Option 1", "Option 2"])
          : undefined,
      });
    } catch (e) { console.log(e); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteFieldAsync({ fieldId: id }); }
    catch (e) { console.log(e); }
  };

  const updateField = async (fieldId: string, data: any) => {
    try {
     await updateFieldAsync({
fieldId,
...data
});
    } catch (e) { console.log(e); }
  };

  const getOptions = (options?: string | null): string[] => {
    try { return options ? JSON.parse(options) : []; }
    catch { return []; }
  };

  const handleFormUpdate = async (payload: Record<string, any>, actionKey: string) => {
    setPendingAction(actionKey);
    try { await updateFormAsync({ formId, ...payload }); }
    finally { setPendingAction(null); }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.log(e); }
  };

  /* ── LOADING ── */
  if (formLoading) {
    return (
      <div style={{ minHeight:"100vh", background:"#f7f2ec", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'DM Sans',sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid #f0ebe5", borderTop:"3px solid #d25543", animation:"spin 0.8s linear infinite" }}/>
        <p style={{ color:"#888", fontSize:15 }}>Loading your form…</p>
      </div>
    );
  }

  /* ─── RENDER ─── */
  return (
    <div style={{ minHeight:"100vh", background:"#f7f2ec", position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Action buttons */
        .ab{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:50px;border:1.5px solid #e8e3dd;background:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;text-decoration:none;color:#333;transition:all 0.18s ease;flex-shrink:0;}
        .ab:hover{border-color:#d25543;color:#d25543;transform:translateY(-1px);box-shadow:0 4px 14px rgba(210,85,67,0.12);}
        .ab.on{background:#d25543;border-color:#d25543;color:#fff;}
        .ab.on:hover{background:#bf4938;color:#fff;}
        .ab.green{background:#f0fdf4;border-color:#22c55e;color:#15803d;}
        .ab.green:hover{background:#22c55e;color:#fff;border-color:#22c55e;}
        .ab.dark{background:#1a1a1a;border-color:#1a1a1a;color:#fff;}
        .ab.dark:hover{background:#d25543;border-color:#d25543;}
        .ab:disabled{opacity:0.55;cursor:not-allowed;transform:none!important;}

        /* Field type add buttons */
        .fb{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:50px;border:1.5px solid transparent;background:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all 0.18s ease;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
        .fb:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.10);}

        /* Field card */
        .fc{background:#fff;border-radius:20px;border:1.5px solid #f0ebe5;box-shadow:0 4px 16px rgba(0,0,0,0.04);padding:22px 24px;transition:all 0.2s ease;animation:slideIn 0.3s ease both;}
        .fc:hover{box-shadow:0 12px 36px rgba(0,0,0,0.08);border-color:#e0d8d0;}

        /* Label input */
        .label-input{border:none;background:transparent;font-family:'Instrument Serif',serif;font-size:19px;font-weight:400;width:100%;outline:none;color:#1a1a1a;padding:0;line-height:1.3;}
        .label-input::placeholder{color:#ccc;}
        .label-input:focus{border-bottom:1.5px solid #e8e3dd;}

        /* Field inputs */
        .field-input{width:100%;padding:10px 14px;border:1.5px solid #f0ebe5;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:13.5px;color:#333;outline:none;background:#fafaf9;transition:border-color 0.15s,box-shadow 0.15s;}
        .field-input:focus{border-color:#d25543;box-shadow:0 0 0 3px rgba(210,85,67,0.08);background:#fff;}
        .field-input::placeholder{color:#bbb;}

        /* Option row */
        .opt-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
        .opt-input{flex:1;padding:9px 13px;border:1.5px solid #f0ebe5;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13.5px;color:#333;outline:none;background:#fafaf9;transition:border-color 0.15s,box-shadow 0.15s;}
        .opt-input:focus{border-color:#d25543;box-shadow:0 0 0 3px rgba(210,85,67,0.08);background:#fff;}
        .opt-del{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:1.5px solid #fee2e2;background:#fff5f5;color:#ef4444;cursor:pointer;transition:all 0.15s;flex-shrink:0;}
        .opt-del:hover{background:#ef4444;color:#fff;border-color:#ef4444;}
        .opt-add{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:50px;border:1.5px dashed #d0d0d0;background:transparent;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:#888;cursor:pointer;transition:all 0.15s;margin-top:4px;}
        .opt-add:hover{border-color:#d25543;color:#d25543;background:#fff5f5;}

        /* Custom required toggle */
        .req-toggle{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;}
        .req-toggle input{display:none;}
        .req-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;transition:all 0.15s;border:1.5px solid #e8e3dd;background:#f9f9f9;color:#aaa;}
        .req-pill.active{border-color:#d25543;background:#fde8e5;color:#d25543;}

        /* Type badge */
        .tb{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.3px;}

        /* Delete button */
        .del{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:50px;border:1.5px solid #fee2e2;background:#fff5f5;color:#ef4444;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
        .del:hover{background:#ef4444;color:#fff;border-color:#ef4444;transform:translateY(-1px);}

        /* Skeleton */
        .sk{background:linear-gradient(90deg,#f0ebe5 25%,#faf6f2 50%,#f0ebe5 75%);background-size:200% 100%;border-radius:10px;animation:shimmer 1.5s infinite;}

        /* Float */
        .float-anim{animation:float 3s ease-in-out infinite;}

        /* Divider label */
        .section-label{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;}
      `}</style>

      {/* Sakura decoration */}
      <svg style={{ position:"absolute", top:0, left:0, pointerEvents:"none", opacity:0.06 }} width="280" height="210" viewBox="0 0 280 210">
        <path d="M6,0 Q58,58 125,76 Q192,95 252,62" stroke="#c0392b" strokeWidth="2" fill="none"/>
        {[[128,84],[147,78],[137,97]].map(([cx,cy],i)=>(
          <g key={i} transform={`translate(${cx},${cy})`}>
            {[0,72,144,216,288].map((deg,j)=>(
              <ellipse key={j} cx={Math.cos(deg*Math.PI/180)*5} cy={Math.sin(deg*Math.PI/180)*5} rx="4.5" ry="2.5" transform={`rotate(${deg})`} fill="#f4a7b9"/>
            ))}
          </g>
        ))}
      </svg>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 28px" }}>

        {/* ══ HEADER CARD ══ */}
        <div style={{ background:"#fff", borderRadius:28, border:"1.5px solid #f0ebe5", boxShadow:"0 8px 40px rgba(0,0,0,0.07)", padding:"26px 28px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom: showQR ? 24 : 0 }}>

            {/* Left */}
            <div>
              <Link href="/dashboard" style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"#aaa", textDecoration:"none", marginBottom:12, transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="#d25543"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="#aaa"}>
                ← Dashboard
              </Link>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, background:"#1a1a1a", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20 }}>⛩</div>
                <div>
                  <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:26, fontWeight:400, color:"#1a1a1a", lineHeight:1.1, margin:"0 0 5px" }}>Form Builder</h1>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"#999" }}>{fields.length} field{fields.length!==1?"s":""}</span>
                    {form?.isPublished && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#f0fdf4", color:"#15803d", borderRadius:50, padding:"2px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600 }}>
                        <CheckCircle size={11}/> Published
                      </span>
                    )}
                    {form?.visibility && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#f5f5f5", color:"#666", borderRadius:50, padding:"2px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:11.5 }}>
                        {form.visibility==="PUBLIC" ? <><Globe size={10}/> Public</> : <><Lock size={10}/> Unlisted</>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, alignItems:"center" }}>
              <button className={`ab${!form?.isPublished?" on":""}`} disabled={isPending||pendingAction==="publish"} onClick={()=>handleFormUpdate({isPublished:true},"publish")}>
                {pendingAction==="publish" ? <span style={{ width:13,height:13,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid #fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite" }}/> : <Send size={13}/>} Publish
              </button>
              <button className={`ab${form?.isPublished?" on":""}`} disabled={isPending||pendingAction==="unpublish"} onClick={()=>handleFormUpdate({isPublished:false},"unpublish")}>
                {pendingAction==="unpublish" ? <span style={{ width:13,height:13,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid #fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite" }}/> : <EyeOff size={13}/>} Unpublish
              </button>
              <div style={{ width:1, height:24, background:"#e8e3dd" }}/>
              <button className={`ab${form?.visibility==="PUBLIC"?" green":""}`} disabled={pendingAction==="public"} onClick={()=>handleFormUpdate({visibility:"PUBLIC"},"public")}>
                <Globe size={13}/> Public
              </button>
              <button className={`ab${form?.visibility==="UNLISTED"?" on":""}`} disabled={pendingAction==="unlisted"} onClick={()=>handleFormUpdate({visibility:"UNLISTED"},"unlisted")}>
                <Lock size={13}/> Unlisted
              </button>
              <div style={{ width:1, height:24, background:"#e8e3dd" }}/>
              <button className={`ab${copied?" green":""}`} onClick={copyLink}>
                {copied ? <><CheckCircle size={13}/> Copied!</> : <><Copy size={13}/> Copy Link</>}
              </button>
              <button className={`ab${showQR?" on":""}`} onClick={()=>setShowQR(p=>!p)}>
                <QrCode size={13}/> QR
              </button>
              <Link href={`/form/${formId}`} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:50,border:"1.5px solid #e8e3dd",background:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",textDecoration:"none",color:"#333",transition:"all 0.18s ease" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#d25543";(e.currentTarget as HTMLElement).style.color="#d25543";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#e8e3dd";(e.currentTarget as HTMLElement).style.color="#333";}}>
                <Eye size={13}/> Preview
              </Link>
              <Link href={`/dashboard/responses/${formId}`}
                style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:50,border:"1.5px solid #1a1a1a",background:"#1a1a1a",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",textDecoration:"none",color:"#fff",transition:"all 0.18s ease" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#d25543";(e.currentTarget as HTMLElement).style.borderColor="#d25543";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#1a1a1a";(e.currentTarget as HTMLElement).style.borderColor="#1a1a1a";}}>
                <Settings2 size={13}/> Responses
              </Link>
            </div>
          </div>

          {/* QR panel */}
          {showQR && (
            <div style={{ paddingTop:22, borderTop:"1px solid #f0ebe5", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontWeight:400, margin:0, color:"#1a1a1a" }}>Scan to open form</h3>
              <div style={{ background:"#fff", padding:18, borderRadius:20, boxShadow:"0 8px 32px rgba(0,0,0,0.10)", border:"1.5px solid #f0ebe5" }}>
                <QRCode value={`${window.location.origin}/form/${formId}`} size={180}/>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"#bbb", margin:0 }}>{`${window.location.origin}/form/${formId}`}</p>
            </div>
          )}
        </div>

        {/* ══ ADD FIELD BAR ══ */}
        <div style={{ background:"#fff", borderRadius:20, border:"1.5px solid #f0ebe5", boxShadow:"0 4px 16px rgba(0,0,0,0.04)", padding:"18px 22px", marginBottom:20 }}>
          <p className="section-label">Add Field</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FIELD_BUTTONS.map(fb=>(
              <button key={fb.type} className="fb" style={{ color:fb.color, borderColor:`${fb.color}25` }}
                onClick={()=>addField(fb.type,fb.defaultLabel)}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=fb.bg;(e.currentTarget as HTMLElement).style.borderColor=fb.color;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff";(e.currentTarget as HTMLElement).style.borderColor=`${fb.color}25`;}}>
                {fb.icon} <Plus size={11}/> {fb.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ FIELDS LIST ══ */}
        {isLoading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[...Array(3)].map((_,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:20, padding:"22px 24px", border:"1.5px solid #f0ebe5" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div className="sk" style={{ width:36, height:36, borderRadius:10 }}/>
                  <div style={{ flex:1 }}>
                    <div className="sk" style={{ height:18, width:"45%", marginBottom:10 }}/>
                    <div className="sk" style={{ height:36, borderRadius:12 }}/>
                  </div>
                  <div className="sk" style={{ width:80, height:34, borderRadius:50 }}/>
                </div>
              </div>
            ))}
          </div>

        ) : (fields as Field[]).length === 0 ? (
          <div style={{ textAlign:"center", padding:"72px 32px", background:"#fff", borderRadius:24, border:"1.5px dashed #e8e3dd" }}>
            <div className="float-anim" style={{ fontSize:50, marginBottom:14 }}>📋</div>
            <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, fontWeight:400, color:"#1a1a1a", marginBottom:8 }}>No fields yet</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14.5, color:"#999", lineHeight:1.6 }}>Click any field button above to start building.</p>
          </div>

        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Count divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"#bbb", padding:"0 2px", marginBottom:4 }}>
              <div style={{ flex:1, height:1, background:"#f0ebe5" }}/>
              {fields.length} field{fields.length!==1?"s":""}
              <div style={{ flex:1, height:1, background:"#f0ebe5" }}/>
            </div>

            {(fields as Field[]).map((field, index) => {
              const color   = FIELD_COLOR[field.type] ?? "#888";
              const bg      = FIELD_BG[field.type]    ?? "#f5f5f5";
              const btn     = FIELD_BUTTONS.find(f=>f.type===field.type);
              const options = getOptions(field.options);
              const hasOptions = field.type === "SELECT" || field.type === "CHECKBOX";

              return (
                <div key={field.id} className="fc" style={{ animationDelay:`${index*0.05}s` }}>

                  {/* ── Top row: drag + index + label + delete ── */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>

                    {/* Drag handle */}
                    <GripVertical size={16} style={{ color:"#ddd", flexShrink:0, cursor:"grab", marginTop:4 }}/>

                    {/* Index bubble */}
                    <div style={{ width:34, height:34, borderRadius:10, background:bg, border:`1.5px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color, flexShrink:0 }}>
                      {index+1}
                    </div>

                    {/* Label editable */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <input
className="label-input"
defaultValue={field.label}
placeholder="Question label…"
onBlur={(e)=>
updateField(
field.id,
{
label:e.target.value
}
)
}
/>
                    </div>

                    {/* Delete */}
                    <button className="del" onClick={()=>handleDelete(field.id)} style={{ marginTop:2 }}>
                      <Trash2 size={13}/> Delete
                    </button>
                  </div>

                  {/* ── Placeholder input ── */}
                  <div style={{ marginLeft:58, display:"flex", flexDirection:"column", gap:10 }}>

                    {/* Show placeholder for non-option types, or for select/checkbox as description */}
                  <input
className="field-input"
defaultValue={field.placeholder || ""}
placeholder={hasOptions ? "Helper text / description (optional)" : "Placeholder text (e.g. Enter your name)"}
onBlur={e=>updateField(field.id,{placeholder:e.target.value})}
/>

                    {/* ── Meta row: type badge + required toggle ── */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      <span className="tb" style={{ background:bg, color }}>{btn?.icon} {field.type}</span>

                      {/* Custom Required pill toggle */}
                      <label className="req-toggle">
                        <input type="checkbox" checked={field.isRequired} onChange={e=>updateField(field.id,{isRequired:e.target.checked})}/>
                        <span className={`req-pill${field.isRequired?" active":""}`}>
                          {field.isRequired ? "✓ Required" : "Optional"}
                        </span>
                      </label>
                    </div>

                    {/* ── Options editor for SELECT / CHECKBOX ── */}
                    {hasOptions && (
                      <div style={{ marginTop:4 }}>
                        <p className="section-label" style={{ marginBottom:8 }}>
                          {field.type === "SELECT" ? "Dropdown options" : "Checkbox options"}
                          <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#bbb", marginLeft:6 }}>
                            — {field.type==="SELECT" ? "user picks one" : "user can pick multiple"}
                          </span>
                        </p>

                        {options.map((opt:string, oi:number)=>(
                          <div key={oi} className="opt-row">
                            {/* Option bullet */}
                            <div style={{ width:20, height:20, borderRadius: field.type==="CHECKBOX"?4:"50%", border:`2px solid ${color}50`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {field.type==="CHECKBOX"
                                ? <CheckSquare size={11} style={{ color, opacity:0.4 }}/>
                                : <div style={{ width:8, height:8, borderRadius:"50%", background:`${color}40` }}/>
                              }
                            </div>
<input
className="opt-input"
defaultValue={opt}
placeholder={`Option ${oi+1}`}
onBlur={e=>{
const next=[...options];
next[oi]=e.target.value;
updateField(field.id,{options:JSON.stringify(next)});
}}
/>

                            {/* Remove option — only if more than 1 */}
                            {options.length > 1 && (
                              <button className="opt-del" onClick={()=>{
                                const next=options.filter((_:string,i:number)=>i!==oi);
                                updateField(field.id,{options:JSON.stringify(next)});
                              }}>
                                <X size={11}/>
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add option */}
                        <button className="opt-add" onClick={()=>{
                          const next=[...options, `Option ${options.length+1}`];
                          updateField(field.id,{options:JSON.stringify(next)});
                        }}>
                          <Plus size={12}/> Add option
                        </button>
                      </div>
                    )}
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