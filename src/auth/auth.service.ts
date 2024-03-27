import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisteredUser, UserDocument } from '../auth/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectModel(RegisteredUser.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async signUp(signUp: SignUpDto) {
    const response = await this.userModel.findOne({ email: signUp.email });
    if (response) {
      console.log('User Already exists!! ');
      throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
    }

    const saltOrRounds = process.env.SALT_OR_ROUNDS;
    console.log(saltOrRounds, ' Inside signup service method !! ');
    const encryptedPassword = await bcrypt.hash(
      signUp.password,
      Number(saltOrRounds),
    );
    signUp.password = encryptedPassword;
    console.log(signUp, ' after password change!!');
    // signUp._id = (await this.userModel.countDocuments()) + 1;
    // console.log(signUp._id, ' document id - ');
    const userResponse = await new this.userModel(signUp).save();
    console.log(' user Response ', userResponse);
    let token: any;
    try {
      token = await this.signToken(userResponse.id, userResponse.email);
    } catch (err) {
      console.log('Error while generating token !!', err.error);
      throw new HttpException(
        'Error while generating token !! ',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return {
      response: userResponse,
      token,
    };
  }

  async signIn(signIn: SignInDto) {
    const user = await this.userModel.findOne({ email: signIn.email });
    if (!user) {
      console.log('User is not signed up , Please signed up first!!');
      throw new HttpException('User Not Registered !!', HttpStatus.BAD_REQUEST);
    }
    const encryptedPassword = user.password;
    const isVerified: boolean = await bcrypt.compare(
      signIn.password,
      encryptedPassword,
    );
    if (!isVerified) {
      throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
    }

    let token: any;
    try {
      token = await this.signToken(user.id, user.email);
    } catch (err) {
      console.log('Error while generating token !!', err.error);
      throw new HttpException(
        'Error while generating token !! ',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    console.log('Inside sign in !!');
    return {
      response: user,
      token,
    };
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    let token: any;
    try {
      token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.EXPIRES_IN,
        secret: this.config.get('JWT_SECRET'),
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_GATEWAY);
    }
    return { access_token: token };
  }
}
