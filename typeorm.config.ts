import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgresql://premices:yvymicesforever@localhost/tasks',
  entities: [__dirname + '/src/**/*.entity.js'],
  synchronize: true,
};
