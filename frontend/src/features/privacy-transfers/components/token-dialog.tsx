"use client";

import Image from "next/image";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { formatUsd } from "../amounts";
import type { BalanceSide, Token } from "../types";
import styles from "./token-dialog.module.css";

type TokenDialogProps = {
  tokens: readonly Token[];
  selectedSymbol: string;
  /** Which balance to show on each row. */
  side: BalanceSide;
  /** Balances are only shown for a connected wallet. */
  connected: boolean;
  onSelect: (symbol: string) => void;
  onClose: () => void;
};

/** Modal token picker with search. Mount it to open it. */
export function TokenDialog({
  tokens,
  selectedSymbol,
  side,
  connected,
  onSelect,
  onClose,
}: TokenDialogProps) {
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const matches = tokens.filter(
    (token) =>
      !search ||
      token.symbol.toLowerCase().includes(search) ||
      token.name.toLowerCase().includes(search),
  );

  return (
    <Modal title="Select a token" onClose={onClose}>
      <Field
        id="token-search"
        label="Search"
        compact
        autoComplete="off"
        placeholder="Token name or address"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className={styles.list}>
        <Label>{connected ? `Your ${side} balances` : "Tokens"}</Label>
        {matches.map((token) => (
          <button
            key={token.symbol}
            type="button"
            className={styles.row}
            aria-pressed={token.symbol === selectedSymbol}
            onClick={() => onSelect(token.symbol)}
          >
            {token.icon ? (
              <Image
                className={styles.logo}
                src={token.icon}
                alt=""
                width={36}
                height={36}
              />
            ) : (
              <span className={styles.badge} aria-hidden="true">
                {token.symbol.charAt(0)}
              </span>
            )}
            <span className={styles.identity}>
              <span className={styles.name}>{token.name}</span>
              <span className={styles.sub}>
                {token.symbol} · {formatUsd(token.price)} each
              </span>
            </span>
            {connected ? (
              <span className={styles.holding}>
                <span className={styles.amount}>{token.balances[side]}</span>
                <span className={styles.sub}>
                  {formatUsd(token.balances[side] * token.price)}
                </span>
              </span>
            ) : null}
          </button>
        ))}
        {matches.length === 0 ? (
          <p className={styles.empty}>No token matches this search.</p>
        ) : null}
      </div>
    </Modal>
  );
}
