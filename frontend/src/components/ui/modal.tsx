"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  title: string;
  /** Called on Escape, backdrop click or the Close button. */
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * A modal dialog with a title and a Close button, over a blurred backdrop.
 * Mount it to open it. Focus starts on the first input, if there is one.
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("input")?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // The dialog element itself is only hit on its backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.body}>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onClose}
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
              <path d="M2 2l10 10M12 2 2 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
