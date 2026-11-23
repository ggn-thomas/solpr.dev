import { PageShell } from "@/components/layout/page-shell";
import { AccountControls } from "@/features/privacy-transfers/components/account-controls";
import { TransferSessionProvider } from "@/features/privacy-transfers/transfer-session-provider";
import { WalletPickerProvider } from "@/features/wallet/wallet-picker-provider";
import { WalletContextProvider } from "@/providers/wallet-context-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <WalletPickerProvider>
        <TransferSessionProvider>
          <PageShell actions={<AccountControls />}>{children}</PageShell>
        </TransferSessionProvider>
      </WalletPickerProvider>
    </WalletContextProvider>
  );
}
