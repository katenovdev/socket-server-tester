import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { EnvConfigService } from './config/env-config.service';

@Injectable()
export class SocketService {
  private client: ClientProxy;

  constructor(private readonly configService: EnvConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.getKafkaClientId(),
          brokers: ['localhost:9092'],
          ssl: false,
          sasl: {
            mechanism: 'plain',
            username: configService.getKafkaUsername(),
            password: configService.getKafkaPassword(),
          },
        },
        producerOnlyMode: true,
        consumer: {
          groupId: 'test-group',
        },
      },
    });
  }

  public emit(event: string, data: any) {
    return this.client.emit(event, data);
  }
}
