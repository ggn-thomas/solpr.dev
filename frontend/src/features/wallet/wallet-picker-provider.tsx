"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { WalletDialog } from "./components/wallet-dialog";

type WalletPicker = {
  /** Opens the "Connect a wallet" dialog. */
  open: () => void;
};

const WalletPickerContext = createContext<WalletPicker | null>(null);

/** Owns the wallet picker dialog so any "Connect wallet" button can open it. */
export function WalletPickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  return (
    <WalletPickerContext.Provider value={value}>
      {children}
      {isOpen ? <WalletDialog onClose={() => setIsOpen(false)} /> : null}
    </WalletPickerContext.Provider>
  );
}

export function useWalletPicker(): WalletPicker {
  const value = useContext(WalletPickerContext);
  if (!value) {
    throw new Error("useWalletPicker must be used inside WalletPickerProvider");
  }
  return value;
}
