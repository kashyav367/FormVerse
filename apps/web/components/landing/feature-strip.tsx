"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";

const FEATURES = [
  { bg:"#fce4ec", emoji:"✏️", title:"Drag & Drop Builder",   desc:"Create beautiful forms in minutes with our simple drag & drop interface." },
  { bg:"#ede7f6", emoji:"📊", title:"Response Analytics",    desc:"Track responses in real-time and make data-driven decisions." },
  { bg:"#e8f5e9", emoji:"🔗", title:"Share Anywhere",        desc:"Share your forms with a link and collect responses from anywhere." },
];

export default function Features() {
  const [visibleCards, setVisibleCards] = useState([false,false,false]);
  const [titleVisible, setTitleVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);


useEffect(() => {

  const obs = new IntersectionObserver((entries) => {

    const entry = entries[0];

    if (entry?.isIntersecting) {

      setTitleVisible(true);

      FEATURES.forEach((_, i) =>
        setTimeout(() =>
          setVisibleCards((p) => {
            const n = [...p];
            n[i] = true;
            return n;
          }),
        i * 150)
      );

      obs.disconnect();

    }

  }, { threshold: 0.12 });

  if (ref.current) {
    obs.observe(ref.current);
  }

  return () => obs.disconnect();

}, []);

  return (
    <>
      <style>{`
        @keyframes featUp {
          from { opacity:0; transform:translateY(36px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes titleIn { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes iconPop { 0%,100%{transform:scale(1)}30%{transform:scale(1.2) rotate(-6deg)}60%{transform:scale(1.08) rotate(4deg)} }
        .feat-card { flex:1; background:#fff; border-radius:22px; padding:30px 26px; display:flex; flex-direction:column; box-shadow:0 4px 24px rgba(0,0,0,0.05); border:1.5px solid rgba(0,0,0,0.05); opacity:0; transform:translateY(36px) scale(0.97); transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; position:relative; overflow:hidden; cursor:default; }
        .feat-card.show { animation:featUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .feat-card:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 20px 56px rgba(0,0,0,0.11); border-color:rgba(210,85,67,0.18); }
        .feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#d25543,#ff8a7a); opacity:0; transition:opacity 0.25s; border-radius:22px 22px 0 0; }
        .feat-card:hover::before { opacity:1; }
        .feat-icon { width:60px; height:60px; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:18px; transition:transform 0.3s; }
        .feat-card:hover .feat-icon { animation:iconPop 0.5s ease forwards; }
        .feat-learn { display:inline-flex; align-items:center; gap:5px; margin-top:16px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#d25543; text-decoration:none; opacity:0; transform:translateY(4px); transition:opacity 0.2s,transform 0.2s,gap 0.2s; }
        .feat-card:hover .feat-learn { opacity:1; transform:translateY(0); }
        .feat-learn:hover { gap:9px; }
      `}</style>

      {/* id="features" — scroll target for navbar */}
      <section ref={ref} id="features" style={{ background:"#f2ebe3", borderTop:"1px solid rgba(0,0,0,0.06)", padding:"80px 48px", position:"relative", overflow:"hidden" }}>

        {/* Subtle bg blobs */}
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(210,85,67,0.05)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:220, height:220, borderRadius:"50%", background:"rgba(139,92,246,0.04)", pointerEvents:"none" }}/>

        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:52, opacity: titleVisible?1:0, transform: titleVisible?"translateY(0)":"translateY(16px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:400, color:"#1a1a1a", margin:"0 0 10px", letterSpacing:"-0.5px" }}>
            Everything you need to build great forms
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#888", margin:0 }}>
            Simple tools. Beautiful results. All in one place.
          </p>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:24, position:"relative", zIndex:1 }}>
          {FEATURES.map((f,i) => (
            <div key={f.title} className={`feat-card${visibleCards[i]?" show":""}`}>
              <div className="feat-icon" style={{ background:f.bg }}>{f.emoji}</div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:19, fontWeight:400, color:"#1a1a1a", marginBottom:10 }}>{f.title}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#777", lineHeight:1.65 }}>{f.desc}</div>
              <a href="#" className="feat-learn">Learn more →</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}