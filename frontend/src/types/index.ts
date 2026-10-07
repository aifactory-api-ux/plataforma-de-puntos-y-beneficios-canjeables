export interface Cliente {
  cliente_id: string;
  nombre: string;
  email: string;
  fecha_registro: string;
}

export interface CuentaPuntos {
  cuenta_id: string;
  cliente_id: string;
  saldo_actual: number;
  saldo_pendiente: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Compra {
  compra_id: string;
  cliente_id: string;
  canal_venta: string;
  estado: string;
  monto_total: number;
  fecha_compra: string;
  lineas?: LineaCompra[];
}

export interface LineaCompra {
  linea_id: string;
  compra_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  puntos_acumulados: number;
}

export interface ReglaPuntos {
  regla_id: string;
  nombre: string;
  descripcion: string;
  version: number;
  fecha_vigencia_inicio: string;
  fecha_vigencia_fin: string;
  activa: boolean;
  configuraciones?: ConfiguracionRegla[];
}

export interface ConfiguracionRegla {
  config_id: string;
  regla_id: string;
  tipo_config: TipoConfig;
  valor: string;
  meta_data: string;
}

export interface MovimientoPuntos {
  movimiento_id: string;
  cuenta_id: string;
  tipo_movimiento: TipoMovimiento;
  cantidad: number;
  fecha_movimiento: string;
  origen: string;
  regla_aplicada_id: string;
  auditoria_id: string;
}

export interface ReservaPuntos {
  reserva_id: string;
  cuenta_id: string;
  cantidad_reservada: number;
  fecha_reserva: string;
  estado: EstadoReserva;
}

export interface Devolucion {
  devolucion_id: string;
  compra_id: string;
  fecha_devolucion: string;
  monto_devolucion: number;
}

export interface Auditoria {
  auditoria_id: string;
  usuario_admin: string;
  accion: string;
  fecha_accion: string;
  detalles: string;
}

export type TipoMovimiento =
  | 'ACUMULACION'
  | 'CANJE'
  | 'VENCIMIENTO'
  | 'AJUSTE'
  | 'DEVOLUCION';

export type TipoConfig =
  | 'tasa'
  | 'limite'
  | 'elegibilidad'
  | 'vencimiento';

export type EstadoReserva =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CANCELADA';

export interface CreateClienteDto {
  nombre: string;
  email: string;
}

export interface InscripcionRequestDto {
  acepta_terminos: boolean;
  consentimiento_comercial: boolean;
  terminos_version: string;
}

export interface CreateLineaCompraDto {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface CreateCompraDto {
  cliente_id: string;
  canal_venta: string;
  lineas: CreateLineaCompraDto[];
}

export interface ConfirmarEntregaDto {
  estado: 'ENTREGADA';
}

export interface CreateDevolucionDto {
  monto_devolucion: number;
}

export interface CreateConfiguracionReglaDto {
  tipo_config: TipoConfig;
  valor: string;
  meta_data?: string;
}

export interface CreateReglaPuntosDto {
  nombre: string;
  descripcion: string;
  version: number;
  fecha_vigencia_inicio: string;
  fecha_vigencia_fin?: string;
  activa: boolean;
  configuraciones?: CreateConfiguracionReglaDto[];
}

export interface UpdateReglaPuntosDto {
  nombre?: string;
  descripcion?: string;
  version?: number;
  fecha_vigencia_inicio?: string;
  fecha_vigencia_fin?: string;
  activa?: boolean;
}

export interface MovimientoQueryDto {
  cliente_id?: string;
  cuenta_id?: string;
  tipo_movimiento?: TipoMovimiento;
  fecha_desde?: string;
  fecha_hasta?: string;
  origen?: string;
}

export interface AjustePuntosRequestDto {
  cuenta_id: string;
  cantidad: number;
  usuario_admin: string;
  detalles: string;
}

export interface CreateReservaDto {
  cuenta_id: string;
  cantidad_reservada: number;
}

export interface AplicarPuntosRequestDto {
  cliente_id: string;
  compra_id: string;
  puntos_a_usar: number;
}

export interface ExportMovimientosQueryDto {
  cliente_id: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  tipo_movimiento?: TipoMovimiento;
  format: 'csv';
}

export interface TerminosResponseDto {
  version: string;
  contenido: string;
  fecha_vigencia: string;
}

export interface AdminResumenDto {
  total_clientes: number;
  total_puntos_disponibles: number;
  total_puntos_pendientes: number;
  total_canjeados: number;
  total_vencidos: number;
  tendencia: 'up' | 'down' | 'flat';
}
