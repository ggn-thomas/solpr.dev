"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { TransferAction } from "./types";

type TransferSession = {
  /** The tab the transfer panel is on. */
  action: TransferAction;
  setAction: (action: TransferAction) => void;
};

const TransferSessionContext = createContext<TransferSession | null>(null);

/**
 * Shares the current transfer action between the panel and the header, so
 * the history opens on the tab the user is looking at.
 */
export function TransferSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [action, setAction] = useState<TransferAction>("send");
  const value = useMemo(() => ({ action, setAction }), [action]);

  return (
    <TransferSessionContext.Provider value={value}>
      {children}
    </TransferSessionContext.Provider>
  );
}

export function useTransferSession(): TransferSession {
  const value = useContext(TransferSessionContext);
  if (!value) {
    throw new Error(
      "useTransferSession must be used inside TransferSessionProvider",
    );
  }
  return value;
}
