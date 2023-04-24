import { Injectable, NotFoundException } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){} //estou simulataneamente criando uma propriedade privada chamada repo, e ainda passando pra ela como parâmetro uma instância do tipo Repository do TypeORM, que lida com instâncias da classe User, além disso, dessa vez precisamos usar o decorator @InjectRepository porque como o tipo Repository<> é genérico, o Nest.js precisa de ajuda extra pra saber qual é a dependência (User), então falamos isso explicitamente pra ele
    
    create(email: string, password: string){
        const user = this.repo.create({email, password}); //o método create é nativo da library TypeORM para SQLite, conforme documentação https://typeorm.io/repository-api

        return this.repo.save(user); //primeiro a gnt usa o método create() pra criar uma instância de uma entidade, depois o método save() pra salvar essa instância na db do SQLite
    }

    async findOne(id: number){
        if(!id){ //se o id recebido for null, tem que retornar null de cara, não é pra tentar encontrar usuário nenhum
            throw new NotFoundException("Usuário não encontrado.");
        }

        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException("Usuário não encontrado.");
        }
        return user;
    }

    find(email: string){
        return this.repo.find({where: {email}});
    }

    async update(id: number, attrs: Partial<User>){ //esse tipo Partial<> permite que seja aceito qualquer objeto que tenha pelo menos um atributo do tipo User, ou todos, ou que seja um objeto vazio, mas se tiver um atributo não pertencente ao tipo User, vai dar erro
        const user = await this.repo.findOneBy({id}); //preciso tornar a função assíncrona e colocar o await, pq senão as operações seguintes dariam erro, já que tentariam executar antes de voltar o retorno da db e o objeto ser atribuído à variável user
        if(!user){
            throw new NotFoundException("Usuário não encontrado.");
        }
        //user.email = attrs.email;
        //user.password = attrs.password;
        Object.assign(user, attrs); //Object.assign pega todos os atributos do segundo argumento e copia eles para o primeiro argumento, sobrescrevendo os anteriores
        return this.repo.save(user); //eu faço dessa forma, pq se fosse usar o método update() não chamaria os hooks, já que o método update() do typeORM foi feito para receber plain objects, e não entidades
    }

    async remove(id: number){
        const user = await this.repo.findOneBy({id});
        if(!user){
            throw new NotFoundException("Usuário não encontrado.");
        }
        return this.repo.remove(user);
    }
}
