import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from '../../common/environment.config.js';
import {
  API_KEY_QUERY_PARAM,
  SPR_GATEWAY_PATH,
  UPSTREAM_TIMEOUT_MS,
} from './helius-proxy.constants.js';
import type { SprRequest, UpstreamResponse } from './helius-proxy.interface.js';
import { pickResponseHeaders } from './helius-proxy.utils.js';

const JSON_HEADERS = {
  accept: 'application/json',
  'content-type': 'application/json',
};

@Injectable()
export class HeliusProxyService {
  private readonly logger = new Logger(HeliusProxyService.name);

  constructor(private readonly config: ConfigService<Environment, true>) {}

  /**
   * Relays an already validated JSON-RPC call to the Helius Solana RPC.
   * @param body The raw request body, sent on unchanged.
   */
  async forwardRpc(body: Buffer): Promise<UpstreamResponse> {
    const url = this.buildUrl('', new URLSearchParams());
    return this.send(url, { method: 'POST', headers: JSON_HEADERS, body });
  }

  /**
   * Relays a Privacy Rings indexer or prover call. Prover payloads are
   * encrypted by the SDK for the enclave, so they are passed through opaque.
   */
  async forwardSpr(request: SprRequest): Promise<UpstreamResponse> {
    const url = this.buildUrl(
      `${SPR_GATEWAY_PATH}/${request.path}`,
      request.query,
    );
    return this.send(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  }

  /** The caller's query is kept, except any API key it tried to supply. */
  private buildUrl(path: string, query: URLSearchParams): URL {
    const url = new URL(
      path,
      this.config.get('HELIUS_RPC_URL', { infer: true }),
    );
    query.forEach((value, name) => url.searchParams.append(name, value));
    url.searchParams.set(
      API_KEY_QUERY_PARAM,
      this.config.get('HELIUS_API_KEY', { infer: true }),
    );
    return url;
  }

  private async send(url: URL, init: RequestInit): Promise<UpstreamResponse> {
    const response = await this.fetchUpstream(url, init);
    return {
      status: response.status,
      headers: pickResponseHeaders(response.headers),
      body: Buffer.from(await response.arrayBuffer()),
    };
  }

  private async fetchUpstream(url: URL, init: RequestInit): Promise<Response> {
    try {
      return await fetch(url, {
        ...init,
        redirect: 'error',
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
    } catch (error) {
      // The URL holds the API key: log the path only.
      this.logger.error(
        `Helius request failed: ${init.method} ${url.pathname}`,
      );
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new GatewayTimeoutException('Helius did not answer in time');
      }
      throw new BadGatewayException('Helius is unreachable');
    }
  }
}
