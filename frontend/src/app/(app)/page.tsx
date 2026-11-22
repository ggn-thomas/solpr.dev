import type { Metadata } from "next";
import { TransferBackdrop } from "@/features/privacy-transfers/components/transfer-backdrop";
import { TransferPanel } from "@/features/privacy-transfers/components/transfer-panel";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Send privately | solpr.dev",
};

const RESOURCES = [
  { label: "[Analytics]", href: "#" },
  { label: "[Docs]", href: "https://www.helius.dev/docs/privacy" },
  { label: "[Github]", href: "#" },
  { label: "[Telegram]", href: "#" },
];

export default function TransferPage() {
  return (
    <section className={styles.hero}>
      <TransferBackdrop />
      <div className={styles.content}>
        <div className={styles.spacer} aria-hidden="true" />
        <p className={`${styles.eyebrow} ${styles.rise} ${styles.d1}`}>
          {"// Powered by Solana Privacy Rings"}
        </p>
        <h1 className={`${styles.headline} ${styles.rise} ${styles.d2}`}>
          Send [privately.]
        </h1>
        <TransferPanel className={`${styles.rise} ${styles.d3}`} />
        <div className={styles.footer}>
          <nav className={styles.resources} aria-label="Resources">
            {RESOURCES.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
