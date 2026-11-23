import styles from "./data-label.module.css";

type DataLabelProps = {
  /** "KEY: VALUE" in capitals, e.g. "SENDER: HIDDEN". */
  text: string;
  /**
   * Where the rule leads to the tracking box: "left" (rule then tag),
   * "right" (tag then rule) or "above" (a bracket over the tag).
   * Set the rule length with the --data-label-line custom property.
   */
  rule?: "left" | "right" | "above";
  className?: string;
};

/** A mono tag joined by a 1px accent rule to a tracking box on the photo. Decoration only. */
export function DataLabel({ text, rule = "left", className }: DataLabelProps) {
  const classes = [styles.label, styles[rule], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <span className={styles.rule} />
      <span className={styles.tag}>{text}</span>
    </div>
  );
}
