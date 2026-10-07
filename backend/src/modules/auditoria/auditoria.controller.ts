import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service';
import { Auditoria } from '../../entities/auditoria.entity';
import { QueryAuditoriaDto } from './dto/query-auditoria.dto';

@ApiTags('Auditorias')
@Controller('auditorias')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar registros de auditoria con filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de auditoria',
    type: [Auditoria],
  })
  async findAll(@Query() query: QueryAuditoriaDto): Promise<Auditoria[]> {
    return this.auditoriaService.findAll(query);
  }

  @Get(':auditoriaId')
  @ApiOperation({ summary: 'Obtener un registro de auditoria por su ID' })
  @ApiParam({ name: 'auditoriaId', description: 'Identificador unico del registro de auditoria', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Registro de auditoria encontrado',
    type: Auditoria,
  })
  @ApiResponse({ status: 404, description: 'Registro de auditoria no encontrado' })
  async findOne(@Param('auditoriaId', ParseUUIDPipe) auditoriaId: string): Promise<Auditoria> {
    return this.auditoriaService.findOne(auditoriaId);
  }
}
