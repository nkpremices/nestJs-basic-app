import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signup(authCredentials);
  }

  async signin(credentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateCredentials(credentials);
    if (!username) { throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: await this.jwtService.sign({ username }) };
  }
}
