"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
useUser,
useLogout
} from "~/hooks/api/auth";

const NAV_ITEMS = [
  { label: "Features",  id: "features" },
  { label: "Showcase",  id: "showcase" },
  { label: "Pricing",   id: "pricing"  },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [activeItem,  setActiveItem]  = useState<string | null>(null);
  const [menuOpen,    setMenuOpen]    = useState(false);

  const router = useRouter();

const {
user,
isLoading
} = useUser();

const {
logoutAsync
} = useLogout();

const handleCreateForm = ()=>{

if(isLoading) return;

if (!user?.id) {

router.push("/login");
return;

}

router.push("/dashboard");

};

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      // Auto-highlight nav item based on scroll position
      const ids = ["features", "showcase", "pricing"];
      for (const id of ids.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveItem(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveItem(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes navIn {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .nav-root { animation: navIn 0.5s ease forwards; }

        .nl {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: #333; background: none; border: none;
          cursor: pointer; padding: 4px 0;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nl::after {
          content: '';
          position: absolute; bottom: -3px; left: 0;
          width: 0; height: 2px;
          background: #c0392b; border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nl:hover        { color: #c0392b; }
        .nl:hover::after { width: 100%; }
        .nl.active        { color: #c0392b; }
        .nl.active::after { width: 100%; }

        .nav-cta {
          background: #1a1a1a; color: #fff; border: none;
          border-radius: 50px; padding: 9px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .nav-cta:hover {
          background: #c0392b; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(192,57,43,0.25);
        }

        .hb { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
        .hb span { width:22px; height:2px; background:#1a1a1a; border-radius:2px; transition:all 0.2s; display:block; }

        @keyframes mobileIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mobile-menu { animation: mobileIn 0.2s ease forwards; }

        @media (max-width: 768px) {
          .nav-center { display:none !important; }
          .nav-login  { display:none !important; }
          .hb         { display:flex !important; }
        }
      `}</style>

      <nav className="nav-root" style={{
        position:"sticky", top:0, zIndex:200, height:62,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 48px",
        background: scrolled ? "rgba(249,243,238,0.97)" : "rgba(249,243,238,0.85)",
        backdropFilter:"blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.07)" : "none",
        transition:"background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}>

        {/* Brand */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none", color:"#1a1a1a" }}>
          <div style={{ width:34, height:34, background:"#1a1a1a", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17 }}>⛩</div>
          <span style={{ fontFamily:"'Instrument Serif', serif", fontSize:20, fontWeight:400, letterSpacing:"-0.3px" }}>FormVerse</span>
        </Link>

        {/* Center */}
        <div className="nav-center" style={{ display:"flex", gap:36, alignItems:"center" }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nl${activeItem === item.id ? " active" : ""}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
       {
user?.id ? (

<button
className="nl nav-login"
onClick={()=>
logoutAsync()
}
>
Logout
</button>

) : (

<Link
href="/login"
className="nl nav-login"
style={{ textDecoration:"none" }}
>
Log in
</Link>

)
}
          <button
onClick={handleCreateForm}
className="nav-cta"
>
Create Form
<span
style={{
width:22,
height:22,
background:"#c0392b",
borderRadius:"50%",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:12
}}
>
⛩
</span>
</button>
          <button className="hb" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
            <span style={{ transform: menuOpen ? "rotate(45deg) translateY(7px)"  : "none" }}/>
            <span style={{ opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }}/>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position:"fixed", top:62, left:0, right:0, zIndex:199,
          background:"rgba(249,243,238,0.98)", backdropFilter:"blur(16px)",
          borderBottom:"1px solid rgba(0,0,0,0.08)",
          padding:"20px 32px 24px",
          display:"flex", flexDirection:"column", gap:18,
        }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} className="nl" style={{ textAlign:"left" }} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
          <Link href="/login" className="nl" style={{ textDecoration:"none" }} onClick={() => setMenuOpen(false)}>Log in</Link>
        </div>
      )}
    </>
  );
}