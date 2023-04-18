import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import {randomBytes, scrypt as _scrypt} from "crypto"; //a função scrypt é assíncrona, mas ao invés de retornar uma Promise, ela usa callbacks
import {promisify} from "util"; //promisify é uma função que pega funções assíncronas que usam callback e gera uma versão idêntica delas porém com Promise

const scrypt = promisify(_scrypt); //ao importar a função scrypt, eu renomeei ela pra _scrypt pra poder usar o nome normal scrypt depois de dar o promosify na função

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signup(email: string, password: string){
        //verificar se o email já está em uso
        const users = await this.usersService.find(email);

        if(users.length){ //ou seja, se o array retornado pelo método find() tiver alguma coisa dentro, é pq já tem gnt usando esse email
            throw new BadRequestException("Email já em utilização.");
        }
        //fazer o hash da senha
        //gerar um sal aleatório
        const salt = randomBytes(8).toString("hex"); //randomBytes vai gerar 8 bytes de dados aleatórios, mas é binário, então eu uso toString e peço pra passar pra hexadecimal, que aí vou ter uma sequência de números e caracteres (cada byte gera 2 caracteres hexadecimais, então 8 bytes vai dar 16 caracteres no final). O tipo exato retornado por randomBytes é chamado buffer, e é um trem de bits
        //juntar o sal e a senha e fazer o hash dos dois juntos
        const hash = (await scrypt(password, salt, 32)) as Buffer; //aqui faço o hash da senha e do sal, e defino que quero um output de 32 bytes. Além disso, a resposta da função scrypt é do tipo Buffer, que é basicamente um trem de bits (uma string de 0 e 1), mas o Typescript fica confuso e não consegue determinar isso depois que a gnt usa a função promisify lá em cimal, então eu declaro aqui explicitamente pra ajudar
        //juntar o hash e o sal
        const result = salt + "." + hash.toString("hex"); //da mesma forma que o randomBytes, o scrypt tbm gera um buffer, então tenho que usar o toString("hex") pra converter o resultado pra números e caracteres (como eram 32 bytes, vai dar 64 caracteres), além disso estou usando o caractere . como separador do sal e do hash
        //criar o usuário e salvar
        const user = await this.usersService.create(email, result);
        //retornar o usuário para o controller (é ele que vai chamar esse método)
        return user;
    }

    async signin(email: string, password: string){
        //verificar se o email está cadastrado
        const [user] = await this.usersService.find(email); //eu já estou de-estruturando o array pra passar pro user só o que tem dentro dele, assim não preciso lidar com array
        if(!user){
            throw new NotFoundException("Usuário não encontrado.");
        }
        //fazer o hash da senha junto com o sal salvo para esse usuário na db
        const [salt, hash] = user.password.split("."); //a função split() divide uma string a partir do caractere especificado (no caso, o .) e retorna os pedaços em um array, então já de-estruturei o array e atribuí cada pedaço às variáveis salt e hash
        const rehash = (await scrypt(password, salt, 32)) as Buffer;
        //comparar o hash gerado com o hash salvo na db e, se der certo, retornar user
        if(rehash.toString("hex") !== hash){
            throw new BadRequestException("Email ou senha incorretos.");
        }
        return user;
    }
}