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
import { ClientesService } from './clientes.service';
import { CreateClienteDto, InscripcionRequestDto } from './dto/create-cliente.dto';
import { Cliente } from '../../entities/cliente.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { Compra } from '../../entities/compra.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: Cliente,
  })
  @ApiResponse({ status: 409, description: 'Ya existe un cliente con este correo electrónico' })
  async create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(createClienteDto);
  }

  @Get(':clienteId')
  @ApiOperation({ summary: 'Obtener un cliente por su ID' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Cliente,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findOne(@Param('clienteId', ParseUUIDPipe) clienteId: string): Promise<Cliente> {
    return this.clientesService.findOne(clienteId);
  }

  @Get(':clienteId/cuenta-puntos')
  @ApiOperation({ summary: 'Obtener la cuenta de puntos de un cliente' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta de puntos del cliente',
    type: CuentaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Cliente o cuenta no encontrada' })
  async getCuentaPuntos(
    @Param('clienteId', ParseUUIDPipe) clienteId: string,
  ): Promise<CuentaPuntos> {
    return this.clientesService.getCuentaPuntos(clienteId);
  }

  @Get(':clienteId/compras')
  @ApiOperation({ summary: 'Obtener las compras realizadas por un cliente' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras del cliente',
    type: [Compra],
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getCompras(@Param('clienteId', ParseUUIDPipe) clienteId: string): Promise<Compra[]> {
    return this.clientesService.getCompras(clienteId);
  }

  @Post(':clienteId/inscripcion')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscribir a un cliente en el programa de puntos con aceptación de términos' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Cliente inscrito exitosamente',
    schema: {
      type: 'object',
      properties: {
        cliente_id: { type: 'string', example: 'uuid-del-cliente' },
        cuenta_id: { type: 'string', example: 'uuid-de-la-cuenta' },
        estado: { type: 'string', example: 'INSCRITO' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async inscripcion(
    @Param('clienteId', ParseUUIDPipe) clienteId: string,
    @Body() inscripcionDto: InscripcionRequestDto,
  ): Promise<{ cliente_id: string; cuenta_id: string; estado: string }> {
    return this.clientesService.inscripcion(clienteId, inscripcionDto);
  }
}
