"use client";

import { useEffect, useRef } from "react";
import { ringFrame } from "./ring-frame";
import styles from "./ring-field.module.css";

/** The mockup's starting time and step: 0.07 every 70ms. */
const START = 4;
const STEP = 0.07;
const INTERVAL_MS = 70;

/**
 * Two rings of characters crossing and turning, centred behind the content
 * of its positioned parent. Decoration only; still under reduced motion.
 */
export function RingField() {
  const gridRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let t = START;
    // Writes the text directly: a React render per frame would rebuild the
    // whole grid for nothing.
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      t += STEP;
      grid.textContent = ringFrame(t);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.stage} aria-hidden="true">
      <pre ref={gridRef} className={styles.grid}>
        {ringFrame(START)}
      </pre>
    </div>
  );
}
