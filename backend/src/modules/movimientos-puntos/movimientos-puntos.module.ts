import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosPuntosController, MovimientosPuntosClienteController, VencimientosController, VencimientosGlobalesController } from './movimientos-puntos.controller';
import { MovimientosPuntosService } from './movimientos-puntos.service';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoPuntos, CuentaPuntos])],
  controllers: [MovimientosPuntosController, MovimientosPuntosClienteController, VencimientosController, VencimientosGlobalesController],
  providers: [MovimientosPuntosService],
  exports: [MovimientosPuntosService],
})
export class MovimientosPuntosModule {}
