import { Button } from "@/components/ui/button";

type ConnectWalletButtonProps = {
  size?: "default" | "header";
  block?: boolean;
  /** Show the wallet icon before the label (panel button). */
  withIcon?: boolean;
};

/**
 * Frontend-only phase: the button is drawn but does nothing yet.
 * Wallet connection is wired here when the wallet provider lands.
 */
export function ConnectWalletButton({
  size,
  block,
  withIcon = false,
}: ConnectWalletButtonProps) {
  return (
    <Button size={size} block={block}>
      {withIcon ? (
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2.5 5.5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h9.5" />
          <path d="M11.5 10.5h1.5" />
        </svg>
      ) : null}
      Connect wallet
    </Button>
  );
}
