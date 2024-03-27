import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RegisteredUser, UserSchema } from './auth/schema/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // mongodb://username:password@127.0.0.1:27017/nestjs/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5
  imports: [
    // MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: RegisteredUser.name, schema: UserSchema },
    ]),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
