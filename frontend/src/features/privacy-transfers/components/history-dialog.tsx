"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { TRANSFER_TABS } from "../transfer-tabs";
import type { TransferAction } from "../types";
import styles from "./history-dialog.module.css";

const COUNT_LABEL: Record<TransferAction, string> = {
  deposit: "DEPOSITS",
  send: "TRANSFERS",
  withdraw: "WITHDRAWALS",
};

type HistoryDialogProps = {
  /** The tab shown first: the action the user is currently on. */
  initialAction: TransferAction;
  onClose: () => void;
};

/**
 * Modal history of deposits, transfers and withdrawals. Mount it to open it.
 * Nothing is recorded yet in the frontend-only phase, so every tab is empty.
 */
export function HistoryDialog({ initialAction, onClose }: HistoryDialogProps) {
  const [action, setAction] = useState(initialAction);

  return (
    <Modal title="History" onClose={onClose}>
      <Tabs
        label="History type"
        items={TRANSFER_TABS}
        value={action}
        onChange={setAction}
      />
      <div className={styles.empty}>
        <div className={styles.count}>{COUNT_LABEL[action]}: 0</div>
        <p className={styles.message}>No history yet.</p>
      </div>
      <p className={styles.note}>
        History is read from this browser only. Clearing the browser data erases
        it.
      </p>
    </Modal>
  );
}
