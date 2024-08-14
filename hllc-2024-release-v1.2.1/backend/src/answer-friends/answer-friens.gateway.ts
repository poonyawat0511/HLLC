import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessTokenService } from 'src/auth/access-token/access-token.service';
import { User } from 'src/users/schemas/user.schema';
import { AnswerFriendsService } from './answer-friends.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswerQues } from './schemas/answer-friends.schemas';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class AnswerFriendsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly answerFriend: AnswerFriendsService,
    private readonly tokenService: AccessTokenService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.answerFriend.setGateway(this);
  }

  async handleConnection(socket: Socket) {
    try {
      const [type, token] = socket.handshake.auth.token?.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new Error('Invalid authentication token');
      }
      const payload = await this.tokenService.verify(token);
      if (!payload.id) {
        throw new Error('Invalid authentication token');
      }
      const user = await this.answerFriend.getUserMeta(payload.id);
      if (!user) {
        throw new Error('Invalid authentication token');
      }
      console.log('Socket connected :', user.id);
      socket.join(user.id);
    } catch (error) {
      this.emitError(error.message);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('Socket disconnected:', socket.id);
    // Additional cleanup if needed
  }

  async emitError(error: string) {
    this.server.emit('error', error);
  }

  async emitAnswerRequest(answerQue: AnswerQues) {
    this.server
      .to(answerQue.receiver.toString())
      .emit('answerQue', answerQue);
  }
}
