import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/cluster-adapter';
import { setupWorker } from '@socket.io/sticky';

export class ClusterAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    try {
      server.adapter(createAdapter());
      setupWorker(server);
    } catch (error) {
      if (error.message == 'not worker') {
        console.log('Run server in single instance');
      } else {
        console.error(error);
      }
    }
    return server;
  }
}
