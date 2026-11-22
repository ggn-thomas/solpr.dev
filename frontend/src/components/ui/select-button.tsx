import styles from "./select-button.module.css";

type SelectButtonProps = React.ComponentProps<"button"> & {
  /** One character shown in a small outlined square before the value. */
  badge?: string;
};

/** A selector trigger: an optional badge, the current value, then a chevron. */
export function SelectButton({
  type = "button",
  badge,
  className,
  children,
  ...props
}: SelectButtonProps) {
  const classes = [styles.select, badge && styles.withBadge, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {badge ? (
        <span className={styles.badge} aria-hidden="true">
          {badge}
        </span>
      ) : null}
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
