import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { User } from './users.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //aqui é que o Nest.js vai criar o repository automaticamente, através de linkar o módulo TypeOrm informando a entidade User
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
