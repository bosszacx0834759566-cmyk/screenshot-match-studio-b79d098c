import { useEffect, useRef, useState, type PointerEvent } from "react";

type Props = { src: string; alt: string; code: string; tag: string; coords: string; year: string };

/** Full-bleed image panel: scroll-driven aperture reveal + parallax, and a HUD lens that follows the cursor. */
export function OriginPanel({ src, alt, code, tag, coords, year }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.4)));
      el.style.setProperty("--p", p.toFixed(3));
      raf = 0;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
    setPos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <div ref={ref} className="origin-panel" onPointerMove={move}>
      <div className="origin-aperture">
        <img src={src} alt={alt} loading="lazy" className="origin-img" />
        <img src={src} alt="" aria-hidden="true" className="origin-img origin-lens" />
        <div className="origin-scan" aria-hidden="true" />
        <div className="origin-grid" aria-hidden="true" />
      </div>
      <div className="origin-reticle" aria-hidden="true"><span /></div>
      <div className="origin-hud mono" aria-hidden="true">
        <span className="origin-hud-tl">{code} // {tag}</span>
        <span className="origin-hud-tr">{year}</span>
        <span className="origin-hud-bl">{coords}</span>
        <span className="origin-hud-br">X {String(pos.x).padStart(3, "0")} · Y {String(pos.y).padStart(3, "0")}</span>
      </div>
      <i className="origin-corner c1" /><i className="origin-corner c2" /><i className="origin-corner c3" /><i className="origin-corner c4" />
    </div>
  );
}
