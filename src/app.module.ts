import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "sqlite", //aqui eu preciso dizer para o TypeOrm qual é a db que vou usar
    database: "db.sqlite", //aqui eu nomeio a minha db
    entities: [User, Report], //aqui a gnt vai listar todas as entities (ou schemas) que a gnt vai ter na db
    synchronize: true,
  }), UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
