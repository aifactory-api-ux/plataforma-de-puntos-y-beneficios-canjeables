import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Cliente } from '../../entities/cliente.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { Compra } from '../../entities/compra.entity';
import { LineaCompra } from '../../entities/linea-compra.entity';
import { Auditoria } from '../../entities/auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, CuentaPuntos, Compra, LineaCompra, Auditoria])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
