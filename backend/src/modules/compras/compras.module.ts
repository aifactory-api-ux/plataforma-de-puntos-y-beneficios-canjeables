import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { Compra } from '../../entities/compra.entity';
import { LineaCompra } from '../../entities/linea-compra.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { ReglaPuntos } from '../../entities/regla-puntos.entity';
import { ConfiguracionRegla } from '../../entities/configuracion-regla.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { ReglasPuntosModule } from '../reglas-puntos/reglas-puntos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Compra,
      LineaCompra,
      CuentaPuntos,
      MovimientoPuntos,
      ReglaPuntos,
      ConfiguracionRegla,
      Auditoria,
    ]),
    ReglasPuntosModule,
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}
