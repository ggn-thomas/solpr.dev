import { Header } from "@/components/layout/header";
import { AccountControls } from "@/features/privacy-transfers/components/account-controls";
import { TransferSessionProvider } from "@/features/privacy-transfers/transfer-session-provider";
import { WalletPickerProvider } from "@/features/wallet/wallet-picker-provider";
import { WalletContextProvider } from "@/providers/wallet-context-provider";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <WalletPickerProvider>
        <TransferSessionProvider>
          <div className={styles.shell}>
            <Header actions={<AccountControls />} />
            <main className={styles.main}>{children}</main>
          </div>
        </TransferSessionProvider>
      </WalletPickerProvider>
    </WalletContextProvider>
  );
}
