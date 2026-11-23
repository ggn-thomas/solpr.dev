import { AsciiCorner } from "@/components/decor/ascii-corner";
import {
  LANDING_ASCII_BOTTOM_LEFT,
  LANDING_ASCII_BOTTOM_RIGHT,
  LANDING_ASCII_TOP_LEFT,
} from "../backdrop-data";
import styles from "./landing-ascii.module.css";

/** The three ASCII corners of the landing hero (none top right). */
export function LandingAscii() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <AsciiCorner corner="top-left" lines={LANDING_ASCII_TOP_LEFT} />
      <AsciiCorner corner="bottom-left" lines={LANDING_ASCII_BOTTOM_LEFT} />
      <AsciiCorner corner="bottom-right" lines={LANDING_ASCII_BOTTOM_RIGHT} />
    </div>
  );
}
