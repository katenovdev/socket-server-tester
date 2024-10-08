import { Module } from '@nestjs/common';
import { StressTestController } from './stress.controller';
import { SocketService } from './socket.service';
import { EnvConfigModule } from './config/env-config.module';

@Module({
  imports: [EnvConfigModule],
  controllers: [StressTestController],
  providers: [SocketService],
})
export class AppModule {}
