import { Controller, Get } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { SocketService } from './socket.service';

@Controller('stress-test')
export class StressTestController {
  private clients: Socket[] = [];
  private numberOfClients = 10;

  constructor(private readonly socketService: SocketService) {
    this.initializeClients();
  }

  private initializeClients() {
    for (let i = 0; i < this.numberOfClients; i++) {
      const client = io('http://localhost:1900');

      client.on('connect', () => {
        console.log(`Client ${i + 1} connected to socket server`);
      });

      client.on(`TEST_EVENT_${i + 1}`, (data) => {
        console.log(
          `Client ${i + 1} received event: TEST_EVENT_${i + 1}`,
          data,
        );
      });

      this.clients.push(client);
    }
  }

  @Get('start')
  async startStressTest() {
    this.clients.forEach((client, index) => {
      const event = `socket-event`;
      this.socketService.emit(event, {event: `TEST_EVENT_${index + 1}`});
      console.log(`Client ${index + 1} emitted event: ${event}`);
    });

    return {
      message: 'Stress test started',
      numberOfClients: this.numberOfClients,
    };
  }
}
