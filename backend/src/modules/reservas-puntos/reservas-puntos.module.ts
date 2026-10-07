import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasPuntosController } from './reservas-puntos.controller';
import { ReservasPuntosService } from './reservas-puntos.service';
import { ReservaPuntos } from '../../entities/reserva-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReservaPuntos, CuentaPuntos, MovimientoPuntos]), RedisModule],
  controllers: [ReservasPuntosController],
  providers: [ReservasPuntosService],
  exports: [ReservasPuntosService],
})
export class ReservasPuntosModule {}
