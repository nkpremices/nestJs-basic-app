import { AuthService } from './auth.service';
import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body(ValidationPipe) credentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signup(credentials);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) credentials: AuthCredentialsDto): Promise<{ accessToken: string } | null> {
    return this.authService.signin(credentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user) {
    // console.log(user)    
    return user;
  }
}
