"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { AnimatedHeight } from "@/components/ui/animated-height";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { Tabs } from "@/components/ui/tabs";
import { useWalletPicker } from "@/features/wallet/wallet-picker-provider";
import {
  formatTokenAmount,
  formatUsd,
  parseAmount,
  sanitizeAmount,
} from "../amounts";
import { MOCK_TOKENS } from "../mock-tokens";
import { useTransferSession } from "../transfer-session-provider";
import { TRANSFER_TABS } from "../transfer-tabs";
import type { BalanceSide, TransferAction } from "../types";
import { AmountField } from "./amount-field";
import { TokenDialog } from "./token-dialog";
import { TransferDetails } from "./transfer-details";
import styles from "./transfer-panel.module.css";

const ACTIONS: readonly TransferAction[] = ["deposit", "send", "withdraw"];

const COPY: Record<
  TransferAction,
  { amountLabel: string; submit: string; route: string; side: BalanceSide }
> = {
  deposit: {
    amountLabel: "You deposit",
    submit: "Deposit",
    route: "PUBLIC → PRIVATE",
    side: "public",
  },
  send: {
    amountLabel: "You send",
    submit: "Send privately",
    route: "PRIVATE → RECIPIENT",
    side: "private",
  },
  withdraw: {
    amountLabel: "You withdraw",
    submit: "Withdraw",
    route: "PRIVATE → PUBLIC",
    side: "private",
  },
};

const SIDE_NAME: Record<BalanceSide, string> = {
  public: "Public",
  private: "Private",
};

type TransferPanelProps = {
  className?: string;
};

export function TransferPanel({ className }: TransferPanelProps) {
  const { connected } = useWallet();
  const walletPicker = useWalletPicker();
  const { action, setAction } = useTransferSession();
  const [amounts, setAmounts] = useState<Record<TransferAction, string>>({
    deposit: "",
    send: "",
    withdraw: "",
  });
  const [recipient, setRecipient] = useState("");
  const [usdMode, setUsdMode] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState(MOCK_TOKENS[0].symbol);
  const [tokensOpen, setTokensOpen] = useState(false);

  const token =
    MOCK_TOKENS.find((item) => item.symbol === tokenSymbol) ?? MOCK_TOKENS[0];
  const { amountLabel, submit, route, side } = COPY[action];
  const balance = token.balances[side];
  const amount = parseAmount(amounts[action], usdMode, token.price);
  const exceedsBalance =
    connected && amount.valid && amount.tokens > balance + 1e-9;

  function setAmount(value: string) {
    setAmounts((current) => ({ ...current, [action]: value }));
  }

  /** Switches between token and dollar entry, converting what is already typed. */
  function switchUnit() {
    setAmounts((current) => {
      const next = { ...current };
      for (const key of ACTIONS) {
        const typed = parseAmount(current[key], usdMode, token.price);
        if (typed.valid) {
          next[key] = usdMode
            ? formatTokenAmount(typed.tokens)
            : (typed.tokens * token.price).toFixed(2);
        }
      }
      return next;
    });
    setUsdMode((current) => !current);
  }

  function fillMax() {
    if (!connected) return;
    setAmount(
      usdMode
        ? (Math.floor(balance * token.price * 100) / 100).toFixed(2)
        : String(balance),
    );
  }

  // The button says what is missing; it only acts to connect (nothing is sent yet).
  let submitLabel = submit;
  let submitBlocked = false;
  if (!connected) {
    submitLabel = "Connect wallet";
  } else if (!amount.valid) {
    submitLabel = "Enter an amount";
    submitBlocked = true;
  } else if (exceedsBalance) {
    submitLabel = `Insufficient ${side} balance`;
    submitBlocked = true;
  } else if (action === "send" && !recipient.trim()) {
    submitLabel = "Enter a recipient";
    submitBlocked = true;
  }

  return (
    <>
      <Panel className={className}>
      <Tabs
        label="Action"
        items={TRANSFER_TABS}
        value={action}
        onChange={setAction}
      />
      <AnimatedHeight>
        <div key={action} className={styles.form}>
          <AmountField
            id={`${action}-amount`}
            label={amountLabel}
            value={amounts[action]}
            onChange={(value) => setAmount(sanitizeAmount(value))}
            prefix={usdMode ? "$" : ""}
            convertedLabel={
              usdMode
                ? `${formatTokenAmount(amount.tokens)} ${token.symbol}`
                : formatUsd(amount.tokens * token.price)
            }
            unitSwitchLabel={
              usdMode
                ? `Switch to entering an amount in ${token.symbol}`
                : "Switch to entering an amount in dollars"
            }
            onSwitchUnit={switchUnit}
            tokenSymbol={token.symbol}
            tokenIcon={token.icon}
            onOpenTokens={() => setTokensOpen(true)}
            balanceLabel={
              connected
                ? `${SIDE_NAME[side]} balance: ${balance} ${token.symbol}`
                : "Wallet not connected"
            }
            exceedsBalance={exceedsBalance}
            onMax={fillMax}
          />
          {action === "send" ? (
            <Field
              id="send-to"
              label="To"
              autoComplete="off"
              spellCheck={false}
              placeholder="Any Solana address"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
          ) : null}
        </div>
      </AnimatedHeight>
      <TransferDetails
        rows={[
          { term: "Route", value: route },
          {
            term: "Rate",
            value: `1 ${token.symbol} = ${formatUsd(token.price)}`,
          },
          // Placeholder from the mockup: no fee is published yet.
          { term: "Network fee", value: "[FEE]" },
        ]}
      />
      <Button
        block
        aria-disabled={submitBlocked}
        onClick={connected ? undefined : walletPicker.open}
      >
        {submitLabel}
      </Button>
      </Panel>
      {/* Outside the panel: the dialog must not inherit its compact spacing. */}
      {tokensOpen ? (
        <TokenDialog
          tokens={MOCK_TOKENS}
          selectedSymbol={token.symbol}
          side={side}
          connected={connected}
          onSelect={(symbol) => {
            setTokenSymbol(symbol);
            setTokensOpen(false);
          }}
          onClose={() => setTokensOpen(false)}
        />
      ) : null}
    </>
  );
}
