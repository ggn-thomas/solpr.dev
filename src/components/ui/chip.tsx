import styles from "./chip.module.css";

type ChipProps = React.ComponentProps<"button">;

/** Small outlined action that sits inside a field, e.g. MAX. */
export function Chip({ type = "button", className, ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
