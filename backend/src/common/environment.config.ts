import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

const DEFAULT_HELIUS_RPC_URL = 'https://devnet.helius-rpc.com';
const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:3000';
const DEFAULT_PORT = 4000;

/** Environment variables this backend reads, with their defaults. */
export class Environment {
  @IsString()
  @IsNotEmpty()
  HELIUS_API_KEY!: string;

  @IsUrl({ require_tld: false, protocols: ['https'] })
  HELIUS_RPC_URL: string = DEFAULT_HELIUS_RPC_URL;

  @IsUrl({ require_tld: false })
  FRONTEND_ORIGIN: string = DEFAULT_FRONTEND_ORIGIN;

  @IsInt()
  @Min(1)
  @Max(65_535)
  PORT: number = DEFAULT_PORT;
}

/**
 * Validates the process environment at startup so a missing Helius key stops
 * the boot instead of failing on the first relayed request.
 */
export function validateEnvironment(raw: Record<string, unknown>): Environment {
  const environment = plainToInstance(Environment, raw, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  const errors = validateSync(environment, { skipMissingProperties: false });
  if (errors.length > 0) {
    const fields = errors.map((error) => error.property).join(', ');
    throw new Error(`Invalid environment variables: ${fields}`);
  }
  return environment;
}
