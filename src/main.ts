import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //essa configuração faz com que todas as propriedades adicionais que não sejam esperadas nas requisições que eu recebi sejam automaticamente removidas (por exemplo, o body do auth/signup deve ter email e password, mas se eu mandar um post request com um objeto que tenha email, password e username, a propriedade username é automaticamente deletada e a minha requisição será processada normalmente usando apenas as propriedades email e password que estavam no objeto recebido)
    })
  );

  await app.listen(3000);
}
bootstrap();
