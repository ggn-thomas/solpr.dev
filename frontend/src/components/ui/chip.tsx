import styles from "./chip.module.css";

type ChipProps = React.ComponentProps<"button">;

/** Small outlined action, e.g. MAX. The visible box is 26px; the hit area is 44px. */
export function Chip({
  type = "button",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      {...props}
    >
      <span className={styles.box}>{children}</span>
    </button>
  );
}
