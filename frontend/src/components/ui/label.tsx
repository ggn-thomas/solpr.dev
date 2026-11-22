import styles from "./label.module.css";

type LabelProps = {
  /** Id of the input this labels. Without it the label renders as a plain caption. */
  htmlFor?: string;
  children: React.ReactNode;
};

/** The uppercase mono caption above a field or a list. */
export function Label({ htmlFor, children }: LabelProps) {
  return htmlFor ? (
    <label className={styles.label} htmlFor={htmlFor}>
      {children}
    </label>
  ) : (
    <div className={styles.label}>{children}</div>
  );
}
