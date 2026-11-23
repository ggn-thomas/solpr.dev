import type { Token } from "./types";

/**
 * Example data from the mockup. Prices and balances are placeholders, not
 * live values: replace with wallet and Privacy API data in the backend phase.
 */
export const MOCK_TOKENS: readonly Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "/images/sol.png",
    price: 70.27,
    balances: { public: 0.0814, private: 0.05 },
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1,
    balances: { public: 95.573, private: 20 },
  },
];
