"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./wallet-menu.module.css";

type WalletMenuProps = {
  address: string;
  onOpenHistory: () => void;
  onDisconnect: () => void;
};

/** "96Qx…42nw" */
function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

/** The connected wallet: its short address, and a menu to copy it, open the history or disconnect. */
export function WalletMenu({
  address,
  onOpenHistory,
  onDisconnect,
}: WalletMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on a click outside or on Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // "Copied" goes back to "Copy address" after a moment.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      // Clipboard access was refused: leave the label unchanged.
    }
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.avatar} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span title={address}>{shortenAddress(address)}</span>
        <svg
          className={styles.chevron}
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      {open ? (
        <div className={styles.menu} role="menu" aria-label="Wallet">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={copyAddress}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4.5 4.5h7v7h-7z" />
              <path d="M9.5 4.5v-2h-7v7h2" />
            </svg>
            {copied ? "Copied" : "Copy address"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false);
              onOpenHistory();
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M7 3.5V7l2.5 1.5" />
              <path d="M1.5 7a5.5 5.5 0 1 0 1.8-4.1" />
              <path d="M1.5 1.5v2h2" />
            </svg>
            History
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.disconnect}`}
            onClick={() => {
              setOpen(false);
              onDisconnect();
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5.5 2.5h-3v9h3" />
              <path d="M5.5 7h6.5M9.5 4.5 12 7l-2.5 2.5" />
            </svg>
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
