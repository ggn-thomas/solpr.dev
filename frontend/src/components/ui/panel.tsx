import styles from "./panel.module.css";

type PanelProps = {
  className?: string;
  children: React.ReactNode;
};

/** The bordered box that holds a form over the photo. */
export function Panel({ className, children }: PanelProps) {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
