import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UserSettingsDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'receiveNotification field',
    required: false,
    type: 'boolean',
    default: true,
  })
  receiveNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'receiveEmail field',
    required: false,
    type: 'boolean',
    default: false,
  })
  receiveEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'receiveSMS field',
    required: false,
    type: 'boolean',
    default: false,
  })
  receiveSMS?: boolean;
}
