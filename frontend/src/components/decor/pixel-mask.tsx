import styles from "./pixel-mask.module.css";

type PixelMaskProps = {
  /** One string per row; "#" draws a black square, any other character leaves the photo visible. */
  rows: readonly string[];
};

/** The black mass of equal squares that erodes the photo. Fills its positioned parent. */
export function PixelMask({ rows }: PixelMaskProps) {
  const columns = rows[0]?.length ?? 0;

  // Merge each horizontal run of squares into one rect.
  const runs: { x: number; y: number; width: number }[] = [];
  rows.forEach((row, y) => {
    let start = -1;
    for (let x = 0; x <= row.length; x++) {
      const filled = row[x] === "#";
      if (filled && start === -1) start = x;
      if (!filled && start !== -1) {
        runs.push({ x: start, y, width: x - start });
        start = -1;
      }
    }
  });

  return (
    <svg
      className={styles.mask}
      aria-hidden="true"
      viewBox={`0 0 ${columns} ${rows.length}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
    >
      {runs.map((run) => (
        <rect
          key={`${run.x}-${run.y}`}
          x={run.x}
          y={run.y}
          width={run.width}
          height={1}
        />
      ))}
    </svg>
  );
}
