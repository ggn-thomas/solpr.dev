"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

/** Custom RPC when set, otherwise the public devnet endpoint. */
const ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl("devnet");

/**
 * No legacy adapters: every wallet that implements the Solana Wallet Standard
 * (Phantom, Solflare, Backpack and others) or the Mobile Wallet Adapter
 * protocol is detected automatically.
 */
const LEGACY_ADAPTERS: never[] = [];

/**
 * Solana connection and wallet state for the app. Read it with useWallet()
 * and useConnection() from @solana/wallet-adapter-react. With autoConnect,
 * selecting a wallet connects it, and the last wallet reconnects on reload.
 */
export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={LEGACY_ADAPTERS} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
