import styles from "./button.module.css";

type ButtonProps = React.ComponentProps<"button"> & {
  /** "neutral" is the quiet grey button, e.g. Disconnect. */
  variant?: "primary" | "secondary" | "neutral";
  /** "header" is the tighter 16px button used in the page header. */
  size?: "default" | "header";
  /** Full width, 52px tall: closes a panel. */
  block?: boolean;
};

/**
 * Pass aria-disabled (not disabled) for an unavailable action: the button
 * stays focusable so its label, which says what is missing, can be read.
 */
export function Button({
  variant = "primary",
  size = "default",
  block = false,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    variant === "secondary" && styles.secondary,
    variant === "neutral" && styles.neutral,
    size === "header" && styles.header,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
