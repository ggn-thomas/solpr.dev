"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useWalletPicker } from "../wallet-picker-provider";
import { WalletMenu } from "./wallet-menu";

type WalletStatusProps = {
  onOpenHistory: () => void;
};

/** Header control: "Connect wallet", or the address button with its menu. */
export function WalletStatus({ onOpenHistory }: WalletStatusProps) {
  const { publicKey, connecting, disconnect } = useWallet();
  const picker = useWalletPicker();

  if (!publicKey) {
    return (
      <Button
        size="header"
        aria-disabled={connecting}
        onClick={connecting ? undefined : picker.open}
      >
        {connecting ? "Connecting" : "Connect wallet"}
      </Button>
    );
  }

  return (
    <WalletMenu
      address={publicKey.toBase58()}
      onOpenHistory={onOpenHistory}
      onDisconnect={() => {
        // A wallet may refuse or fail to disconnect; the adapter reports it.
        disconnect().catch(() => {});
      }}
    />
  );
}
