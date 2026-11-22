import type { TransferAction } from "./types";

/** The three actions as bracketed tab labels, shared by the panel and the history. */
export const TRANSFER_TABS: readonly {
  value: TransferAction;
  label: string;
}[] = [
  { value: "deposit", label: "[Deposit]" },
  { value: "send", label: "[Send]" },
  { value: "withdraw", label: "[Withdraw]" },
];
