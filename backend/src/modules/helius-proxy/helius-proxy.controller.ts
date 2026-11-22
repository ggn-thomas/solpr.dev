import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import type { UpstreamResponse } from './helius-proxy.interface.js';
import { HeliusProxyService } from './helius-proxy.service.js';
import {
  parseJsonRpcRequest,
  parseSprPath,
  pickRequestHeaders,
} from './helius-proxy.utils.js';

@ApiTags('helius')
@Controller({ path: 'helius', version: '1' })
export class HeliusProxyController {
  constructor(private readonly proxy: HeliusProxyService) {}

  @Post('rpc')
  @ApiOperation({ summary: 'Relay an allow-listed Solana JSON-RPC call' })
  async relayRpc(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const rpcRequest = await parseJsonRpcRequest(readBody(request));
    reply(response, await this.proxy.forwardRpc(rpcRequest));
  }

  @Get('spr/*path')
  @ApiOperation({ summary: 'Relay a Privacy Rings indexer or prover read' })
  async relaySprGet(
    @Param('path') path: string | string[],
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    reply(response, await this.relaySpr('GET', path, request));
  }

  @Post('spr/*path')
  @ApiOperation({ summary: 'Relay a Privacy Rings indexer or prover call' })
  async relaySprPost(
    @Param('path') path: string | string[],
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    reply(response, await this.relaySpr('POST', path, request));
  }

  private relaySpr(
    method: 'GET' | 'POST',
    path: string | string[],
    request: Request,
  ): Promise<UpstreamResponse> {
    return this.proxy.forwardSpr({
      method,
      path: parseSprPath(path),
      query: new URL(request.originalUrl, 'http://localhost').searchParams,
      headers: pickRequestHeaders(request.headers),
      body: method === 'POST' ? readBody(request) : undefined,
    });
  }
}

/** The raw body parser leaves an empty object when no body was sent. */
function readBody(request: Request): Buffer | undefined {
  return Buffer.isBuffer(request.body) ? request.body : undefined;
}

function reply(response: Response, upstream: UpstreamResponse): void {
  response.status(upstream.status).set(upstream.headers).send(upstream.body);
}
