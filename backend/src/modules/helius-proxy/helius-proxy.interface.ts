/** A Privacy Rings indexer or prover call to relay as received. */
export interface SprRequest {
  method: 'GET' | 'POST';
  /** Path below the gateway, already validated, e.g. "prove/abc/status". */
  path: string;
  query: URLSearchParams;
  headers: Record<string, string>;
  body?: Buffer;
}

/** What the upstream answered, reduced to what is relayed to the caller. */
export interface UpstreamResponse {
  status: number;
  headers: Record<string, string>;
  body: Buffer;
}
