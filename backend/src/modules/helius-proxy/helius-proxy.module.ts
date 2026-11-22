import { Module } from '@nestjs/common';
import { HeliusProxyController } from './helius-proxy.controller.js';
import { HeliusProxyService } from './helius-proxy.service.js';

/**
 * The only place that calls Helius live. It exists so the API key stays
 * server-side; it holds no user keys and stores nothing.
 */
@Module({
  controllers: [HeliusProxyController],
  providers: [HeliusProxyService],
})
export class HeliusProxyModule {}
