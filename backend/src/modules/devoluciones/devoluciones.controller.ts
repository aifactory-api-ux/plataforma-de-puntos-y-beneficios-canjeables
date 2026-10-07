import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { Devolucion } from '../../entities/devolucion.entity';
import { ComprasService } from '../compras/compras.service';

@ApiTags('Devoluciones')
@Controller('devoluciones')
export class DevolucionesController {
  constructor(
    private readonly devolucionesService: DevolucionesService,
    private readonly comprasService: ComprasService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las devoluciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de devoluciones',
    type: [Devolucion],
  })
  async findAll(): Promise<Devolucion[]> {
    return this.devolucionesService.findAll();
  }

  @Get(':devolucionId')
  @ApiOperation({ summary: 'Obtener una devolución por su ID' })
  @ApiParam({ name: 'devolucionId', description: 'Identificador único de la devolución', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Devolución encontrada',
    type: Devolucion,
  })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  async findOne(@Param('devolucionId', ParseUUIDPipe) devolucionId: string): Promise<Devolucion> {
    return this.devolucionesService.findOne(devolucionId);
  }

  @Get('compra/:compraId')
  @ApiOperation({ summary: 'Obtener las devoluciones de una compra' })
  @ApiParam({ name: 'compraId', description: 'Identificador único de la compra', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Devoluciones de la compra',
    type: [Devolucion],
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  async findByCompra(@Param('compraId', ParseUUIDPipe) compraId: string): Promise<Devolucion[]> {
    return this.devolucionesService.findByCompra(compraId);
  }

  @Post(':compraId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una devolución para una compra (revertir puntos)' })
  @ApiParam({ name: 'compraId', description: 'Identificador único de la compra', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Devolución creada exitosamente',
    type: Devolucion,
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  @ApiResponse({ status: 400, description: 'La compra no ha sido entregada' })
  async crearDevolucion(
    @Param('compraId', ParseUUIDPipe) compraId: string,
    @Body() createDevolucionDto: CreateDevolucionDto,
  ): Promise<Devolucion> {
    return this.comprasService.crearDevolucion(compraId, createDevolucionDto);
  }
}
