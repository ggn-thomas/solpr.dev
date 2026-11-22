import styles from "./button.module.css";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  /** "header" is the tighter 16px button used in the page header. */
  size?: "default" | "header";
  /** Full width, 52px tall: closes a panel. */
  block?: boolean;
};

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
    size === "header" && styles.header,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
