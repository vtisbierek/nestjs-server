import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (
        data: never, //o valor recebido dentro do parâmetro data é o argumento informado ao usar o decorator... nesse caso, não precisamos de parâmetro nenhum, então declaramos data com o tipo never, indicando que isso nunca será usado e impedindo o usuário de passar algum argumento para o nosso decorator
        context: ExecutionContext //ExecutionContext é um wrapper ao redor da requisição que está chegando que serve para abstrair informações dessa requisição, mas ele consegue trabalhar com vários protocolos, não apenas com HTTP (se fosse só HTTP, eu poderia declarar o context como Request, mas ao declarar como ExecutionContext eu deixo genérico e posso trabalhar com web-socket, gRPC, GraphQL, HTTP e outras coisas tbm)
    ) => {
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
);