"use client";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import styles from "./wallet-dialog.module.css";

type WalletDialogProps = {
  onClose: () => void;
};

/** Modal list of the wallets found in this browser. Choosing one connects it. */
export function WalletDialog({ onClose }: WalletDialogProps) {
  const { wallets, select } = useWallet();

  // Only wallets that can connect from here: installed, or loadable on demand.
  const available = wallets.filter(
    (wallet) =>
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable,
  );

  return (
    <Modal title="Connect a wallet" onClose={onClose}>
      <div className={styles.list}>
        <Label>
          {available.length > 0 ? "Detected wallets" : "No wallet detected"}
        </Label>
        {available.map((wallet) => (
          <button
            key={wallet.adapter.name}
            type="button"
            className={styles.row}
            onClick={() => {
              // The provider connects as soon as a wallet is selected.
              select(wallet.adapter.name);
              onClose();
            }}
          >
            <Image
              className={styles.icon}
              src={wallet.adapter.icon}
              alt=""
              width={36}
              height={36}
              unoptimized
            />
            <span className={styles.name}>{wallet.adapter.name}</span>
            <span className={styles.state}>DETECTED</span>
          </button>
        ))}
        {available.length === 0 ? (
          <p className={styles.note}>
            Install a Solana wallet extension, then reload this page.
          </p>
        ) : null}
      </div>
      <p className={styles.note}>
        Your keys stay in your wallet. solpr.dev never holds them.
      </p>
    </Modal>
  );
}
