import styles from "./ascii-corner.module.css";

type AsciiCornerProps = {
  corner: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  lines: readonly string[];
};

const CORNER_CLASS = {
  "top-left": `${styles.left} ${styles.top}`,
  "bottom-left": `${styles.left} ${styles.bottom}`,
  "top-right": `${styles.right} ${styles.top}`,
  "bottom-right": `${styles.right} ${styles.bottom}`,
};

/** A wedge of ASCII characters anchored in a corner of its positioned parent. */
export function AsciiCorner({ corner, lines }: AsciiCornerProps) {
  return (
    <div
      className={`${styles.ascii} ${CORNER_CLASS[corner]}`}
      aria-hidden="true"
    >
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}
