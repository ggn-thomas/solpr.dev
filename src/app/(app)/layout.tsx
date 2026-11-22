import { Header } from "@/components/layout/header";
import { ConnectWalletButton } from "@/features/wallet/components/connect-wallet-button";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header actions={<ConnectWalletButton size="header" />} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
