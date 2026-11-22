/** The three moves between a public and a private balance. */
export type TransferAction = "deposit" | "send" | "withdraw";

/** Which of the user's two balances an action spends from. */
export type BalanceSide = "public" | "private";

export type Token = {
  symbol: string;
  name: string;
  /** Price of one token in US dollars. */
  price: number;
  balances: Record<BalanceSide, number>;
};
