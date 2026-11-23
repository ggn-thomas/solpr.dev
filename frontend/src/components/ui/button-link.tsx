import Link from "next/link";
import styles from "./button.module.css";

type ButtonLinkProps = {
  href: string;
  variant?: "primary" | "secondary";
  /** "header" is the tighter 16px button used in the page header. */
  size?: "default" | "header";
  /** Dashed outline with corner brackets instead of a solid border. */
  dashed?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** A link that looks like a Button: for actions that navigate. External hrefs get a plain <a>. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "default",
  dashed = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = [
    styles.button,
    styles.link,
    variant === "secondary" && styles.secondary,
    size === "header" && styles.header,
    dashed && styles.dashed,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
