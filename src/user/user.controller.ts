import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { SocialMediaDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Request } from 'express';
import mongoose from 'mongoose';
import { HttpExceptionFilter } from 'src/utils/exception.filter';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ConfigService } from '@nestjs/config';
@ApiTags('USER Management')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiParam({
    type: 'number',
    name: 'id',
    description: 'Provide _id from docs',
  })
  @Get('info/:id')
  async getUserInfo(@Param('id') id: string) {
    const isValid: boolean = mongoose.Types.ObjectId.isValid(id);
    console.log('Inside getUserInfo , checking for valid id', isValid);
    if (!isValid) {
      throw new HttpException(
        'Not a Valid id | User not found ',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userService.getUserInfo(id);
  }

  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiQuery({
    type: 'string',
    name: 'keyword',
    description: 'Provide displayName as regex. CASE INSENSITIVE',
  })
  @ApiQuery({
    type: 'number',
    name: 'page',
    required: false,
    description: `Provide current page ,
     Each page will show ${process.env.RESPONSE_PER_PAGE} numbers of docs.`,
  })
  @Get('info')
  async getUserInfoPagination(@Query() query: ExpressQuery) {
    console.log('Inside getUserInfoPagination controller method !!', query);
    console.log(
      `${process.env.RESPONSE_PER_PAGE}  and ${this.configService.get('RESPONSE_PER_PAGE')}`,
    );
    return await this.userService.getSocialMediaInfoPagination(query);
  }

  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiParam({
    type: 'string',
    name: 'username',
    description: 'Provide username from docs',
  })
  @Get('details/:username')
  async getUserDetails(
    @Param('username') username: string,
    @Req() request: Request,
  ) {
    console.log('Inside getUserDetails method ', request.user['email']);
    return await this.userService.getUserDetails(username);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({ type: SocialMediaDto })
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createSocialMedia(@Body() socialMediaDto: SocialMediaDto) {
    console.log('Inside create Social media', socialMediaDto);
    return await this.userService.createSocialMedia(socialMediaDto);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiParam({
    type: 'number',
    name: 'id',
    description: 'Provide _id from docs',
  })
  @ApiBody({ type: SocialMediaDto })
  @UsePipes(new ValidationPipe())
  @Put('update/:id')
  async updateSocialMedia(
    @Param('id') id: string,
    @Body() socialMediaDto: SocialMediaDto,
  ) {
    const isValid: boolean = mongoose.Types.ObjectId.isValid(id);
    console.log('Inside updateSocialMedia , checking for valid id', isValid);
    if (!isValid) {
      throw new HttpException('Not a valid id', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.updateSocialMediaWithId(id, socialMediaDto);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiParam({
    type: 'number',
    name: 'username',
    description: 'Provide username from docs',
  })
  @ApiBody({ type: SocialMediaDto })
  @UsePipes(new ValidationPipe())
  @Patch('update/:username')
  async updateSocialMediaUserName(
    @Param('username') username: string,
    @Body() socialMediaDto: SocialMediaDto,
  ) {
    return await this.userService.updateSocialMedia(username, socialMediaDto);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiParam({
    type: 'string',
    name: 'username',
    description: 'Provide username from docs',
  })
  @Delete('delete/:username')
  async deleteUser(@Param('username') username: string) {
    return await this.userService.deleteSocialMedia(username);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiQuery({
    type: 'number',
    name: 'id',
    description: 'Provide _id from docs',
  })
  @Delete('deleteId')
  async deleteUserById(@Query('id') id: string) {
    console.log(id, mongoose.Types.ObjectId.isValid(id));
    const response = await this.userService.deleteSocialMediaById(id);
    if (!response) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad Request',
  // })
  // @ApiParam({
  //   type: 'number',
  //   name: 'id',
  //   description: 'Provide _id from docs',
  // })
  // @Delete('deleteId/:id')
  // async deleteUserById(@Param('id') id: string) {
  // //   console.log(id, mongoose.Types.ObjectId.isValid(id));
  //   const response = await this.userService.deleteSocialMediaById(id);
  //   if (!response) {
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  // }
}
