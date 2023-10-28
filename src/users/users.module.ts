import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.services';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UserService, UsersRepository]
})
export class UsersModule {}
