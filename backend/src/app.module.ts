import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './modules/clientes/clientes.module';
import { CuentasPuntosModule } from './modules/cuentas-puntos/cuentas-puntos.module';
import { ComprasModule } from './modules/compras/compras.module';
import { ReglasPuntosModule } from './modules/reglas-puntos/reglas-puntos.module';
import { ReservasPuntosModule } from './modules/reservas-puntos/reservas-puntos.module';
import { AplicacionPuntosModule } from './modules/aplicacion-puntos/aplicacion-puntos.module';
import { MovimientosPuntosModule } from './modules/movimientos-puntos/movimientos-puntos.module';
import { DevolucionesModule } from './modules/devoluciones/devoluciones.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { ExportacionesModule } from './modules/exportaciones/exportaciones.module';
import { TerminosModule } from './modules/terminos/terminos.module';
import { AdminModule } from './modules/admin/admin.module';
import { RedisModule } from './modules/redis/redis.module';
import { HealthController } from './health/health.controller';
import configuration, { ConfigSchema } from './config/configuration';
import { Cliente } from './entities/cliente.entity';
import { CuentaPuntos } from './entities/cuenta-puntos.entity';
import { Compra } from './entities/compra.entity';
import { LineaCompra } from './entities/linea-compra.entity';
import { MovimientoPuntos } from './entities/movimiento-puntos.entity';
import { ReservaPuntos } from './entities/reserva-puntos.entity';
import { ReglaPuntos } from './entities/regla-puntos.entity';
import { ConfiguracionRegla } from './entities/configuracion-regla.entity';
import { Devolucion } from './entities/devolucion.entity';
import { Auditoria } from './entities/auditoria.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigSchema>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.database', { infer: true }),
        entities: [
          Cliente,
          CuentaPuntos,
          Compra,
          LineaCompra,
          MovimientoPuntos,
          ReservaPuntos,
          ReglaPuntos,
          ConfiguracionRegla,
          Devolucion,
          Auditoria,
        ],
        synchronize: configService.get('database.synchronize', { infer: true }) ?? false,
        logging: configService.get('database.logging', { infer: true }) ?? false,
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    ClientesModule,
    CuentasPuntosModule,
    ComprasModule,
    ReglasPuntosModule,
    ReservasPuntosModule,
    AplicacionPuntosModule,
    MovimientosPuntosModule,
    DevolucionesModule,
    AuditoriaModule,
    ExportacionesModule,
    TerminosModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
