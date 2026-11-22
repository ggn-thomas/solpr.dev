import { Label } from "./label";
import styles from "./field.module.css";

type FieldProps = Omit<React.ComponentProps<"input">, "id" | "size"> & {
  id: string;
  label: string;
  /** 52px tall instead of 60px, e.g. a search box. */
  compact?: boolean;
};

/** A text field (address, search) with its uppercase label above. */
export function Field({
  id,
  label,
  compact = false,
  type = "text",
  ...inputProps
}: FieldProps) {
  return (
    <div className={styles.group}>
      <Label htmlFor={id}>{label}</Label>
      <div className={`${styles.field} ${compact ? styles.compact : ""}`}>
        <input id={id} type={type} {...inputProps} />
      </div>
    </div>
  );
}
