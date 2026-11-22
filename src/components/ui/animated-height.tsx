"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./animated-height.module.css";

type AnimatedHeightProps = {
  children: React.ReactNode;
};

/**
 * Follows the height of its content with a transition, so swapping the
 * content does not make the surrounding layout jump.
 */
export function AnimatedHeight({ children }: AnimatedHeightProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      setHeight(content.offsetHeight);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={styles.outer}
      style={height === null ? undefined : { height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
