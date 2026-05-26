"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";
import Decorations from "./decorations";

const FIELD_TYPES = [
  { icon: "≡", label: "Short answer" },
  { icon: "≡", label: "Long answer" },
  { icon: "◉", label: "Multiple choice", active: true },
  { icon: "☑", label: "Checkboxes" },
  { icon: "⌄", label: "Dropdown" },
  { icon: "↑", label: "File upload" },
  { icon: "▦", label: "Date" },
  { icon: "✩", label: "Rating" },
];
const CHOICES = ["Startup", "Portfolio", "Feedback", "Event Form"];

export default function Hero() {
  const [selected, setSelected] = useState<number | null>(null);
  const [visible,  setVisible]  = useState(false);
  const ref = useRef<HTMLElement>(null);

  const router = useRouter();

const {
  user,
  isLoading
} = useUser();

const handleCreateForm = () => {

  if (isLoading) return;

 if (!user?.id) { 
    router.push("/login");
    return;
  }

  router.push("/dashboard");
};

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatCard {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset:300; }
          to   { stroke-dashoffset:0; }
        }
        .hero-left  { opacity:0; animation:fadeUp 0.75s ease forwards; animation-delay:0.1s; }
        .hero-right { opacity:0; animation:fadeUp 0.75s ease forwards; animation-delay:0.35s; }
        .underline-path { stroke-dasharray:300; stroke-dashoffset:300; animation:drawLine 1s ease forwards; animation-delay:0.6s; }
        .form-card-float { animation:floatCard 5s ease-in-out 1.2s infinite; }
        .sidebar-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:13.5px; color:#555; cursor:pointer; transition:background 0.15s,color 0.15s; }
        .sidebar-item:hover { background:#f2ece6; }
        .sidebar-item.active { background:#fce4ec; color:#c0392b; font-weight:500; }
        .choice { display:flex; align-items:center; gap:12px; padding:11px 14px; border:1.5px solid #e8e3dd; border-radius:10px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; color:#222; transition:border-color 0.15s,background 0.15s,transform 0.1s; user-select:none; }
        .choice:hover { border-color:#c0392b; background:#fff8f6; transform:translateX(2px); }
        .choice.selected { border-color:#c0392b; background:#fff8f6; }
        .btn-free { background:#1a1a1a; color:#fff; border:none; border-radius:50px; padding:13px 26px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:background 0.2s,transform 0.15s,box-shadow 0.2s; }
        .btn-free:hover { background:#c0392b; transform:translateY(-2px); box-shadow:0 8px 24px rgba(192,57,43,0.28); }
        .btn-explore { background:transparent; color:#1a1a1a; border:1.5px solid #bbb; border-radius:50px; padding:13px 26px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; transition:border-color 0.2s,transform 0.15s; }
        .btn-explore:hover { border-color:#1a1a1a; transform:translateY(-2px); }
        .btn-next { background:#c0392b; color:#fff; border:none; border-radius:8px; padding:11px 22px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:background 0.2s,transform 0.15s; }
        .btn-next:hover { background:#a93226; transform:translateY(-1px); }
      `}</style>

      <section ref={ref} style={{ minHeight:"calc(100vh - 62px)", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", background:"#f9f3ee" }}>
        <Decorations/>

        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:1180, margin:"0 auto", padding:"60px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:48 }}>

          {/* Left */}
          <div className="hero-left" style={{ maxWidth:480 }}>
            <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(44px,5.5vw,70px)", lineHeight:1.08, fontWeight:400, letterSpacing:"-1.5px", marginBottom:6, color:"#1a1a1a" }}>
              Build forms<br/>that feel<br/><span style={{ color:"#c0392b", fontStyle:"italic" }}>effortless</span>
            </h1>
            <svg width="218" height="14" viewBox="0 0 218 14" style={{ display:"block", marginBottom:24 }}>
              <path className="underline-path" d="M2,10 Q35,4 75,9 Q115,14 158,7 Q185,3 216,8" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, lineHeight:1.7, color:"#555", marginBottom:34 }}>
              Create beautiful forms, collect responses,<br/>and turn insights into action —<br/>all in one intuitive workspace.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button
onClick={handleCreateForm}
className="btn-free"
>
Create a free form →
</button>
              <a href="#features" className="btn-explore" onClick={e=>{e.preventDefault();document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}}>Explore features</a>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="hero-right">
            <div className="form-card-float" style={{ background:"#fff", borderRadius:18, boxShadow:"0 28px 90px rgba(0,0,0,0.13)", overflow:"hidden", width:530, maxWidth:"100%" }}>
              <div style={{ background:"#f5f5f5", padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #ececec" }}>
                <div style={{ display:"flex", gap:7 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{ width:13, height:13, borderRadius:"50%", background:c }}/>)}
                </div>
                <div style={{ display:"flex", gap:10, color:"#c0392b", fontSize:16 }}>🖥 📱</div>
              </div>
              <div style={{ display:"flex" }}>
                <div style={{ width:170, flexShrink:0, borderRight:"1px solid #f0ebe5", padding:"10px 6px", background:"#fafafa" }}>
                  {FIELD_TYPES.map(f=>(
                    <div key={f.label} className={`sidebar-item${f.active?" active":""}`}>
                      <span style={{ width:18, textAlign:"center", fontSize:14 }}>{f.icon}</span>{f.label}
                    </div>
                  ))}
                </div>
                <div style={{ flex:1, padding:"22px 20px 18px" }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:"#c0392b", letterSpacing:0.7, textTransform:"uppercase", marginBottom:6 }}>Question 01</div>
                  <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontWeight:400, marginBottom:16, lineHeight:1.3, color:"#1a1a1a" }}>What are you building?</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {CHOICES.map((c,i)=>(
                      <div key={c} className={`choice${selected===i?" selected":""}`} onClick={()=>setSelected(i)}>
                        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${selected===i?"#c0392b":"#ccc"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {selected===i&&<div style={{ width:9, height:9, borderRadius:"50%", background:"#c0392b" }}/>}
                        </div>
                        {c}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:18 }}>
                    <button className="btn-next">Next →</button>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, marginLeft:14 }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#888", whiteSpace:"nowrap" }}>1 of 7</span>
                      <div style={{ flex:1, height:4, background:"#e8e3dd", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:"14%", background:"#c0392b", borderRadius:3 }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}