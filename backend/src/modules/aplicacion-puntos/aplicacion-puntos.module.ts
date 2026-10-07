import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AplicacionPuntosController } from './aplicacion-puntos.controller';
import { AplicacionPuntosService } from './aplicacion-puntos.service';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { ReservaPuntos } from '../../entities/reserva-puntos.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { ReservasPuntosModule } from '../reservas-puntos/reservas-puntos.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaPuntos, ReservaPuntos]),
    ClientesModule,
    ReservasPuntosModule,
    RedisModule,
  ],
  controllers: [AplicacionPuntosController],
  providers: [AplicacionPuntosService],
  exports: [AplicacionPuntosService],
})
export class AplicacionPuntosModule {}
