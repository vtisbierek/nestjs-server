import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
const cookieSession = require("cookie-session"); //o módulo cookie-session tem um problema de compatibilidade com o Nest.js e por isso não dá pra importar do jeito novo, tem que importar do jeito velho mesmo, com o require

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const keys = process.env.COOKIE_SESSION_KEYS;  

  app.use(cookieSession({
    keys: [keys], //essa é a chave de criptografia pra encriptografar e decriptografar os cookies da sessão
  }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //essa configuração faz com que todas as propriedades adicionais que não sejam esperadas nas requisições que eu recebi sejam automaticamente removidas (por exemplo, o body do auth/signup deve ter email e password, mas se eu mandar um post request com um objeto que tenha email, password e username, a propriedade username é automaticamente deletada e a minha requisição será processada normalmente usando apenas as propriedades email e password que estavam no objeto recebido)
    })
  );
  await app.listen(3000);
}
bootstrap();
