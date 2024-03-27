import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUpDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Primary Key field , No Need to send it !!',
    required: false,
    type: 'number',
  })
  _id?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Username field',
    required: false,
    type: 'string',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email field',
    required: true,
    type: 'email',
  })
  email: string;

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password field',
    required: true,
    type: 'string',
  })
  password: string;
}
