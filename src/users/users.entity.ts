import {AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn} from "typeorm";
//import {Exclude} from "class-transformer"; //ao invés de utilizar o decorator Exclude e usar o interceptor padrão do Nest.js, vou criar meu próprio interceptor customizado com minhas regras definidas em DTOs novas, e não aqui

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    //@Exclude() //esse decorator indica que quando a entity User for transformada em um plain object, a propriedade password deve ser excluída (assim ao enviar a resposta de uma requisição, não mandamos a senha do usuário junto com as informações normais)
    password: string;

    @AfterInsert() //@AfterInsert é um decorator que age como um hook que chama automaticamente o método associado a ele sempre que é inserida uma nova entidade à db (o TypeORM tem vários outros hooks desse tipo, que executam métodos dependendo de determinada condição)
    logUserCreation(){
        console.log("Usuário adicionado com id " + this.id);
    }

    @AfterRemove() //outro hook, que roda quando é realizado um remove()
    logUserRemoval(){
        console.log("Usuário id " + this.id + " deletado do sistema.");
    }

    @AfterUpdate() //hook que roda quando é realizado um update()
    logUserUpdate(){
        console.log("Usuário id " + this.id + " atualizado com sucesso.");
    }
}