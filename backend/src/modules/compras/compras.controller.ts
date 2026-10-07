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
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ConfirmarEntregaDto } from './dto/confirmar-entrega.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { Compra } from '../../entities/compra.entity';
import { LineaCompra } from '../../entities/linea-compra.entity';
import { Devolucion } from '../../entities/devolucion.entity';

@ApiTags('Compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva compra y acumular puntos pendientes' })
  @ApiResponse({
    status: 201,
    description: 'Compra creada exitosamente con puntos acumulados',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Cliente o cuenta de puntos no encontrada' })
  async create(@Body() createCompraDto: CreateCompraDto): Promise<Compra & { lineas: LineaCompra[] }> {
    return this.comprasService.create(createCompraDto);
  }

  @Get(':compraId')
  @ApiOperation({ summary: 'Obtener una compra por su ID con sus líneas' })
  @ApiParam({ name: 'compraId', description: 'Identificador único de la compra', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Compra encontrada con líneas',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  async findOne(@Param('compraId', ParseUUIDPipe) compraId: string): Promise<Compra & { lineas: LineaCompra[] }> {
    return this.comprasService.findOne(compraId);
  }

  @Post(':compraId/confirmar-entrega')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar la entrega de una compra y liberar puntos pendientes' })
  @ApiParam({ name: 'compraId', description: 'Identificador único de la compra', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Entrega confirmada y puntos liberados exitosamente',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'La compra ya ha sido entregada' })
  @ApiResponse({ status: 404, description: 'Compra o cuenta no encontrada' })
  async confirmarEntrega(
    @Param('compraId', ParseUUIDPipe) compraId: string,
    @Body() confirmarEntregaDto: ConfirmarEntregaDto,
  ): Promise<Compra & { lineas: LineaCompra[] }> {
    return this.comprasService.confirmarEntrega(compraId, confirmarEntregaDto);
  }

  @Post(':compraId/configurar-entrega')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Configurar la entrega de una compra y liberar puntos pendientes' })
  @ApiParam({ name: 'compraId', description: 'Identificador único de la compra', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Entrega configurada exitosamente',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'La compra ya ha sido entregada' })
  @ApiResponse({ status: 404, description: 'Compra o cuenta no encontrada' })
  async configurarEntrega(
    @Param('compraId', ParseUUIDPipe) compraId: string,
    @Body() confirmarEntregaDto: ConfirmarEntregaDto,
  ): Promise<Compra & { lineas: LineaCompra[] }> {
    return this.comprasService.confirmarEntrega(compraId, confirmarEntregaDto);
  }

  @Post(':compraId/devolucion')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una devolución y revertir los puntos de la compra' })
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
