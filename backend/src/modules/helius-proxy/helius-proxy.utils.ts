import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { IncomingHttpHeaders } from 'node:http';
import { JsonRpcRequestDto } from './dto/json-rpc-request.dto.js';
import {
  FORWARDED_REQUEST_HEADERS,
  FORWARDED_RESPONSE_HEADERS,
  SPR_HEADER_PREFIX,
  SPR_PATH_PATTERN,
} from './helius-proxy.constants.js';

/**
 * Parses and validates a JSON-RPC body. Rejects batches, malformed JSON and
 * methods outside the allow-list.
 */
export async function parseJsonRpcRequest(
  body: Buffer | undefined,
): Promise<JsonRpcRequestDto> {
  const payload = parseJson(body);
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    throw new BadRequestException('Expected a single JSON-RPC request object');
  }
  const request = plainToInstance(JsonRpcRequestDto, payload);
  const errors = await validate(request);
  if (errors.length > 0) {
    throw new BadRequestException('Invalid or unsupported JSON-RPC request');
  }
  return request;
}

function parseJson(body: Buffer | undefined): unknown {
  if (body === undefined) {
    throw new BadRequestException('Missing request body');
  }
  try {
    return JSON.parse(body.toString('utf8')) as unknown;
  } catch {
    throw new BadRequestException('Request body is not valid JSON');
  }
}

/** Joins a wildcard route match into a path and refuses anything but plain segments. */
export function parseSprPath(segments: string | string[]): string {
  const path = Array.isArray(segments) ? segments.join('/') : segments;
  if (!SPR_PATH_PATTERN.test(path)) {
    throw new BadRequestException('Invalid Privacy Rings path');
  }
  return path;
}

/** Keeps only the request headers the upstream needs. Cookies and auth never leave. */
export function pickRequestHeaders(
  headers: IncomingHttpHeaders,
): Record<string, string> {
  const forwarded: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    if (
      typeof value === 'string' &&
      isForwarded(name, FORWARDED_REQUEST_HEADERS)
    ) {
      forwarded[name] = value;
    }
  }
  return forwarded;
}

/** Keeps only the upstream headers the SDK reads. */
export function pickResponseHeaders(headers: Headers): Record<string, string> {
  const forwarded: Record<string, string> = {};
  headers.forEach((value, name) => {
    if (isForwarded(name, FORWARDED_RESPONSE_HEADERS)) {
      forwarded[name] = value;
    }
  });
  return forwarded;
}

function isForwarded(name: string, allowed: ReadonlySet<string>): boolean {
  const lowerName = name.toLowerCase();
  return allowed.has(lowerName) || lowerName.startsWith(SPR_HEADER_PREFIX);
}
