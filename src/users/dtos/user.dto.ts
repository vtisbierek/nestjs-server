import {Expose} from "class-transformer";

export class UserDto {
    @Expose() //esse decorator faz o exato oposto de Exclude(), ou seja, ele diz explicitamente que essas propriedades devem ser enviadas na resposta
    id: number;

    @Expose()
    email: string;
}