import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AccessTokenModule } from './auth/access-token/access-token.module';
import { RefreshTokenModule } from './auth/refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import configuration from './app/config/configuration';
import { SchoolsModule } from './schools/schools.module';
import { MajorsModule } from './majors/majors.module';
import { ReportsModule } from './reports/reports.module';
import { AdminsModule } from './admins/admins.module';
import { APP_GUARD } from '@nestjs/core';
import { Roles } from './auth/enums/roles.enum';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { ReportsCategoryModule } from './report-categories/report-categories.module';
import { ContestsModule } from './contests/contests.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesModule } from './activities/activities.module';
import { QuestionsModule } from './questions/questions.module';
import { CaslModule } from 'nest-casl';
import { AssessmentSectionsModule } from './assessment-sections/assessment-sections.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { PretestsModule } from './pretests/pretests.module';
import { PosttestsModule } from './posttests/posttests.module';
import { ColorsModule } from './themes/themes.module';
import { SettingsModule } from './settings/settings.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { VoucherCodesModule } from './voucher-codes/voucher-codes.module';
import { LamduansModule } from './lamduans/lamduans.module';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from './app/config/storage.config';
import { CheckInsModule } from './check-ins/check-ins.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { ItemsModule } from './items/items.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { AnswerFriendsModule } from './answer-friends/answer-friends.module';
import { RelationshipModule } from './relationship/relationship.module';
import { CommunitiesModule } from './communities/communities.module';
import { StickersModule } from './stickers/stickers.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { AnswerQuestionsModule } from './answer-questions/answer-questions.module';
import { GiftsModule } from './gifts/gifts.module';
import { ChatHistoriesModule } from './chat-histories/chat-histories.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongodb.uri'),
        dbName: config.get<string>('mongodb.dbName'),
      }),
    }),
    CaslModule.forRoot<Roles>({
      // Role to grant full access, optional
      superuserRole: Roles.ADMIN,
      // Function to get casl user from request
      // Optional, defaults to `(request) => request.user`
      getUserFromRequest: (request) => request.user,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: config.get('upload.apiPath'),
        },
      ],
    }),
    MulterModule.register({ storage: storageConfig }),
    SchoolsModule,
    MajorsModule,
    UsersModule,
    AccessTokenModule,
    RefreshTokenModule,
    AuthModule,
    ReportsModule,
    AdminsModule,
    ReportsCategoryModule,
    ContestsModule,
    QuestionsModule,
    ActivitiesModule,
    AssessmentSectionsModule,
    AssessmentsModule,
    PretestsModule,
    PosttestsModule,
    ColorsModule,
    SettingsModule,
    SponsorsModule,
    LamduansModule,
    VouchersModule,
    VoucherCodesModule,
    CheckInsModule,
    NotificationsModule,
    EvaluationsModule,
    ItemsModule,
    QuestionnaireModule,
    AnswerFriendsModule,
    RelationshipModule,
    CommunitiesModule,
    StickersModule,
    EvolutionsModule,
    AnswerQuestionsModule,
    GiftsModule,
    ChatHistoriesModule,
    DashboardModule,
  ],
  controllers: [AppController, ActivitiesController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
