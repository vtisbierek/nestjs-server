import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {User} from "../users/users.entity";
import {AuthGuard} from "../guards/auth.guard";

@Controller('auth')
@Serialize(UserDto) //ao invés de colocar meu interceptor em cima de cada request handler individualmente, posso colocar ele em cima do controlador inteiro e garantir que seja aplicado para todos os request handlers do controlador
//@UseInterceptors(CurrentUserInterceptor) //aqui eu aplico o interceptor que pega o usuário da sessão e insere como currentUser nas requests (porém dessa forma esse interceptor está aplicado apenas a esse controller, se eu tiver mais controllers, tenho que aplicar neles também, então vou fazer um outro jeito, aplicando esse interceptor globalmente, para todos os meus controllers)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @UseGuards(AuthGuard) //estou aplicando meu guard nesse handler, assim esse handler só será executado se tiver usuário logado na sessão
    @Get("/signedin")
    getSignedInUser(@CurrentUser() user: User){ //e então meu param decorator consegue pegar o currentUser da sessão e me informar aqui
        if(!user){
            throw new NotFoundException("Usuário não encontrado.");  
        }
        return user;
    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id; //eu posso simplesmente criar atributos pra minha session e o cookie-session vai encriptografar e incluir no cookie da sessão (no caso, aqui eu criei um atributo chamado userId e atribuí a ele o id do usuário que está logado)
        console.log("usuário na sessão: " + session.userId);
        
        return user; //agora sim eu retorno o user
    }

    @Post("/signin")
    async authenticateUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post("/signout")
    signOut(@Session() session: any){
        session.userId = null;
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