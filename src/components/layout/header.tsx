import Link from "next/link";
import styles from "./header.module.css";

type HeaderProps = {
  /** Controls shown on the right, e.g. the connect button. */
  actions?: React.ReactNode;
};

export function Header({ actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>
        solpr.dev
      </Link>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
