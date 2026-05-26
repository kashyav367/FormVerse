"use client";

import { useEffect, useState } from "react";

export default function Decorations() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}/>;

  const petals  = [0,72,144,216,288];
  const blooms: [number,number][] = [
    [130,155],[160,152],[148,168],[145,140],[167,163],
    [95,145],[82,142],[88,155],[78,150],
    [198,172],[205,165],[195,178],[210,170],
    [245,72],[255,68],[250,80],[240,75],[258,76],
    [170,108],[178,102],[165,115],
  ];

  return (
    <>
      {/* ── Sakura branch top-left ── */}
      <svg style={{ position:"absolute", top:0, left:0, pointerEvents:"none" }}
        width="320" height="260" viewBox="0 0 320 260" fill="none">
        <path d="M10,0 Q60,60 120,80 Q180,100 240,70 Q290,50 310,30" stroke="#c8a4a4" strokeWidth="3" fill="none" opacity="0.5"/>
        <path d="M120,80 Q140,130 160,150" stroke="#c8a4a4" strokeWidth="2" fill="none" opacity="0.4"/>
        <path d="M180,100 Q200,140 190,170" stroke="#c8a4a4" strokeWidth="2" fill="none" opacity="0.35"/>
        <path d="M80,75 Q90,110 80,140"   stroke="#c8a4a4" strokeWidth="1.5" fill="none" opacity="0.3"/>
        {blooms.map(([cx,cy],i) => (
          <g key={i} transform={`translate(${cx},${cy})`} opacity="0.75">
            {petals.map(deg => (
              <ellipse key={deg}
                cx={Math.cos(deg*Math.PI/180)*6} cy={Math.sin(deg*Math.PI/180)*6}
                rx="5" ry="3" transform={`rotate(${deg})`}
                fill={i%3===0?"#f4a7b9":i%3===1?"#f8c8d4":"#fadadd"} opacity="0.9"/>
            ))}
            <circle cx="0" cy="0" r="2" fill="#f9e4ec"/>
          </g>
        ))}
      </svg>

      {/* ── Hanging lantern top-right ── */}
      <svg style={{ position:"absolute", top:0, right:60, pointerEvents:"none" }}
        width="100" height="230" viewBox="0 0 100 230">
        <line x1="50" y1="0" x2="50" y2="44" stroke="#b8a090" strokeWidth="1.5"/>
        <ellipse cx="50" cy="50" rx="18" ry="8" fill="#8b1a1a" opacity="0.85"/>
        <path d="M22,54 Q16,90 22,128 Q35,138 50,138 Q65,138 78,128 Q84,90 78,54 Q65,44 50,44 Q35,44 22,54 Z" fill="#c0392b" opacity="0.82"/>
        {[-18,-9,0,9,18].map((dx,i)=>(
          <line key={i} x1={50+dx} y1={54+(i===0||i===4?4:i===1||i===3?2:0)} x2={50+dx} y2={128-(i===0||i===4?4:i===1||i===3?2:0)} stroke="#9b2020" strokeWidth="1.2" opacity="0.5"/>
        ))}
        <ellipse cx="50" cy="132" rx="18" ry="8" fill="#8b1a1a" opacity="0.85"/>
        <ellipse cx="50" cy="91" rx="14" ry="24" fill="#ff8a65" opacity="0.18"/>
        <text x="50" y="88"  textAnchor="middle" fill="#fff" fontSize="10" fontFamily="serif" opacity="0.9">フ</text>
        <text x="50" y="103" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="serif" opacity="0.9">ォ</text>
        <text x="50" y="118" textAnchor="middle" fill="#fff" fontSize="9"  fontFamily="serif" opacity="0.85">作</text>
        <line x1="50" y1="140" x2="50" y2="195" stroke="#c0392b" strokeWidth="2"/>
        {[[-6,198],[0,200],[6,198],[-4,203],[4,203],[0,207]].map(([tx,ty],i)=>(
          <line key={i} x1="50" y1="195" x2={50+(tx as number)} y2={ty as number} stroke="#c0392b" strokeWidth="1.2" opacity="0.7"/>
        ))}
      </svg>

      {/* ── Mountains + Rising sun + Pagoda + Wave ── */}
      <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", pointerEvents:"none" }}
        viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice" height={320}>
        <defs>
          <radialGradient id="sunG" cx="15%" cy="80%" r="18%">
            <stop offset="0%"   stopColor="#ff6b35" stopOpacity="0.6"/>
            <stop offset="60%"  stopColor="#ff9a5c" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="mtnG"  x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b0a090" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#8a7a6a" stopOpacity="0.28"/>
          </linearGradient>
          <linearGradient id="mtnG2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9a8a7a" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#7a6a5a" stopOpacity="0.18"/>
          </linearGradient>
        </defs>
        <circle cx="185" cy="245" r="90" fill="url(#sunG)"/>
        <path d="M0,320 L60,200 L130,260 L200,130 L270,220 L370,190 L450,260 L560,320 Z" fill="url(#mtnG2)"/>
        <path d="M0,320 L80,185 L155,240 L205,125 L250,215 L340,195 L470,310 L560,320 Z" fill="url(#mtnG)"/>
        <path d="M195,125 L205,125 L230,170 L180,170 Z" fill="#fff" opacity="0.35"/>
        <g opacity="0.18" transform="translate(55,195)">
          <rect x="8" y="60" width="28" height="55" fill="#5a4a3a"/>
          <polygon points="0,60 22,32 44,60" fill="#5a4a3a"/>
          <rect x="11" y="44" width="22" height="18" fill="#5a4a3a"/>
          <polygon points="5,44 22,20 39,44" fill="#5a4a3a"/>
          <rect x="14" y="28" width="16" height="18" fill="#5a4a3a"/>
          <polygon points="10,28 22,8 34,28" fill="#5a4a3a"/>
        </g>
        <g opacity="0.16" transform="translate(1080,200)">
          <rect x="25" y="95" width="50" height="15" fill="#5a4a3a" rx="2"/>
          <rect x="30" y="60" width="40" height="38" fill="#6a5a4a" rx="3"/>
          <rect x="34" y="65" width="32" height="26" fill="#8a7a6a" rx="2"/>
          <polygon points="22,62 50,32 78,62" fill="#5a4a3a"/>
          <rect x="18" y="56" width="64" height="10" fill="#6a5a4a"/>
          <polygon points="15,56 50,22 85,56" fill="#5a4a3a"/>
          <rect x="40" y="108" width="20" height="30" fill="#5a4a3a"/>
          <rect x="30" y="135" width="40" height="8"  fill="#5a4a3a" rx="2"/>
        </g>
        <path d="M0,295 Q200,278 400,290 Q600,305 800,285 Q1000,268 1200,282 L1200,320 L0,320 Z" fill="#8a7a6a" opacity="0.07"/>
        <path d="M0,312 Q150,300 300,308 Q500,318 700,304 Q900,290 1100,310 L1200,308 L1200,320 L0,320 Z" fill="#1a1a1a" opacity="0.05"/>
      </svg>

      {/* ── Bamboo right ── */}
      <svg style={{ position:"absolute", bottom:0, right:20, pointerEvents:"none" }}
        width="160" height="420" viewBox="0 0 160 420" opacity="0.13">
        {[0,40,80,120,160,200,240,280,320,360].map((y,i)=>(
          <g key={i}>
            <rect x="44" y={y} width="14" height="42" fill="#5a7a3a" rx="2"/>
            <ellipse cx="51" cy={y+42} rx="8" ry="3" fill="#4a6a2a"/>
            <path d={i%2===0?`M58,${y+20} Q90,${y+10} 110,${y+25}`:`M44,${y+20} Q15,${y+10} 0,${y+28}`} stroke="#6a8a4a" strokeWidth="2" fill="none"/>
          </g>
        ))}
        {[20,60,100,140,180,220,260,300,340,380].map((y,i)=>(
          <g key={i}>
            <rect x="88" y={y} width="12" height="42" fill="#4a6a2a" rx="2"/>
            <ellipse cx="94" cy={y+42} rx="7" ry="2.5" fill="#3a5a1a"/>
            <path d={i%2===0?`M100,${y+18} Q125,${y+8} 145,${y+22}`:`M88,${y+18} Q65,${y+8} 50,${y+22}`} stroke="#5a7a3a" strokeWidth="1.5" fill="none"/>
          </g>
        ))}
      </svg>
    </>
  );
}