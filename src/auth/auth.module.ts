import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisteredUser, UserSchema } from './schema/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/passport.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, ConfigService],
  imports: [
    MongooseModule.forFeature([
      { name: RegisteredUser.name, schema: UserSchema },
    ]),
    ConfigModule,
    JwtModule,
  ],
  exports: [],
})
export class AuthModule {}
