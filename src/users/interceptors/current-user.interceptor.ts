import {NestInterceptor, ExecutionContext, CallHandler, Injectable} from "@nestjs/common";
import {UsersService} from "../users.service";

@Injectable() //tenho que colocar esse decorator pra poder usar esse interceptor com Dependency Injection
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private usersService: UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler){
        const request = context.switchToHttp().getRequest();
        const {userId} = request.session || {}; //aqui eu estou de-estruturando a session pra pegar o atributo userId, mas se não tiver uma session então eu passo só um objeto vazio

        if(userId){
            const user = this.usersService.findOne(userId);
            request.currentUser = user; //aqui eu crio um atributo dentro de request chamado currentUser e eu atribuo a ele o user que a gnt achou consultando o db por meio do UsersService (esse é o grande truque, pq os param decorators não podem acessar o UsersService, uma vez que eles não fazem perte do DI, mas eles podem acessar o request, então o interceptor tá fazendo o meio de campo aqui, pegando o user e colocando na request pro param decorator poder acessar)
        }

        return handler.handle(); //executar handler.handle() significa dizer "apenas vá em frente e execute o route handler onde esse interceptor esteja anexado"
    }
}