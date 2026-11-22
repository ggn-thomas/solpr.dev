import styles from "./select-button.module.css";

type SelectButtonProps = React.ComponentProps<"button">;

/** A selector trigger: its current value followed by a chevron. */
export function SelectButton({
  type = "button",
  className,
  children,
  ...props
}: SelectButtonProps) {
  return (
    <button
      type={type}
      className={[styles.select, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </button>
  );
}
