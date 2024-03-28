import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
// import { UserSetting } from '../schema/setting.schema';
import { UserSettingsDto } from './user.settings.dto';
import { Type } from 'class-transformer';

//Data Transfer Object
export class SocialMediaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'username field',
    required: true,
    type: 'string',
  })
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'displayName field',
    required: false,
    type: 'string',
  })
  displayName?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'avatarUrl field',
    required: true,
    type: 'string',
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'User Settings !!',
    required: false,
  })
  @ApiProperty({ type: () => UserSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSettingsDto)
  settings: UserSettingsDto;
}
