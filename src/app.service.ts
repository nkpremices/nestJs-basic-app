import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 200,
      message: 'Welcome on tasks app',
    };
  }
}
