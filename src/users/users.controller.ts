import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Serialize(UserDto) //ao invés de colocar meu interceptor em cima de cada request handler individualmente, posso colocar ele em cima do controlador inteiro e garantir que seja aplicado para todos os request handlers do controlador
@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("/signup")
    createUser(@Body() body: CreateUserDto){
        return this.authService.signup(body.email, body.password);
    }

    @Post("/signin")
    authenticateUser(@Body() body: CreateUserDto){
        return this.authService.signin(body.email, body.password);
    }

    //@UseInterceptors(ClassSerializerInterceptor) //o interceptor é o que vai me permitir aplicar a regra de Exclude() que eu apliquei na entity User, de modo que antes de eu retornar o usuário aqui, o interceptor vai transformar a entity user em um plain object e remover a propriedade password
    //@UseInterceptors(new SerializeInterceptor(UserDto)) //ao invés de usar o interceptor padrão (ClassSerializerInterceptor), vou usar meu interceptor personalizado (SerializeInterceptor)
    //@Serialize(UserDto) //aqui eu estou usando meu próprio decorator personalizado, que faz a mesma coisa que a linha acima
    @Get("/:id")
    findUser(@Param("id") id: string){
        return this.usersService.findOne(parseInt(id)); //se o método findOneBy() do TypeORM não encontra nada, ele retorna null
    }

    @Get() //a rota vai pra raiz, pq o query tá direto em /auth/?email=...
    async findAllUsers(@Query("email") email: string){
        const users = await this.usersService.find(email); //se o método find() do TypeORM não encontra nada, ele retorna um array vazio []

        if(users.length === 0){
            throw new NotFoundException("Usuário não encontrado.");
        }
        return users;
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body);
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string){
        return this.usersService.remove(parseInt(id));
    }
}