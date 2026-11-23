import styles from "./select-button.module.css";

type SelectButtonProps = React.ComponentProps<"button"> & {
  /** One character shown in a small outlined square before the value. */
  badge?: string;
  /** An image shown before the value, in place of the badge. */
  icon?: React.ReactNode;
};

/** A selector trigger: an optional icon or badge, the current value, then a chevron. */
export function SelectButton({
  type = "button",
  badge,
  icon,
  className,
  children,
  ...props
}: SelectButtonProps) {
  const classes = [
    styles.select,
    (badge || icon) && styles.withBadge,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : badge ? (
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
