import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportacionesController } from './exportaciones.controller';
import { ExportacionesService } from './exportaciones.service';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { Cliente } from '../../entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoPuntos, CuentaPuntos, Cliente])],
  controllers: [ExportacionesController],
  providers: [ExportacionesService],
  exports: [ExportacionesService],
})
export class ExportacionesModule {}
