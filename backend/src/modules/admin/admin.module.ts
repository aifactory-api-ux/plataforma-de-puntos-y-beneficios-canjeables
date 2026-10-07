import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Cliente } from '../../entities/cliente.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { Auditoria } from '../../entities/auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, CuentaPuntos, MovimientoPuntos, Auditoria])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
