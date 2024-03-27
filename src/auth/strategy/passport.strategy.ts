import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RegisteredUser, UserDocument } from '../schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    @InjectModel(RegisteredUser.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('inside validate function in JwtStrategy!', payload);
    // email in payload belongs to the jwt token , while we can fetch user details in which another email can exists..
    const user = await this.userModel.findOne({
      email: payload.email,
    });
    console.log(payload, payload.email);
    if (!user) {
      throw new ForbiddenException(' Not a valid user');
    }
    delete user.password;
    return {
      email: user.email,
      payload,
    };
  }
}
