import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#";

/** Text that scrambles on hover of its parent element, then resolves left to right. */
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = el?.parentElement;
    if (!el || !target) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const perChar = 22; // ms before each next letter locks in
      const lead = 90; // ms of pure shuffling first
      let last = 0;
      // Lock the width so the link doesn't shake while letters change.
      el.style.width = `${el.offsetWidth}px`;
      const tick = (now: number) => {
        const t = now - start;
        if (now - last < 45 && t > 0) {
          raf = requestAnimationFrame(tick);
          return;
        }
        last = now;
        const locked = Math.floor(Math.max(0, t - lead) / perChar);
        el.textContent = text
          .split("")
          .map((c, i) => (i < locked || c === " " ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("");
        if (locked < text.length) raf = requestAnimationFrame(tick);
        else {
          el.textContent = text;
          el.style.width = "";
        }
      };
      raf = requestAnimationFrame(tick);
    };
    target.addEventListener("mouseenter", run);
    return () => {
      target.removeEventListener("mouseenter", run);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} aria-label={text} className="inline-block overflow-hidden whitespace-nowrap align-bottom">
      {text}
    </span>
  );
}
