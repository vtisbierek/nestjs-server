import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { User } from './users.entity';
import { AuthService } from './auth.service';
import {CurrentUserInterceptor} from "../users/interceptors/current-user.interceptor";

@Module({
  imports: [TypeOrmModule.forFeature([User])], //aqui é que o Nest.js vai criar o repository automaticamente, através de linkar o módulo TypeOrm informando a entidade User
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService,
    //CurrentUserInterceptor, //se eu quisesse aplicar localmente meu interceptor, eu só adicionaria ele aqui assim sozinho normal, e depois lá no controller eu aplicaria ele no controller
    {
      provide: APP_INTERCEPTOR, //utilizando o APP_INTERCEPTOR, eu aplico meu interceptor globalmente
      useClass: CurrentUserInterceptor
    }
  ] //é aqui que eu insiro as classes marcadas como Injectable no dependency injection
})
export class UsersModule {}
