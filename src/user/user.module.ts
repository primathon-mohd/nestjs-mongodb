import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RegisteredUser, UserSchema } from '../auth/schema/user.schema';
import { SocialMedia, SocialMediaSchema } from './schema/social.schema';
import { SettingSchema, UserSetting } from './schema/setting.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: RegisteredUser.name, schema: UserSchema },
      { name: SocialMedia.name, schema: SocialMediaSchema },
      { name: UserSetting.name, schema: SettingSchema },
    ]),
    AuthModule,
  ],
})
export class UserModule {}
