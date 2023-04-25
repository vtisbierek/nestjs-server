import {CanActivate, ExecutionContext} from "@nestjs/common";

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();

        return request.session.userId; //se tiver alguém logado na sessão, vai existir uma session e um user Id, e canActivate vai retornar um valor verdadeiro, e aí ele libera o handler para ser executado, porém se não tiver, será retornado um valor zuado (null, undefined, vazio, falso, etc), e o canActive não deixa ativar se for retornado um valor zuado, de modo que o handler não seria executado
    }
}