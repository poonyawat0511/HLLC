import { Module, forwardRef } from '@nestjs/common';
import { PosttestsService } from './posttests.service';
import { PosttestsController } from './posttests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posttest, PosttestSchema } from './schemas/posttest.schema';
import { UsersModule } from 'src/users/users.module';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './postttests.premissions';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posttest.name, schema: PosttestSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AssessmentsModule),
    CaslModule.forFeature({ permissions }),
    NotificationsModule,
  ],
  controllers: [PosttestsController],
  providers: [PosttestsService],
  exports: [
    MongooseModule.forFeature([
      { name: Posttest.name, schema: PosttestSchema },
    ]),
    PosttestsService,
  ],
})
export class PosttestsModule {}
