import Image from "next/image";
import { DataLabel } from "@/components/decor/data-label";
import { PixelMask } from "@/components/decor/pixel-mask";
import { LANDING_MASK } from "../backdrop-data";
import styles from "./landing-photo.module.css";

/**
 * The landing photo under its pixel mask, with data labels wired to the
 * tracking boxes drawn in it. Behind the copy on wide screens, under it on phones.
 */
export function LandingPhoto() {
  return (
    <div className={styles.photo} aria-hidden="true">
      {/* This photo, not the app's, carries the tracking boxes the labels point at. */}
      <Image
        src="/images/crowd.png"
        alt=""
        fill
        preload
        sizes="(max-width: 760px) 100vw, 1302px"
        className={styles.image}
      />
      <PixelMask rows={LANDING_MASK} />
      <div className={styles.shade} />
      <DataLabel
        text="SENDER: HIDDEN"
        className={`${styles.hud} ${styles.sender}`}
      />
      <DataLabel
        text="AMOUNT: ENCRYPTED"
        className={`${styles.hud} ${styles.amount}`}
      />
      <DataLabel
        text="ASSET: HIDDEN"
        rule="right"
        className={`${styles.hud} ${styles.asset}`}
      />
      <DataLabel
        text="RECIPIENT: HIDDEN"
        rule="above"
        className={`${styles.hud} ${styles.recipient}`}
      />
    </div>
  );
}
