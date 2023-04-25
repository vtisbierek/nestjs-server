import {Test} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./users.entity";

describe("AuthService", () => { //essa função describe não faz nada, apenas adiciona esse texto no terminal antes dos resultados do teste (npm run test:watch)
    let service: AuthService;

    beforeEach(async () => {
        const fakeUsersService: Partial<UsersService> = { //eu só preciso implementar a versão fake dos métodos find e create do UsersService, pq são os únicos méotodos usados pelo AuthService
            find: () => Promise.resolve([]), //versão fake do método find que existe no UsersService
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User), //versão fake do método create que existe no UsersService, onde eu retorno uma Promise e depois resolvo ela em um array vazio, só pra se comportar igual a função find real se comportaria (como ela é async, vai gerar uma promise e essa promise depois vai se resolver em alguma coisa, e aqui estamos dizendo que vai se resolver num array vazio mesmo e era isso)
        };
    
        const module = await Test.createTestingModule({
            providers: [ //essa é a lista de classes que queremos incluir no nosso DI container de teste
                AuthService,
                {
                    provide: UsersService, //porém AuthService é dependente de UsersService, que por sua vez é dependente de UsersRepo, etc... então para simplificar as coisas, eu crio uma versão fake de UsersService sem nada das dependências reais, que informa uma resposta fixa que eu vou definir, e eu uso essa versão fake pra testar meu AuthService, pq realmente é só com o AuthService que eu me importo aqui, não quero ter de lidar com o resto de vdd
                    useValue: fakeUsersService,
                },
            ]
        }).compile(); //aqui eu estou criando um DI container interamente novo, para teste
    
        service = module.get(AuthService); //aqui eu estou criando uma instância do meu AuthService dentro desse DI container de teste, e para isso todas as dependências de AuthService tbm precisar ser instanciadas e inicializadas
    });
    
    it("can create an instance of an auth service", async () => {
        expect(service).toBeDefined(); // o resultado esperado do teste é que service seja definido com sucesso
    });

    it("creates a new user with a salted and hashed password", async () => {
        const user = await service.signup("teste@teste.com", "12345");

        expect(user.password).not.toEqual("12345");
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
});

