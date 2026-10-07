import { Module } from '@nestjs/common';
import { TerminosController } from './terminos.controller';
import { TerminosService } from './terminos.service';

@Module({
  controllers: [TerminosController],
  providers: [TerminosService],
  exports: [TerminosService],
})
export class TerminosModule {}
