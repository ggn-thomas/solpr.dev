import styles from "./field.module.css";

type FieldProps = Omit<React.ComponentProps<"input">, "id" | "size"> & {
  id: string;
  label: string;
  /** "amount" types at 26px, "address" at 15px. */
  size?: "amount" | "address";
  /** Controls shown inside the field, right of the input (chip, selector). */
  trailing?: React.ReactNode;
};

/** A 60px field for an amount or an address, with its uppercase label above. */
export function Field({
  id,
  label,
  size = "amount",
  trailing,
  type = "text",
  ...inputProps
}: FieldProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.field}>
        <input
          id={id}
          type={type}
          className={size === "address" ? styles.address : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
    </div>
  );
}
