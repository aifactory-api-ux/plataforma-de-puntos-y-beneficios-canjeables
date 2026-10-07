import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReglasPuntosService } from './reglas-puntos.service';
import { CreateReglaPuntosDto } from './dto/create-regla.dto';
import { UpdateReglaPuntosDto } from './dto/update-regla.dto';
import { CreateConfiguracionReglaDto } from './dto/create-configuracion-regla.dto';
import { ReglaPuntos } from '../../entities/regla-puntos.entity';
import { ConfiguracionRegla } from '../../entities/configuracion-regla.entity';

@ApiTags('Reglas de Puntos')
@Controller('reglas-puntos')
export class ReglasPuntosController {
  constructor(private readonly reglasPuntosService: ReglasPuntosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reglas de puntos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reglas de puntos',
    type: [ReglaPuntos],
  })
  async findAll(): Promise<ReglaPuntos[]> {
    return this.reglasPuntosService.findAll();
  }

  @Get(':reglaId')
  @ApiOperation({ summary: 'Obtener una regla de puntos por su ID' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Regla de puntos encontrada',
    type: ReglaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async findOne(@Param('reglaId', ParseUUIDPipe) reglaId: string): Promise<ReglaPuntos> {
    return this.reglasPuntosService.findOne(reglaId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva regla de puntos con configuraciones' })
  @ApiResponse({
    status: 201,
    description: 'Regla de puntos creada exitosamente',
    type: ReglaPuntos,
  })
  async create(@Body() createReglaDto: CreateReglaPuntosDto): Promise<ReglaPuntos> {
    return this.reglasPuntosService.create(createReglaDto);
  }

  @Put(':reglaId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una regla de puntos existente' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Regla de puntos actualizada exitosamente',
    type: ReglaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async update(
    @Param('reglaId', ParseUUIDPipe) reglaId: string,
    @Body() updateReglaDto: UpdateReglaPuntosDto,
  ): Promise<ReglaPuntos> {
    return this.reglasPuntosService.update(reglaId, updateReglaDto);
  }

  @Get(':reglaId/configuraciones')
  @ApiOperation({ summary: 'Obtener las configuraciones de una regla de puntos' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Configuraciones de la regla de puntos',
    type: [ConfiguracionRegla],
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async getConfiguraciones(@Param('reglaId', ParseUUIDPipe) reglaId: string): Promise<ConfiguracionRegla[]> {
    return this.reglasPuntosService.getConfiguraciones(reglaId);
  }

  @Post(':reglaId/configuraciones')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar una configuración a una regla de puntos' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Configuración creada exitosamente',
    type: ConfiguracionRegla,
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async createConfiguracion(
    @Param('reglaId', ParseUUIDPipe) reglaId: string,
    @Body() createConfiguracionDto: CreateConfiguracionReglaDto,
  ): Promise<ConfiguracionRegla> {
    return this.reglasPuntosService.createConfiguracion(reglaId, createConfiguracionDto);
  }

  @Put('configuraciones/:configId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una configuración de regla de puntos' })
  @ApiParam({ name: 'configId', description: 'Identificador único de la configuración', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente',
    type: ConfiguracionRegla,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async updateConfiguracion(
    @Param('configId', ParseUUIDPipe) configId: string,
    @Body() updateConfiguracionDto: CreateConfiguracionReglaDto,
  ): Promise<ConfiguracionRegla> {
    return this.reglasPuntosService.updateConfiguracion(configId, updateConfiguracionDto);
  }

  @Post(':reglaId/activar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar una regla de puntos' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Regla activada exitosamente',
    type: ReglaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async activar(@Param('reglaId', ParseUUIDPipe) reglaId: string): Promise<ReglaPuntos> {
    return this.reglasPuntosService.activar(reglaId);
  }

  @Post(':reglaId/desactivar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar una regla de puntos' })
  @ApiParam({ name: 'reglaId', description: 'Identificador único de la regla', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Regla desactivada exitosamente',
    type: ReglaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Regla de puntos no encontrada' })
  async desactivar(@Param('reglaId', ParseUUIDPipe) reglaId: string): Promise<ReglaPuntos> {
    return this.reglasPuntosService.desactivar(reglaId);
  }
}
