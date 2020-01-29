import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = new User();

    user.username = authCredentialsDto.username;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(authCredentialsDto.password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist')
      }
      throw new InternalServerErrorException('Something went wring')
    }
  }

  async validateCredentials({ username, password }: AuthCredentialsDto): Promise<string | null> {
    const user = await this.findOne({ username });
    if (user && await user.validatePassword(password)) {
      return username;
    }
    return null;
  }
}
