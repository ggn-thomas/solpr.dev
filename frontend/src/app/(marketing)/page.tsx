import { ButtonLink } from "@/components/ui/button-link";
import { LandingAscii } from "@/features/landing/components/landing-ascii";
import { LandingPhoto } from "@/features/landing/components/landing-photo";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <section className={styles.hero}>
      <LandingAscii />
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.rise} ${styles.d1}`}>
            {"//Built on Solana"}
          </p>
          <h1 className={`${styles.headline} ${styles.rise} ${styles.d2}`}>
            Your money.
            <span className={styles.line}>Your rules</span>
          </h1>
          <p className={`${styles.lead} ${styles.rise} ${styles.d3}`}>
            Private transfers for any Solana asset. Zero-knowledge proofs hide
            the sender, the recipient, the asset and the amount, and your keys
            never leave your wallet.
          </p>
          <div className={`${styles.actions} ${styles.rise} ${styles.d4}`}>
            <ButtonLink href="/app" dashed className={styles.cta}>
              Send privately
            </ButtonLink>
            <ButtonLink
              href="https://www.helius.dev/privacy"
              variant="secondary"
              dashed
              className={styles.cta}
            >
              Docs
            </ButtonLink>
          </div>
        </div>
        <LandingPhoto />
      </div>
    </section>
  );
}
