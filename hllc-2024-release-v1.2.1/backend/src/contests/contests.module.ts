import { Module } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { Contest, ContestSchema } from './schemas/contest.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import configuration from 'src/app/config/configuration';
import { ContestVote, ContestVoteSchema } from './schemas/contest-vote.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './contests.permissions';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forFeature([
      { name: Contest.name, schema: ContestSchema },
      {
        name: ContestVote.name,
        schema: ContestVoteSchema,
      },
    ]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [ContestsController],
  providers: [ContestsService],
  exports: [
    MongooseModule.forFeature([
      { name: Contest.name, schema: ContestSchema },
      {
        name: ContestVote.name,
        schema: ContestVoteSchema,
      },
    ]),
    ContestsService,
  ],
})
export class ContestsModule {}
