import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReglasPuntosController } from './reglas-puntos.controller';
import { ReglasPuntosService } from './reglas-puntos.service';
import { ReglaPuntos } from '../../entities/regla-puntos.entity';
import { ConfiguracionRegla } from '../../entities/configuracion-regla.entity';
import { Auditoria } from '../../entities/auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReglaPuntos, ConfiguracionRegla, Auditoria])],
  controllers: [ReglasPuntosController],
  providers: [ReglasPuntosService],
  exports: [ReglasPuntosService],
})
export class ReglasPuntosModule {}
