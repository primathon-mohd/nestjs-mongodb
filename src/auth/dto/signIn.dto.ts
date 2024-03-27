import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email field',
    required: true,
    type: 'email',
  })
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password field',
    required: true,
    type: 'string',
  })
  password: string;
}
