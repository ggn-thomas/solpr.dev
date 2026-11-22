import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { SelectButton } from "@/components/ui/select-button";
import styles from "./amount-field.module.css";

type AmountFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown before the typed value, "$" in dollar mode. */
  prefix: string;
  /** The same amount in the other unit, shown on the unit switch. */
  convertedLabel: string;
  unitSwitchLabel: string;
  onSwitchUnit: () => void;
  tokenSymbol: string;
  onOpenTokens: () => void;
  balanceLabel: string;
  /** The amount is above the balance: border and balance turn accent. */
  exceedsBalance: boolean;
  onMax: () => void;
};

/** Amount entry: value with unit switch, token selector, then balance and MAX below. */
export function AmountField({
  id,
  label,
  value,
  onChange,
  prefix,
  convertedLabel,
  unitSwitchLabel,
  onSwitchUnit,
  tokenSymbol,
  onOpenTokens,
  balanceLabel,
  exceedsBalance,
  onMax,
}: AmountFieldProps) {
  return (
    <div className={styles.group}>
      <Label htmlFor={id}>{label}</Label>
      <div className={`${styles.field} ${exceedsBalance ? styles.over : ""}`}>
        <div className={styles.entry}>
          <div className={styles.inputRow}>
            {prefix ? (
              <span className={styles.prefix} aria-hidden="true">
                {prefix}
              </span>
            ) : null}
            <input
              id={id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </div>
          <button
            type="button"
            className={styles.unit}
            aria-label={unitSwitchLabel}
            onClick={onSwitchUnit}
          >
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M3.5 10V2M3.5 2 1.5 4M3.5 2l2 2M8.5 2v8M8.5 10l-2-2M8.5 10l2-2" />
            </svg>
            {convertedLabel}
          </button>
        </div>
        <SelectButton
          badge={tokenSymbol.charAt(0)}
          aria-haspopup="dialog"
          onClick={onOpenTokens}
        >
          {tokenSymbol}
        </SelectButton>
      </div>
      <div className={styles.meta}>
        <span className={styles.balanceRow}>
          <span
            className={`${styles.balance} ${exceedsBalance ? styles.balanceOver : ""}`}
          >
            {balanceLabel}
          </span>
          <Chip aria-label="Use maximum amount" onClick={onMax}>
            MAX
          </Chip>
        </span>
      </div>
    </div>
  );
}
