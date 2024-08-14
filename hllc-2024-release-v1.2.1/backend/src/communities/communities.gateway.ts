import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { AccessTokenService } from 'src/auth/access-token/access-token.service';
import { ChatHistoriesService } from 'src/chat-histories/chat-histories.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class CommunitiesGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, { username: string; userId: string }> =
    new Map(); // Map<socketId, { username, userId }>

  constructor(
    private readonly tokenService: AccessTokenService,
    private readonly chatHistoriesService: ChatHistoriesService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      try {
        console.log('Handshake auth:', socket.handshake.auth);

        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication token not provided');
        }

        const [type, tokenValue] = token.split(' ');

        if (type !== 'Bearer' || !tokenValue) {
          throw new Error('Invalid authentication token');
        }

        const payload = await this.tokenService.verify(tokenValue);
        console.log('Payload:', payload);

        if (!payload || !payload.id) {
          throw new Error('Invalid authentication token');
        }
        console.log(
          `User ${payload.username} connected with socket ID ${socket.id}`,
        );
        // Store the user information in connectedUsers
        this.connectedUsers.set(socket.id, {
          username: payload.username,
          userId: payload.id,
        });

        this.updateUsersList(); // Update user list upon new connection
      } catch (error) {
        console.error(`Connection error: ${error.message}`);
        socket.disconnect();
      }

      socket.on('joinRoom', (room: string) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
        this.server.to(room).emit('onUserJoin', {
          username: this.connectedUsers.get(socket.id)?.username || 'Unknown',
          room,
        });
      });

      socket.on('leaveRoom', (room: string) => {
        socket.leave(room);
        console.log(`Socket ${socket.id} left room ${room}`);
        this.server.to(room).emit('onUserLeave', {
          username: this.connectedUsers.get(socket.id)?.username || 'Unknown',
          room,
        });
      });

      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        this.updateUsersList();
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private updateUsersList() {
    const usersList = Array.from(this.connectedUsers.entries()).map(
      ([id, user]) => ({ id, username: user.username }),
    );
    this.server.emit('usersUpdate', usersList);
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: { text: string; room: string }, // room is the roomName
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.connectedUsers.get(client.id)?.username || 'Unknown';
    const userId = this.connectedUsers.get(client.id)?.userId;

    console.log('Received message:', body, 'from', username);

    try {
      if (userId) {
        await this.chatHistoriesService.addMessage(
          body.room, // This is the roomName
          userId,
          body.text,
        );
        console.log('Message saved to the database:', body.text);
      } else {
        console.error('User ID not found for socket:', client.id);
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }

    client.broadcast.to(body.room).emit('onMessage', {
      text: body.text,
      username: username,
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  @SubscribeMessage('newSticker')
  onNewSticker(
    @MessageBody() body: { stickerId: string; username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received sticker:', body);
    client.to(body.room).emit('onSticker', {
      stickerId: body.stickerId,
      username: body.username,
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
    // Ensure the username is mapped correctly
    const username = this.connectedUsers.get(client.id)?.username || 'Unknown';
    console.log('User joined room:', username);
  }
}
