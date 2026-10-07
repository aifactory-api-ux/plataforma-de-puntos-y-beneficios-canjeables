import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPuntosController } from './cuentas-puntos.controller';
import { CuentasPuntosService } from './cuentas-puntos.service';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { Auditoria } from '../../entities/auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaPuntos, MovimientoPuntos, Auditoria])],
  controllers: [CuentasPuntosController],
  providers: [CuentasPuntosService],
  exports: [CuentasPuntosService],
})
export class CuentasPuntosModule {}
