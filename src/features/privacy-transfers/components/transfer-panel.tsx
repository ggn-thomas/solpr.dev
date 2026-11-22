"use client";

import { useState } from "react";
import { AnimatedHeight } from "@/components/ui/animated-height";
import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { SelectButton } from "@/components/ui/select-button";
import { Tabs } from "@/components/ui/tabs";
import { ConnectWalletButton } from "@/features/wallet/components/connect-wallet-button";
import type { TransferAction } from "../types";
import styles from "./transfer-panel.module.css";

const TABS: readonly { value: TransferAction; label: string }[] = [
  { value: "deposit", label: "[Deposit]" },
  { value: "send", label: "[Send]" },
  { value: "withdraw", label: "[Withdraw]" },
];

const COPY: Record<TransferAction, { amountLabel: string; helper: string }> = {
  deposit: {
    amountLabel: "You deposit",
    helper: "Moves funds from your public balance to your private balance.",
  },
  send: {
    amountLabel: "You send",
    helper:
      "Sends from your private balance to any Solana address. Sender, recipient, asset and amount stay hidden.",
  },
  withdraw: {
    amountLabel: "You withdraw",
    helper:
      "Moves funds from your private balance back to your public balance.",
  },
};

/** Keeps digits and a single decimal point. */
function sanitizeAmount(input: string): string {
  const cleaned = input.replace(",", ".").replace(/[^\d.]/g, "");
  const [whole, ...decimals] = cleaned.split(".");
  return decimals.length > 0 ? `${whole}.${decimals.join("")}` : whole;
}

type TransferPanelProps = {
  className?: string;
};

export function TransferPanel({ className }: TransferPanelProps) {
  const [action, setAction] = useState<TransferAction>("send");
  const [amounts, setAmounts] = useState<Record<TransferAction, string>>({
    deposit: "",
    send: "",
    withdraw: "",
  });
  const [recipient, setRecipient] = useState("");

  const copy = COPY[action];

  return (
    <Panel className={className}>
      <Tabs label="Action" items={TABS} value={action} onChange={setAction} />
      <AnimatedHeight>
        <div key={action} className={styles.form}>
          <Field
            id={`${action}-amount`}
            label={copy.amountLabel}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amounts[action]}
            onChange={(event) =>
              setAmounts((current) => ({
                ...current,
                [action]: sanitizeAmount(event.target.value),
              }))
            }
            trailing={
              <>
                <Chip>MAX</Chip>
                <SelectButton>SOL</SelectButton>
              </>
            }
          />
          {action === "send" ? (
            <Field
              id="send-to"
              label="To"
              size="address"
              autoComplete="off"
              spellCheck={false}
              placeholder="Any Solana address"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
          ) : null}
          <p className={styles.helper}>{copy.helper}</p>
        </div>
      </AnimatedHeight>
      <ConnectWalletButton block withIcon />
    </Panel>
  );
}
