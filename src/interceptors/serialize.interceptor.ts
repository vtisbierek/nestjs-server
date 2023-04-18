import {UseInterceptors, NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";

interface ClassConstructor { //essa é uma interface que define genericamente um construtor de classe, assim a gnt pode pelo menos dizer pro decorator Serialize ali embaixo que ele só pode aceitar como argumento um tipo que seja uma classe, e não simplesmente "any"... não é perfeito, mas já é melhor que nada em termos de segurança
    new (...args: any[]): {} //explicação desse código: https://stackoverflow.com/questions/50726326/how-to-go-about-understanding-the-type-new-args-any-any
}

export function Serialize(dto: ClassConstructor){ //aqui estou criando meu próprio decorator personalizado, pra não ter que escrever essa linha enorme "UseInterceptors(new SerializeInterceptor(dto))"
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{ //a keyword implements do Typescript significa que a nossa classe que estamos criando (SerializeInterceptor) deve satisfazer todos os métodos e propriedades da interface que estamos usando de benchmark pra implementação (NestInterceptor), assim o Typescript vai nos ajudar a garantir que a nossa classe vai funcionar perfeitamente como o interceptor nativo do Nest.js
    constructor(private dto: any){}
    
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        //Aqui a gnt coloca o código que será executado antes da REQUEST ser processada pelo request handler (entrada)
        //console.log("Isso tá rodando antes da request ser tratada: " + context);
        

        return handler.handle().pipe(
            map((data: any) => { //o data é o que vou enviar pra fora como plain object
                //Aqui a gnt coloca o código que será executado antes da RESPONSE ser enviada (saída)
                //console.log("Isso tá rodando antes da resposta ser enviada: " + data);
                return plainToInstance(this.dto, data, { //esse método vai converter o data (que até então estava chegando com tudo que tem dentro da entity User) no tipo UserDto que criamos (ou em qualquer outro DTO que seja passado como argumento na hora de instanciar o interceptor lá no controller)
                    excludeExtraneousValues: true //essa opção aqui é a que determina que apenas os campos com o decorator Expose() devem ser passados, e quaisquer campos excedentes devem ser removidos
                })
            })
        )
    }
}