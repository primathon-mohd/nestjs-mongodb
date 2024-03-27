import { IsOptional, IsBoolean } from 'class-validator';

export class UserSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiveNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveSMS?: boolean;
}
