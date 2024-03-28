import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisteredUser, UserDocument } from 'src/auth/schema/user.schema';
import { SocialMedia, SocialMediaDocument } from './schema/social.schema';
import { SocialMediaDto } from './dto';
import { SettingDocument, UserSetting } from './schema/setting.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    @InjectModel(RegisteredUser.name)
    private userModel: Model<UserDocument>,
    @InjectModel(SocialMedia.name)
    private socialMediaModel: Model<SocialMediaDocument>,
    @InjectModel(UserSetting.name)
    private userSettingModel: Model<SettingDocument>,
  ) {}

  async getUserInfo(id: string) {
    try {
      console.log('Inside getUserInfo method !!');
      const response = await this.socialMediaModel
        .findById(id)
        .populate('settings');
      console.log(
        await this.socialMediaModel.findById(id).populate('settings'),
      );
      if (!response) {
        throw new NotFoundException(' Not found ');
      }
      return response;
    } catch (error) {
      console.error(error);
      console.log('Inside catch block !!');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserDetails(username: string) {
    try {
      //   console.log('Inside getUserDetails method !!');
      const response = await this.socialMediaModel.findOne({ username });
      if (!response) {
        throw new NotFoundException(' Not found ');
      }
      return response;
    } catch (error) {
      // console.error(error);
      // console.log('Inside catch block !!');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async getSocialMediaInfoPagination(query: Query) {
    // Response Per Page , should be configurable ...
    // Add + , for conversion of string value to numeric.. Or use Number(stringVal)
    const responsePerPage = +process.env.RESPONSE_PER_PAGE;
    const currentPage = Number(query.page) || 1;
    const skipPage = responsePerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          displayName: {
            $regex: query.keyword,
            $options: 'i', // CASE INSENSITIVE
          },
        }
      : {};
    console.log(
      'Inside getSocialMediaInfoPagination service method !! ',
      responsePerPage,
      currentPage,
      keyword,
      skipPage,
    );
    // Order preference .. sort>> skip >> limit
    const result = await this.socialMediaModel
      .find({ ...keyword })
      .sort('username')
      .limit(responsePerPage)
      .skip(skipPage);
    // .projection({ username: 1, displayName: 1 });

    return result;
  }

  async createSocialMedia({ settings, ...socialMediaDto }: SocialMediaDto) {
    try {
      if (settings) {
        console.log('Inside if condition ');
        const newSettings = await new this.userSettingModel(settings).save();
        console.log(newSettings, 'Setting is created !!');
        // if (
        //   await this.socialMediaModel.findOne({
        //     username: socialMediaDto.username,
        //   })
        // ) {
        //   throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
        // }
        const newUser = new this.socialMediaModel({
          ...socialMediaDto,
          settings: newSettings._id,
        });
        const newUserResponse = await newUser.save();
        console.log('Inside if condition ', newUserResponse);
        return newUserResponse;
      }
      const response = await new this.socialMediaModel(socialMediaDto).save();
      // const response = await this.socialMediaModel.insertMany([socialMediaDto]);
      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to create social media ',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async updateSocialMedia(username: string, socialMediaDto: SocialMediaDto) {
    const response = await this.socialMediaModel.findOne({
      username,
    });
    if (!response) {
      throw new NotFoundException('Social Media User Details Not Found!!');
    }
    return await this.socialMediaModel.updateOne({ username }, socialMediaDto);
  }

  async updateSocialMediaWithId(_id: string, socialMediaDto: SocialMediaDto) {
    const response = await this.socialMediaModel.findOne({
      _id,
    });
    if (!response) {
      throw new NotFoundException('Social Media User Details Not Found!!');
    }
    // return await this.socialMediaModel.updateOne({ _id }, socialMediaDto);
    return await this.socialMediaModel.findByIdAndUpdate(_id, socialMediaDto);
  }

  async deleteSocialMedia(username: string) {
    console.log('Inside deleteSocialMedia ', username);
    const user = await this.socialMediaModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(' User Not Found ');
    }
    const response = await this.socialMediaModel.deleteOne({ username });
    return response;
  }

  async deleteSocialMediaById(id: string) {
    console.log(await this.socialMediaModel.findById(id));
    const response = await this.socialMediaModel.findByIdAndDelete(id);
    console.log('Inside delete by id-- ', response);
    return response;
  }
}
