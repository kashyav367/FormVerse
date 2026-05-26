"use client";

import { useState } from "react";
import Link from "next/link";

const COLS = [
  { heading:"Features",  items:["Drag & Drop Builder","Response Analytics","Custom Branding"] },
  { heading:"Templates", items:["Feedback Form","Event Registration","Survey","Contact Form"] },
  { heading:"Pricing",   items:["Starter","Pro","Teams"] },
];

export default function Footer() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <style>{`
        .wave-svg { display:block; background:#1a1a1a; margin-top:-1px; }
        .footer { background:#1a1a1a; color:#ccc; padding:52px 48px 28px; }
        .footer-inner { max-width:1100px; margin:0 auto 36px; display:flex; gap:56px; flex-wrap:wrap; }
        .fcol h5 { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:#fff; margin-bottom:14px; }
        .fcol a { display:block; color:#888; text-decoration:none; font-family:'DM Sans',sans-serif; font-size:13.5px; margin-bottom:9px; transition:color 0.2s; }
        .fcol a:hover { color:#fff; }
        .email-input { flex:1; min-width:0; background:#2a2a2a; border:1px solid #3a3a3a; border-radius:8px 0 0 8px; padding:11px 14px; color:#fff; font-family:'DM Sans',sans-serif; font-size:13.5px; outline:none; transition:border-color 0.2s; }
        .email-input:focus { border-color:#c0392b; }
        .email-input::placeholder { color:#555; }
        .email-btn { background:#c0392b; border:none; border-radius:0 8px 8px 0; padding:11px 16px; color:#fff; font-size:16px; cursor:pointer; transition:background 0.2s; }
        .email-btn:hover { background:#a93226; }
      `}</style>

      <svg className="wave-svg" viewBox="0 0 1200 72" preserveAspectRatio="none" height={72} width="100%">
        <path d="M0,0 Q150,72 300,36 Q450,0 600,48 Q750,72 900,28 Q1050,-8 1200,40 L1200,0 Z" fill="#f2ebe3"/>
      </svg>

      <footer className="footer">
        <div className="footer-inner">
          {/* Brand */}
          <div style={{ minWidth:200 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
              <div style={{ width:34, height:34, background:"#fff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⛩</div>
              <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:19, color:"#fff" }}>FormVerse</span>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#777", marginBottom:10 }}>Create · Share · Collect</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#555" }}>© 2026 FormVerse. All rights reserved.</div>
          </div>

          {COLS.map(col=>(
            <div key={col.heading} className="fcol">
              <h5>{col.heading}</h5>
              {col.items.map(item=><Link key={item} href="#">{item}</Link>)}
            </div>
          ))}

          {/* Newsletter */}
          <div style={{ minWidth:240 }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:17, color:"#fff", marginBottom:6 }}>Stay in the loop</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#777", lineHeight:1.55, marginBottom:14 }}>Get updates on new features and improvements.</p>
            {submitted ? (
              <p style={{ color:"#69db7c", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>✓ You're subscribed!</p>
            ) : (
              <div style={{ display:"flex" }}>
                <input className="email-input" type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)}/>
                <button className="email-btn" onClick={()=>email&&setSubmitted(true)}>→</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", borderTop:"1px solid #2a2a2a", paddingTop:18, textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#555" }}>
          Handcrafted with care — FormVerse 2026
        </div>
      </footer>
    </>
  );
}