"use client";

import { useEffect, useRef, useState } from "react";

const PLANS = [
  { name:"Starter", price:"Free",  sub:"forever",    highlight:false, cta:"Get started free", features:["5 forms","100 responses/mo","Basic analytics","Email support"] },
  { name:"Pro",     price:"$12",   sub:"per month",   highlight:true,  cta:"Start Pro trial",  features:["Unlimited forms","10,000 responses/mo","Advanced analytics","Custom branding","Priority support"] },
  { name:"Teams",   price:"$39",   sub:"per month",   highlight:false, cta:"Contact sales",    features:["Everything in Pro","5 team members","Shared workspace","SSO & audit logs","Dedicated support"] },
];

export default function Pricing() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

useEffect(() => {

  const obs = new IntersectionObserver((entries) => {

    const entry = entries[0];

    if(entry?.isIntersecting){
      setVisible(true);
    }

  }, { threshold:0.1 });

  if(ref.current){
    obs.observe(ref.current);
  }

  return () => obs.disconnect();

}, []);

  return (
    <>
      <style>{`
        @keyframes priceIn { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        .plan { flex:1; background:#fff; border-radius:18px; padding:32px 26px; border:1.5px solid #e8e3dd; opacity:0; transition:transform 0.25s,box-shadow 0.25s; position:relative; overflow:hidden; }
        .plan.show { animation:priceIn 0.6s ease forwards; }
        .plan.hi { border-color:#c0392b; box-shadow:0 8px 40px rgba(192,57,43,0.14); }
        .plan.hi::before { content:'Most Popular'; position:absolute; top:16px; right:-28px; background:#c0392b; color:#fff; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; padding:4px 36px; transform:rotate(45deg); letter-spacing:0.5px; }
        .plan:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.09); }
        .plan-cta { display:block; width:100%; padding:13px; border-radius:50px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; text-align:center; cursor:pointer; text-decoration:none; border:none; transition:background 0.2s,transform 0.15s,box-shadow 0.2s; }
        .plan-cta.def { background:#f2ebe3; color:#1a1a1a; }
        .plan-cta.def:hover { background:#e8ddd4; transform:translateY(-1px); }
        .plan-cta.pri { background:#c0392b; color:#fff; }
        .plan-cta.pri:hover { background:#a93226; transform:translateY(-1px); box-shadow:0 6px 20px rgba(192,57,43,0.3); }
      `}</style>

      {/* id="pricing" — scroll target for navbar */}
      <section ref={ref} id="pricing" style={{ background:"#f9f3ee", padding:"80px 48px", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(30px,4vw,46px)", fontWeight:400, color:"#1a1a1a", margin:"0 0 12px" }}>Simple, honest pricing</h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"#888", margin:0 }}>No hidden fees. Cancel any time.</p>
        </div>

        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", gap:22, alignItems:"stretch" }}>
          {PLANS.map((p,i) => (
            <div key={p.name} className={`plan${p.highlight?" hi":""}${visible?" show":""}`} style={{ animationDelay:`${i*0.15}s` }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#aaa", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{p.name}</div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:44, fontWeight:400, color:"#1a1a1a", lineHeight:1 }}>{p.price}</div>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#999", display:"block", marginTop:4, marginBottom:24 }}>{p.sub}</span>
              <hr style={{ border:"none", borderTop:"1px solid #f0ebe5", marginBottom:20 }}/>
              <ul style={{ listStyle:"none", margin:"0 0 28px", padding:0 }}>
                {p.features.map(f=>(
                  <li key={f} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#444", padding:"6px 0", display:"flex", alignItems:"center", gap:9 }}>
                    <span style={{ color:"#c0392b", fontWeight:700, fontSize:13 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="#" className={`plan-cta ${p.highlight?"pri":"def"}`}>{p.cta}</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}