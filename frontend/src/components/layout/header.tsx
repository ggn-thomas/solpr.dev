import Link from "next/link";
import styles from "./header.module.css";

type HeaderProps = {
  /** Links shown in the middle, e.g. the landing page's bracketed nav. */
  nav?: React.ReactNode;
  /** Controls shown on the right, e.g. the connect button. */
  actions?: React.ReactNode;
};

export function Header({ nav, actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>
        solpr.dev
      </Link>
      {nav ? (
        <nav className={styles.nav} aria-label="Main">
          {nav}
        </nav>
      ) : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
