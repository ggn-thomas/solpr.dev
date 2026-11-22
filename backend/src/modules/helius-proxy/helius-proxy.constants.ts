/** Where a Helius RPC host serves the Privacy Rings indexer and prover. */
export const SPR_GATEWAY_PATH = '/v1/spr';

/** Query parameter Helius reads the API key from. */
export const API_KEY_QUERY_PARAM = 'api-key';

/**
 * JSON-RPC methods the frontend and the Privacy SDK need. Anything else is
 * refused so the server-side key cannot be used as a general Solana RPC.
 */
export const ALLOWED_RPC_METHODS: ReadonlySet<string> = new Set([
  'getAccountInfo',
  'getBalance',
  'getLatestBlockhash',
  'getMultipleAccounts',
  'getProgramAccounts',
  'getSignatureStatuses',
  'getSlot',
  'sendTransaction',
  'simulateTransaction',
]);

/** One path segment or more of letters, digits, "_" and "-": no dots, no traversal. */
export const SPR_PATH_PATTERN = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/;

/** Request headers relayed upstream, besides every "spr-" header. */
export const FORWARDED_REQUEST_HEADERS: ReadonlySet<string> = new Set([
  'accept',
  'content-type',
  'x-async',
  'x-sync',
]);

/** Response headers relayed back, besides every "spr-" header. */
export const FORWARDED_RESPONSE_HEADERS: ReadonlySet<string> = new Set([
  'content-type',
  'retry-after',
]);

/**
 * Prefix of the headers the SDK and the prover enclave exchange (attestation
 * version, encapsulated key, ciphertext). They must cross the proxy untouched.
 */
export const SPR_HEADER_PREFIX = 'spr-';

/** A proof-carrying request stays far below this; larger bodies are refused. */
export const MAX_BODY_BYTES = 8 * 1024 * 1024;

/** Proof generation is slow: the upstream gets two minutes before a 504. */
export const UPSTREAM_TIMEOUT_MS = 120_000;

export const RATE_LIMIT_WINDOW_MS = 60_000;
/** A wallet sync fans out into many indexer reads, hence the generous cap. */
export const RATE_LIMIT_MAX_REQUESTS = 600;
