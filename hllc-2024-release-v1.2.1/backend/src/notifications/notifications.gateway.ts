import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './entities/notification.entity';
import { instanceToPlain } from 'class-transformer';
import { AccessTokenService } from 'src/auth/access-token/access-token.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { RecipientType } from './enums/notificaton-target.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly tokenService: AccessTokenService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.notificationService.setGateway(this);
  }

  async handleConnection(socket: Socket) {
    try {
      // Get authorization
      const [type, token] = socket.handshake.auth.token?.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new Error('Invalid authentication token');
      }
      // Verify token
      const payload = await this.tokenService.verify(token);
      if (!payload.id) {
        throw new Error('Invalid authentication token');
      }

      // Get user meta from token payload
      const user = await this.notificationService.getUserMeta(payload.id);
      if (!user) {
        throw new Error('Invalid authentication token');
      }

      // Join user rooms
      console.log('Socket connected :', user.id);

      socket.join('GLOBAL');
      socket.join(user.id);
      socket.join(`MAJOR:${user.major}`);
      socket.join(`SCHOOL:${user.school}`);
    } catch (error) {
      this.emitError(error.message);
    }
  }

  async emitError(error: string) {
    this.server.emit('error', error);
  }

  async emitNotification(notification: Notification) {
    const { recipients, ...data } = notification;
    const entity = instanceToPlain(new NotificationEntity(data));
    if (recipients === 'everyone') {
      this.server.to('GLOBAL').emit('notification', entity);
    } else {
      const target = recipients.map((recipient) => {
        return recipient.type === RecipientType.individual
          ? recipient.id.toString()
          : `${recipient.type}:${recipient.id}`;
      });
      this.server.to(target).emit('notification', entity);
    }
  }
}
