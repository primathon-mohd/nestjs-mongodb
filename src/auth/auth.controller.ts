import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@ApiTags('Authorization')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created for signed up.',
  })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.authService.signUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully verified for signed in.',
  })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    return await this.authService.signIn(signInDto);
  }
}
