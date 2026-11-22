import styles from "./tabs.module.css";

type TabsProps<T extends string> = {
  /** Accessible name of the group. */
  label: string;
  items: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** A row of equal-width toggle buttons that switches the form inside a panel. */
export function Tabs<T extends string>({
  label,
  items,
  value,
  onChange,
}: TabsProps<T>) {
  return (
    <div className={styles.tabs} role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={styles.tab}
          aria-pressed={item.value === value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
