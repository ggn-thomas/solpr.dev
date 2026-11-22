import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { ALLOWED_RPC_METHODS } from '../helius-proxy.constants.js';

/** A single JSON-RPC 2.0 call. Batches are not accepted. */
export class JsonRpcRequestDto {
  @ApiProperty({ example: '2.0' })
  @IsIn(['2.0'])
  jsonrpc!: string;

  @ApiProperty({ example: 1 })
  @IsDefined()
  id!: string | number;

  @ApiProperty({ example: 'getBalance' })
  @IsString()
  @IsIn([...ALLOWED_RPC_METHODS])
  method!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  params?: unknown;
}
