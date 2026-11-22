import styles from "./transfer-details.module.css";

type TransferDetailsProps = {
  rows: readonly { term: string; value: string }[];
};

/** The key/value summary above the action button: route, rate, fee. */
export function TransferDetails({ rows }: TransferDetailsProps) {
  return (
    <dl className={styles.details}>
      {rows.map((row) => (
        <div key={row.term} className={styles.row}>
          <dt>{row.term}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
