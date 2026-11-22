"use client";

import { useState } from "react";
import { WalletStatus } from "@/features/wallet/components/wallet-status";
import { useTransferSession } from "../transfer-session-provider";
import { HistoryDialog } from "./history-dialog";

/** Header controls of the app: the wallet button, whose menu opens the transfer history. */
export function AccountControls() {
  const { action } = useTransferSession();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <WalletStatus onOpenHistory={() => setHistoryOpen(true)} />
      {historyOpen ? (
        <HistoryDialog
          initialAction={action}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}
    </>
  );
}
