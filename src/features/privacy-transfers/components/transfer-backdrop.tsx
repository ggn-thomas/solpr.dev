import Image from "next/image";
import { AsciiCorner } from "@/components/decor/ascii-corner";
import { PixelMask } from "@/components/decor/pixel-mask";
import {
  ASCII_BOTTOM_LEFT,
  ASCII_BOTTOM_RIGHT,
  ASCII_TOP_LEFT,
  ASCII_TOP_RIGHT,
  TRANSFER_MASK,
} from "../backdrop-data";
import styles from "./transfer-backdrop.module.css";

/** Photo, pixel mask, shade and the four ASCII corners behind the transfer screen. */
export function TransferBackdrop() {
  return (
    <>
      <div className={styles.photo} aria-hidden="true">
        <Image
          src="/images/crowd.png"
          alt=""
          fill
          preload
          sizes="1302px"
          className={styles.image}
        />
        <PixelMask rows={TRANSFER_MASK} />
        <div className={styles.shade} />
      </div>
      <AsciiCorner corner="top-left" lines={ASCII_TOP_LEFT} />
      <AsciiCorner corner="bottom-left" lines={ASCII_BOTTOM_LEFT} />
      <AsciiCorner corner="top-right" lines={ASCII_TOP_RIGHT} />
      <AsciiCorner corner="bottom-right" lines={ASCII_BOTTOM_RIGHT} />
    </>
  );
}
