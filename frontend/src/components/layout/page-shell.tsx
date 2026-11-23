import { Header } from "./header";
import styles from "./page-shell.module.css";

type PageShellProps = {
  /** Links shown in the middle of the header. */
  nav?: React.ReactNode;
  /** Controls shown on the right of the header. */
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/** Header on top and the page filling the rest of the window. */
export function PageShell({ nav, actions, children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <Header nav={nav} actions={actions} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
