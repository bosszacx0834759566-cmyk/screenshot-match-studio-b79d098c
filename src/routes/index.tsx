import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDown, ArrowUpRight, Plus, X } from "lucide-react";
import { Scramble } from "@/components/Scramble";
import { OriginPanel } from "@/components/OriginPanel";
import issVideo from "@/assets/iss-video.mp4.asset.json";
import goddardImg from "@/assets/goddard.jpg.asset.json";
import oppenheimerImg from "@/assets/oppenheimer.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GodHeimer Technologies — Bridging Space and Earth" },
      { name: "description", content: "GodHeimer builds RobertCore, resilient space-to-ground communication infrastructure that adapts to hostile atmospheric conditions." },
      { property: "og:title", content: "GodHeimer Technologies — Bridging Space and Earth" },
      { property: "og:description", content: "RobertCore: reliable space-to-ground communication, engineered for real-world conditions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1105 1119" fill="none" className={className} role="img" aria-label="GodHeimer logo">
      <path d="M52.1687 18.9388L233.684 518.939C233.684 518.939 415.653 498.939 552.169 498.939C688.684 498.939 870.755 518.939 870.755 518.939L1052.17 18.9388" stroke="currentColor" strokeWidth="111" />
      <path d="M552.219 468.939L552.169 1118.94" stroke="currentColor" strokeWidth="111" />
    </svg>
  );
}

const nav: [string, string][] = [
  ["RobertCore", "robertcore"],
  ["Challenge", "challenge"],
  ["Adaptive", "adaptive"],
  ["The Name", "the-name"],
  ["Leadership", "leadership"],
  ["Contact", "contact"],
];

function Lines({ lines, className = "" }: { lines: ReactNode[]; className?: string }) {
  return <>{lines.map((l, i) => <span key={i} className={`mask-line reveal-mask ${className}`} style={{ transitionDelay: `${i * 90}ms` }}><span style={{ transitionDelay: `${i * 90}ms` }}>{l}</span></span>)}</>;
}

function Head({ n, title, dark }: { n: string; title: string; dark?: boolean }) {
  return <div className={`section-head mono reveal ${dark ? "border-line-dark text-paper/60" : "border-line-light text-ink/60"}`}><span>[{n}] {title}</span><Plus className="h-3.5 w-3.5" aria-hidden="true" /></div>;
}

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => { const f = () => setT(new Date().toISOString().slice(11, 19)); f(); const id = setInterval(f, 1000); return () => clearInterval(id); }, []);
  return <span>{t} UTC</span>;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return; io.disconnect();
      const start = performance.now();
      const tick = (now: number) => { const p = Math.min(1, (now - start) / 1600); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Orbit() {
  return (
    <svg className="orbit" viewBox="0 0 800 800" fill="none" aria-hidden="true">
      <g className="spin"><circle cx="400" cy="400" r="380" stroke="currentColor" strokeOpacity=".25" strokeDasharray="2 8" /><circle cx="400" cy="20" r="5" fill="currentColor" /></g>
      <g className="spin-rev"><circle cx="400" cy="400" r="290" stroke="currentColor" strokeOpacity=".35" /><rect x="684" y="394" width="12" height="12" fill="currentColor" /></g>
      <circle cx="400" cy="400" r="200" stroke="currentColor" strokeOpacity=".2" />
      <circle cx="400" cy="400" r="110" stroke="currentColor" strokeOpacity=".5" />
      <path d="M0 400H800M400 0V800" stroke="currentColor" strokeOpacity=".12" />
      <path className="beam" d="M400 400L696 400" stroke="currentColor" strokeOpacity=".8" />
      <path className="beam" d="M400 400L400 20" stroke="currentColor" strokeOpacity=".5" />
      <circle className="pulse" cx="400" cy="400" r="8" fill="currentColor" />
    </svg>
  );
}

const statement = "A single communication method cannot always perform under every condition. The future requires systems that understand changing environments and adapt intelligently.".split(" ");

function Index() {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".reveal, .reveal-mask, .step").forEach((el) => io.observe(el));
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY; const h = document.documentElement.scrollHeight - innerHeight;
      setProgress(h > 0 ? y / h : 0); setHide(y > 200 && y > last); last = y;
      const f = fillRef.current;
      if (f) { const r = f.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35))); setLit(Math.round(p * statement.length)); }
    };
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = heroRef.current; if (!el) return; const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <main className="company-page bg-ink font-sans text-paper">
      <div className="progress-bar" style={{ transform: `scaleX(${progress})`, width: "100%" }} />
      <a href="#robertcore" className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:bg-paper focus:p-4 focus:text-ink">Skip to content</a>

      <header className={`site-header ${hide ? "hide" : ""}`}>
        <div className="site-container flex h-20 items-center justify-between gap-6">
          <a href="#top" aria-label="GodHeimer home" className="flex items-center gap-3"><Logo className="h-7 w-7" /><span className="brand text-xs font-bold">GODHEIMER</span></a>
          <nav aria-label="Main navigation" className="mono hidden items-center gap-10 lg:flex">
            {nav.slice(0, 4).map(([l, id]) => <a key={id} href={`#${id}`} className="u-link"><Scramble text={l} /></a>)}
          </nav>
          <div className="flex items-center gap-6">
            <a href="#contact" className="mono u-link hidden sm:inline-flex"><Scramble text="Contact" /> <ArrowUpRight className="h-3.5 w-3.5" /></a>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger className="menu-btn mono" aria-label="Open menu"><span className="menu-btn-fill" /><span className="menu-btn-label hidden sm:inline-block"><Scramble text="Menu" /></span><span className="menu-btn-icon"><span className="menu-bars"><span /><span /></span></span></Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] overflow-hidden bg-ink">
                  <video src={issVideo.url} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover grayscale opacity-50" />
                  <div className="absolute inset-0 bg-ink/50" />
                </Dialog.Overlay>
                <Dialog.Content aria-describedby={undefined} className="site-container fixed inset-0 z-[61] flex max-w-none flex-col overflow-y-auto bg-transparent pb-8 pt-6 text-paper">
                  <div className="flex h-14 items-center justify-between"><Dialog.Title className="brand flex items-center gap-3 text-xs font-bold"><Logo className="h-7 w-7" />GODHEIMER</Dialog.Title><Dialog.Close className="menu-btn close-btn mono" aria-label="Close menu"><span className="menu-btn-fill" /><span className="close-btn-label hidden sm:inline-block"><Scramble text="Close" /></span><span className="close-btn-icon"><X className="h-4 w-4" strokeWidth={2.25} /></span></Dialog.Close></div>
                  <nav aria-label="Section navigation" className="my-auto flex flex-col py-16">
                    {nav.map(([l, id], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="menu-link flex items-baseline gap-6 border-b border-line-dark py-3"><span className="mono text-paper/40">0{i + 1}</span><Scramble text={l} /></a>)}
                  </nav>
                  <div className="mono flex justify-between text-paper/50"><a href="mailto:contact@godheimer.com" className="u-link">contact@godheimer.com</a><Clock /></div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} onMouseMove={onMove} className="hero bg-ink">
        <div className="hero-media" aria-hidden="true">
          <video src={issVideo.url} autoPlay loop muted playsInline preload="auto" />
        </div>

        <div className="site-container relative z-10 pb-10 pt-32">
          <div className="mono reveal mb-10 flex flex-wrap gap-x-8 gap-y-2 text-paper/50"><span>● Link status: nominal</span><span>Lat 13.7563° N / Lon 100.5018° E</span><Clock /></div>
          <h1 className="hero-title"><Lines lines={["Bridging", <span className="hero-sub">Space  Earth.</span>]} /></h1>
          <div className="mt-14 grid gap-10 border-t border-line-dark pt-8 lg:grid-cols-12">
            <p className="body-copy reveal text-paper/60 lg:col-span-5">GodHeimer Technologies builds resilient communication infrastructure between space and Earth — designed to perform even when the environment works against it.</p>
            <div className="reveal flex flex-wrap items-center gap-6 lg:col-span-6 lg:col-start-7 lg:justify-end">
              <a href="#robertcore" className="pill mono"><Scramble text="Discover RobertCore" /> <ArrowUpRight className="h-4 w-4" /></a>
              <a href="#challenge" className="mono u-link text-paper/70"><Scramble text="Scroll" /> <ArrowDown className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker mono bg-ink text-paper/50" aria-hidden="true">
        <div className="ticker-track">{[0, 1].map((k) => <span key={k} className="flex gap-16">{["Space-to-ground", "Adaptive links", "Weather resilient", "RobertCore", "Mission critical", "Sense · Decide · Adapt"].map((t) => <span key={t}>+ {t}</span>)}</span>)}</div>
      </div>

      {/* ROBERTCORE */}
      <section id="robertcore" className="section-space bg-ink">
        <div className="site-container">
          <Head n="01" title="RobertCore / The System" dark />
          <div className="mt-16 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mono reveal mb-8 text-paper/50">Resilient by design</p>
              <h2 className="display-xl"><Lines lines={["RobertCore."]} /></h2>
              <p className="display-md reveal mt-12 max-w-3xl text-paper/70">Space-to-ground communication infrastructure that keeps data moving through changing — and often hostile — atmospheric conditions.</p>
            </div>
            <div className="reveal flex items-end justify-end lg:col-span-4"><Logo className="h-48 w-48 text-paper sm:h-72 sm:w-72 lg:h-full lg:w-auto lg:max-w-full" /></div>
          </div>
          <div className="mt-24 grid grid-cols-2 border-t border-line-dark md:grid-cols-4">
            {[[99, "%", "Link availability target"], [4, "", "Atmospheric threats modeled"], [3, "", "Adaptive stages"], [24, "/7", "Continuous operation"]].map(([n, s, l], i) => (
              <div key={String(l)} className={`reveal border-line-dark py-10 pr-6 ${i ? "md:border-l md:pl-6" : ""}`}>
                <div className="display-lg"><Counter to={Number(n)} suffix={String(s)} /></div>
                <p className="mono mt-4 text-paper/50">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section id="challenge" className="section-space bg-paper text-ink">
        <div className="site-container">
          <Head n="02" title="The Challenge" />
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <h2 className="display-lg lg:col-span-7"><Lines lines={["The challenge of", "space-to-Earth links."]} /></h2>
            <div className="reveal lg:col-span-4 lg:col-start-9">
              <p className="body-copy text-ink/60">Traditional laser communication is highly efficient, yet extremely sensitive to weather. Clouds, rain, fog, and atmospheric turbulence can interrupt the link entirely.</p>
              <p className="body-copy mt-6 font-semibold">In critical missions, any interruption is unacceptable.</p>
            </div>
          </div>
          <div className="cell-wrap mt-24 grid md:grid-cols-4 md:gap-6">
            {["Clouds", "Rain", "Fog", "Turbulence"].map((t, i) => (
              <div key={t} className="cell reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="mono flex justify-between opacity-50"><span>0{i + 1}</span><span>Threat</span></div>
                <h3 className="display-md mt-16">{t}</h3>
                <p className="mono mt-4 opacity-50">Link disruption</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADAPTIVE */}
      <section id="adaptive" className="section-space bg-ink text-paper">
        <div className="site-container">
          <Head n="03" title="Our Philosophy" dark />
          <h2 className="display-xl mt-16 max-w-6xl"><Lines lines={["Communication", "must adapt to", <span className="hero-sub">the environment.</span>]} /></h2>
          <div className="mt-24 grid gap-10 md:grid-cols-3">
            {[["Sense", "Understand changing atmospheric conditions in real time."], ["Decide", "No single method performs under every condition."], ["Adapt", "Respond intelligently to keep the link alive."]].map(([t, d], i) => (
              <div key={t} className="step pt-8" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="bar -mt-8 mb-8" style={{ transitionDelay: `${i * 250}ms` }} />
                <span className="mono text-paper/40">Stage 0{i + 1}</span>
                <h3 className="display-lg mt-6">{t}</h3>
                <p className="body-copy mt-6 max-w-xs text-paper/60">{d}</p>
              </div>
            ))}
          </div>
          <p ref={fillRef} className="display-md mt-40 max-w-5xl">
            {statement.map((w, i) => <span key={i} className={`fill-word ${i < lit ? "on" : ""}`}>{w} </span>)}
          </p>
        </div>
      </section>

      {/* ATMOSPHERE */}
      <section className="section-space bg-paper text-ink">
        <div className="site-container">
          <Head n="04" title="Atmosphere" />
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <h2 className="display-xl lg:col-span-8"><Lines lines={["Weather changes", "everything."]} /></h2>
            <p className="body-copy reveal self-end text-ink/60 lg:col-span-4">Clouds, rain, and atmospheric conditions can severely affect how information travels between space and Earth. These challenges demand systems engineered for real-world conditions — not ideal ones.</p>
          </div>
        </div>
      </section>

      {/* THE NAME */}
      <section id="the-name" className="section-space bg-ink text-paper">
        <div className="site-container">
          <Head n="05" title="The Name / Origin" dark />
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <h2 className="display-xl lg:col-span-8"><Lines lines={["Two scientists.", <span className="hero-sub">One name.</span>]} /></h2>
            <p className="body-copy reveal self-end text-paper/60 lg:col-span-4">GodHeimer carries the names of two physicists — one who reached for space, one who shaped modern defense. Both sides define what we build.</p>
          </div>
          <div className="mt-24 grid gap-10 md:grid-cols-2">
            <figure className="founder-card reveal" style={{ transitionDelay: "0ms" }}>
              <OriginPanel src={goddardImg.url} alt="Robert H. Goddard" code="GH-01" tag="SPACE" coords="42.2626° N / 71.8023° W" year="1926" />
              <figcaption className="mt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="display-lg">GOD</span>
                  <span className="mono text-paper/40">Space</span>
                </div>
                <p className="mono mono-lg mt-4 text-paper/70">Robert H. Goddard</p>
                <p className="body-copy mt-4 max-w-md text-paper/60">Father of modern rocket propulsion. He launched the first liquid-fueled rocket in 1926 and proved spaceflight was possible — the space technology side of GodHeimer.</p>
              </figcaption>
            </figure>
            <figure className="founder-card reveal" style={{ transitionDelay: "120ms" }}>
              <OriginPanel src={oppenheimerImg.url} alt="J. Robert Oppenheimer" code="GH-02" tag="DEFENSE" coords="35.8800° N / 106.3031° W" year="1943" />
              <figcaption className="mt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="display-lg">HEIMER</span>
                  <span className="mono text-paper/40">Defense</span>
                </div>
                <p className="mono mono-lg mt-4 text-paper/70">J. Robert Oppenheimer</p>
                <p className="body-copy mt-4 max-w-md text-paper/60">Theoretical physicist who led the Manhattan Project and founded the field of national defense science — the defense technology side of GodHeimer.</p>
              </figcaption>
            </figure>
          </div>
          <p className="body-copy reveal mt-16 max-w-3xl text-paper/60">Our startup works at the intersection of space technology and defense technology — so the name reads as one word in English, <span className="font-semibold text-paper">GodHeimer</span>: God + Heimer.</p>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section id="leadership" className="section-space border-t border-line-light bg-paper text-ink">
        <div className="site-container">
          <Head n="06" title="Founder & Leadership" />
          <div className="mt-16 grid items-end gap-12 lg:grid-cols-12">
            <div className="reveal flex items-end lg:col-span-3 lg:self-stretch"><Logo className="h-40 w-40 sm:h-64 sm:w-64 lg:h-full lg:w-auto lg:max-w-full" /></div>
            <div className="lg:col-span-9">
              <p className="mono mono-lg reveal mb-6 text-ink/50">Founder &amp; CEO, GodHeimer Technologies</p>
              <h2 className="display-lg"><Lines lines={["Natthakorn “Boss”", "Mueangsangsri"]} /></h2>
              <p className="body-copy reveal mt-8 max-w-xl text-ink/60">Building adaptive and resilient space-to-ground communication systems for the most demanding environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="section-space bg-ink pb-10">
        <div className="site-container">
          <Head n="07" title="Contact & Follow" dark />
          <div className="mt-16 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="display-xl"><Lines lines={["Get in touch."]} /></h2>
              <div className="reveal mt-14 flex flex-col items-start gap-5">
                {["boss@godheimer.com", "contact@godheimer.com"].map((e) => <a key={e} href={`mailto:${e}`} className="display-md u-link break-all">{e}<ArrowUpRight className="h-6 w-6 shrink-0" /></a>)}
              </div>
            </div>
            <div className="reveal lg:col-span-3 lg:col-start-10">
              <p className="mono mb-6 text-paper/40">Follow</p>
              <div className="flex flex-col">
                {[["Facebook", "facebook.com/godheimer"], ["Instagram", "instagram.com/godheimerhj"], ["X", "x.com/godheimerhj"], ["LinkedIn", "linkedin.com/company/godheimer"]].map(([n, u]) => (
                  <a key={n} href={`https://${u}`} target="_blank" rel="noreferrer" className="social-link mono flex items-center justify-between border-b border-line-dark py-4 text-paper/70"><span className="social-label"><Scramble text={n ?? ""} /></span><ArrowUpRight className="social-arrow h-4 w-4" /></a>
                ))}
              </div>
            </div>
          </div>
          <a href="#top" aria-label="Back to top" className="footer-mark mt-32 block">GODHEIMER</a>
          <div className="mono mt-10 flex flex-col justify-between gap-4 border-t border-line-dark pt-6 text-paper/40 md:flex-row">
            <span>© {new Date().getFullYear()} GodHeimer Technologies. All rights reserved.</span><Clock /><a href="#top" className="u-link"><Scramble text="Back to top ↑" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
