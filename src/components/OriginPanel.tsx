import { useEffect, useRef } from "react";

type Props = { src: string; alt: string; code: string; tag: string; coords: string; year: string };

/** Full-bleed image panel with a scroll-driven aperture reveal and parallax. */
export function OriginPanel({ src, alt, code, tag, coords, year }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="origin-panel">
      <div className="origin-aperture">
        <img src={src} alt={alt} loading="lazy" className="origin-img" />
      </div>
      <div className="origin-hud mono" aria-hidden="true">
        <span className="origin-hud-tl">{code} // {tag}</span>
        <span className="origin-hud-tr">{year}</span>
        <span className="origin-hud-bl">{coords}</span>
      </div>
    </div>
  );
}
