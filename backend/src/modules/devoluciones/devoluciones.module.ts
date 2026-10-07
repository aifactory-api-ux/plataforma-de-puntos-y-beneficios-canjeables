import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevolucionesController } from './devoluciones.controller';
import { DevolucionesService } from './devoluciones.service';
import { Devolucion } from '../../entities/devolucion.entity';
import { Compra } from '../../entities/compra.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { ComprasModule } from '../compras/compras.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Devolucion, Compra, CuentaPuntos, MovimientoPuntos]),
    ComprasModule,
  ],
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
  exports: [DevolucionesService],
})
export class DevolucionesModule {}
