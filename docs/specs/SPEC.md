# SPEC.md

## 1. TECHNOLOGY STACK

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Backend runtime | Node.js | 20 LTS | NestJS runs on Node 20 |
| Backend framework | NestJS | 10.x | TypeScript, module/controller/service architecture |
| Language | TypeScript | 5.x | Strict mode |
| ORM | TypeORM | 0.3.x | PostgreSQL driver |
| Database | PostgreSQL | 15 | Stores all schema entities exactly per Architect ERD |
| Cache / reservations | Redis | 7.x | Used for short-lived point reservations and read-through cache of balances |
| Frontend | React | 18 | React 18 concurrent features |
| Frontend build tool | Vite | 5.x | TypeScript + React |
| Frontend language | TypeScript | 5.x | Strict mode |
| UI styling | CSS + Design Tokens | — | Tokens imported from `frontend/src/styles/tokens.ts`; no CSS framework |
| Containerization | Docker | — | Multi-stage builds; Nginx serves frontend |
| Orchestration | Kubernetes | — | Manifests for backend, frontend, PostgreSQL, Redis |

## 2. DATA CONTRACTS

All entity names and field names below match the Architect Database Schema Contract exactly. Dates are ISO 8601 strings in TypeScript (`string`). Decimals and integers are TypeScript `number`. Boolean fields are TypeScript `boolean`.

### 2.1 Entity TypeScript Interfaces (shared shape used by backend and frontend)

```typescript
// CLIENTE
export interface Cliente {
  cliente_id: string;        // PK
  nombre: string;
  email: string;
  fecha_registro: string;    // ISO 8601
}

// CUENTA_PUNTOS
export interface CuentaPuntos {
  cuenta_id: string;         // PK
  cliente_id: string;        // FK
  saldo_actual: number;      // decimal
  saldo_pendiente: number;   // decimal
  fecha_creacion: string;    // ISO 8601
  fecha_actualizacion: string; // ISO 8601
}

// COMPRA
export interface Compra {
  compra_id: string;         // PK
  cliente_id: string;        // FK
  canal_venta: string;
  estado: string;
  monto_total: number;       // decimal
  fecha_compra: string;      // ISO 8601
  lineas?: LineaCompra[];    // populated on detail responses
}

// LINEA_COMPRA
export interface LineaCompra {
  linea_id: string;          // PK
  compra_id: string;         // FK
  producto_id: string;
  cantidad: number;          // integer
  precio_unitario: number;   // decimal
  puntos_acumulados: number; // decimal
}

// REGLA_PUNTOS
export interface ReglaPuntos {
  regla_id: string;          // PK
  nombre: string;
  descripcion: string;
  version: number;           // integer
  fecha_vigencia_inicio: string; // ISO 8601
  fecha_vigencia_fin: string;    // ISO 8601, nullable
  activa: boolean;
  configuraciones?: ConfiguracionRegla[];
}

// CONFIGURACION_REGLA
export interface ConfiguracionRegla {
  config_id: string;         // PK
  regla_id: string;          // FK
  tipo_config: TipoConfig;
  valor: string;
  meta_data: string;
}

// MOVIMIENTO_PUNTOS
export interface MovimientoPuntos {
  movimiento_id: string;     // PK
  cuenta_id: string;         // FK
  tipo_movimiento: TipoMovimiento;
  cantidad: number;          // decimal
  fecha_movimiento: string;  // ISO 8601
  origen: string;            // compra_id, canje_id, ajuste_id, etc.
  regla_aplicada_id: string; // FK, nullable
  auditoria_id: string;      // FK, nullable
}

// RESERVA_PUNTOS
export interface ReservaPuntos {
  reserva_id: string;        // PK
  cuenta_id: string;         // FK
  cantidad_reservada: number;// decimal
  fecha_reserva: string;     // ISO 8601
  estado: EstadoReserva;
}

// DEVOLUCION
export interface Devolucion {
  devolucion_id: string;     // PK
  compra_id: string;         // FK
  fecha_devolucion: string;  // ISO 8601
  monto_devolucion: number;  // decimal
}

// AUDITORIA
export interface Auditoria {
  auditoria_id: string;      // PK
  usuario_admin: string;
  accion: string;
  fecha_accion: string;      // ISO 8601
  detalles: string;
}
```

### 2.2 Enum Types

```typescript
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
```

### 2.3 API Request/Response DTOs

```typescript
// Clientes
export interface CreateClienteDto {
  nombre: string;
  email: string;
}

export interface InscripcionRequestDto {
  acepta_terminos: boolean;
  consentimiento_comercial: boolean;
  terminos_version: string;
}

// Compras
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

// Devoluciones
export interface CreateDevolucionDto {
  monto_devolucion: number;
}

// Reglas
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

// Movimientos
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

// Reservas
export interface CreateReservaDto {
  cuenta_id: string;
  cantidad_reservada: number;
}

// Aplicación de puntos
export interface AplicarPuntosRequestDto {
  cliente_id: string;
  compra_id: string;
  puntos_a_usar: number;
}

// Export
export interface ExportMovimientosQueryDto {
  cliente_id: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  tipo_movimiento?: TipoMovimiento;
  format: 'csv';
}

// Términos
export interface TerminosResponseDto {
  version: string;
  contenido: string;
  fecha_vigencia: string;
}

// Admin resumen
export interface AdminResumenDto {
  total_clientes: number;
  total_puntos_disponibles: number;
  total_puntos_pendientes: number;
  total_canjeados: number;
  total_vencidos: number;
  tendencia: 'up' | 'down' | 'flat';
}
```

### 2.4 Frontend UI Contracts

```typescript
export interface CurrentUser {
  cliente_id: string;
  nombre: string;
  email: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Column {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
}

export interface Row {
  [key: string]: string | number;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'search';
  options?: SelectOption[];
}

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface Tab {
  id: string;
  label: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}
```

## 3. API ENDPOINTS

Base path: `http://<backend-host>:3000/api/v1`

### 3.1 Health

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/health` | — | `{ status: 'ok', uptime: number }` |

### 3.2 Clientes

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/clientes` | `CreateClienteDto` | `Cliente` |
| GET | `/clientes/:clienteId` | — | `Cliente` |
| GET | `/clientes/:clienteId/compras` | query: `{ estado?: string, fecha_desde?: string, fecha_hasta?: string }` | `Compra[]` |
| POST | `/clientes/:clienteId/inscripcion` | `InscripcionRequestDto` | `{ cliente_id: string, cuenta_id: string, estado: 'ACTIVO' }` |
| GET | `/clientes/:clienteId/cuenta-puntos` | — | `CuentaPuntos` |

### 3.3 Cuentas de Puntos

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/cuentas-puntos/:cuentaId` | — | `CuentaPuntos` |
| GET | `/cuentas-puntos/:cuentaId/movimientos` | query: `MovimientoQueryDto` | `MovimientoPuntos[]` |
| POST | `/cuentas-puntos/:cuentaId/ajuste` | `AjustePuntosRequestDto` | `MovimientoPuntos` |

### 3.4 Compras

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/compras` | `CreateCompraDto` | `Compra` with `lineas` populated including `puntos_acumulados`. Creates a `MovimientoPuntos` of type `ACUMULACION` with `origen=compra_id`, and increments `saldo_pendiente`. |
| GET | `/compras/:compraId` | — | `Compra` with `lineas` |
| POST | `/compras/:compraId/configurar-entrega` | `{ estado: 'ENTREGADA' }` | `Compra`. Moves accumulated points from `saldo_pendiente` to `saldo_actual`. |
| POST | `/compras/:compraId/devolucion` | `CreateDevolucionDto` | `Devolucion`. Creates a `MovimientoPuntos` of type `DEVOLUCION` with `origen=devolucion_id` and reverses the corresponding points. |

### 3.5 Reglas de Puntos

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/reglas-puntos` | — | `ReglaPuntos[]` |
| GET | `/reglas-puntos/:reglaId` | — | `ReglaPuntos` |
| POST | `/reglas-puntos` | `CreateReglaPuntosDto` | `ReglaPuntos` with `configuraciones` |
| PUT | `/reglas-puntos/:reglaId` | `UpdateReglaPuntosDto` | `ReglaPuntos` |
| GET | `/reglas-puntos/:reglaId/configuraciones` | — | `ConfiguracionRegla[]` |
| POST | `/reglas-puntos/:reglaId/configuraciones` | `CreateConfiguracionReglaDto` | `ConfiguracionRegla` |
| PUT | `/reglas-puntos/configuraciones/:configId` | `CreateConfiguracionReglaDto` | `ConfiguracionRegla` |

### 3.6 Reservas de Puntos

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/reservas-puntos` | `CreateReservaDto` | `ReservaPuntos` with `estado='PENDIENTE'`. Decrements `saldo_actual` and stores reservation in Redis. |
| GET | `/reservas-puntos/:reservaId` | — | `ReservaPuntos` |
| POST | `/reservas-puntos/:reservaId/confirmar` | — | `ReservaPuntos` with `estado='CONFIRMADA'`. Creates `MovimientoPuntos` of type `CANJE`. |
| POST | `/reservas-puntos/:reservaId/cancelar` | — | `ReservaPuntos` with `estado='CANCELADA'`. Restores `saldo_actual`. |

### 3.7 Movimientos de Puntos

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/movimientos-puntos` | query: `MovimientoQueryDto` | `MovimientoPuntos[]` |
| GET | `/movimientos-puntos/:movimientoId` | — | `MovimientoPuntos` |

### 3.8 Vencimientos

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/vencimientos` | query: `{ cliente_id: string, meses_ventana?: number }` | `Array<{ fecha_vencimiento: string, puntos: number, regla_id: string }>`. Computed from `MovimientoPuntos` and `REGLA_PUNTOS` vencimiento config. |

### 3.9 Aplicación de Puntos en el Pago

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/aplicacion-puntos` | `AplicarPuntosRequestDto` | `ReservaPuntos` with `estado='PENDIENTE'`. Validates available balance and creates reservation using Redis. |

### 3.10 Exportaciones

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/exportaciones/movimientos` | query: `ExportMovimientosQueryDto` | `text/csv` file stream of `MovimientoPuntos` filtered by `cliente_id`, dates, and type. |

### 3.11 Términos

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/terminos` | — | `TerminosResponseDto` |

### 3.12 Auditoría

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/auditorias` | query: `{ usuario_admin?: string, fecha_desde?: string, fecha_hasta?: string }` | `Auditoria[]` |
| GET | `/auditorias/:auditoriaId` | — | `Auditoria` |

### 3.13 Admin Resumen

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/admin/resumen` | — | `AdminResumenDto` |

## 4. FILE STRUCTURE

### 4.1 Port Table

| Service | Listening Port | Host Port | Path |
|---|---|---|---|
| backend-api | 3000 | 23001 | backend/ |
| frontend-web | 80 | 23002 | frontend/ |
| postgres | 5432 | 25432 | infrastructure/postgres/ |
| redis | 6379 | 26379 | infrastructure/redis/ |

Dockerfile `EXPOSE` and `CMD` must use the exact internal listening port above.

### 4.2 Backend (`backend/`)

```
backend/
├── Dockerfile                                  # Multi-stage build for NestJS, EXPOSE 3000
├── package.json                                # Backend dependencies
├── tsconfig.json                               # TypeScript config
├── nest-cli.json                               # NestJS CLI config
├── .env.example                                # Environment template
├── src/
│   ├── main.ts                                 # Bootstrap NestJS, listen on PORT (3000)
│   ├── app.module.ts                           # Root module; imports feature modules, TypeORM, Redis
│   ├── config/
│   │   └── configuration.ts                    # Loads env vars into typed config object
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts        # Normalizes HTTP error responses
│   │   └── interceptors/
│   │       └── transform.interceptor.ts        # Wraps responses in { data }
│   ├── entities/
│   │   ├── cliente.entity.ts                   # TypeORM entity for CLIENTE
│   │   ├── cuenta-puntos.entity.ts             # TypeORM entity for CUENTA_PUNTOS
│   │   ├── compra.entity.ts                    # TypeORM entity for COMPRA
│   │   ├── linea-compra.entity.ts              # TypeORM entity for LINEA_COMPRA
│   │   ├── regla-puntos.entity.ts              # TypeORM entity for REGLA_PUNTOS
│   │   ├── configuracion-regla.entity.ts       # TypeORM entity for CONFIGURACION_REGLA
│   │   ├── movimiento-puntos.entity.ts         # TypeORM entity for MOVIMIENTO_PUNTOS
│   │   ├── reserva-puntos.entity.ts            # TypeORM entity for RESERVA_PUNTOS
│   │   ├── devolucion.entity.ts                # TypeORM entity for DEVOLUCION
│   │   └── auditoria.entity.ts                 # TypeORM entity for AUDITORIA
│   ├── modules/
│   │   ├── clientes/
│   │   │   ├── clientes.module.ts
│   │   │   ├── clientes.controller.ts
│   │   │   ├── clientes.service.ts
│   │   │   └── dto/create-cliente.dto.ts
│   │   ├── cuentas-puntos/
│   │   │   ├── cuentas-puntos.module.ts
│   │   │   ├── cuentas-puntos.controller.ts
│   │   │   ├── cuentas-puntos.service.ts
│   │   │   └── dto/adjust-cuenta.dto.ts
│   │   ├── compras/
│   │   │   ├── compras.module.ts
│   │   │   ├── compras.controller.ts
│   │   │   ├── compras.service.ts           # Accumulation logic; pending-to-available release
│   │   │   └── dto/
│   │   │       ├── create-compra.dto.ts
│   │   │       ├── create-linea-compra.dto.ts
│   │   │       └── confirmar-entrega.dto.ts
│   │   ├── reglas-puntos/
│   │   │   ├── reglas-puntos.module.ts
│   │   │   ├── reglas-puntos.controller.ts
│   │   │   ├── reglas-puntos.service.ts     # Rule evaluation engine
│   │   │   └── dto/
│   │   │       ├── create-regla.dto.ts
│   │   │       ├── update-regla.dto.ts
│   │   │       └── create-configuracion-regla.dto.ts
│   │   ├── movimientos-puntos/
│   │   │   ├── movimientos-puntos.module.ts
│   │   │   ├── movimientos-puntos.controller.ts
│   │   │   ├── movimientos-puntos.service.ts
│   │   │   └── dto/query-movimientos.dto.ts
│   │   ├── reservas-puntos/
│   │   │   ├── reservas-puntos.module.ts
│   │   │   ├── reservas-puntos.controller.ts
│   │   │   ├── reservas-puntos.service.ts   # Redis-backed reservation state machine
│   │   │   └── dto/create-reserva.dto.ts
│   │   ├── devoluciones/
│   │   │   ├── devoluciones.module.ts
│   │   │   ├── devoluciones.controller.ts
│   │   │   ├── devoluciones.service.ts      # Reversal of points
│   │   │   └── dto/create-devolucion.dto.ts
│   │   ├── auditoria/
│   │   │   ├── auditoria.module.ts
│   │   │   ├── auditoria.controller.ts
│   │   │   └── auditoria.service.ts
│   │   ├── aplicacion-puntos/
│   │   │   ├── aplicacion-puntos.module.ts
│   │   │   ├── aplicacion-puntos.controller.ts
│   │   │   ├── aplicacion-puntos.service.ts
│   │   │   └── dto/aplicar-puntos.dto.ts
│   │   ├── exportaciones/
│   │   │   ├── exportaciones.module.ts
│   │   │   ├── exportaciones.controller.ts
│   │   │   └── exportaciones.service.ts     # CSV generation
│   │   ├── terminos/
│   │   │   ├── terminos.module.ts
│   │   │   ├── terminos.controller.ts
│   │   │   └── terminos.service.ts
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts             # Aggregates admin resumen
│   └── health/
│       └── health.controller.ts
```

### 4.3 Frontend (`frontend/`)

```
frontend/
├── Dockerfile                                  # Build with Vite, serve with Nginx, EXPOSE 80
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html                                  # <script type="module" src="/src/main.tsx">
├── .env.example
├── src/
│   ├── main.tsx                                # React entry point
│   ├── App.tsx                                 # Root component with router and shell
│   ├── index.css                               # Global CSS resets and base font
│   ├── styles/
│   │   └── tokens.ts                           # DESIGN TOKENS (verbatim)
│   ├── types/
│   │   ├── index.ts                            # All domain interfaces and enums
│   │   └── ui.ts                               # UI-specific types (NavItem, Column, etc.)
│   ├── services/
│   │   ├── api.ts                              # Axios instance with baseURL and interceptors
│   │   ├── clientes.ts                        # API calls for clientes
│   │   ├── compras.ts                          # API calls for compras
│   │   ├── reglas.ts                           # API calls for reglas (admin)
│   │   ├── movimientos.ts                      # API calls for movimientos/exportaciones
│   │   ├── reservas.ts                         # API calls for reservas
│   │   ├── aplicacion-puntos.ts                # API calls for aplicación de puntos
│   │   ├── terminos.ts                         # API calls for términos
│   │   └── admin.ts                            # API calls for admin resumen
│   ├── hooks/
│   │   ├── usePortalCliente.ts                # Client portal aggregate state
│   │   ├── useInscripcion.ts                  # Enrollment state
│   │   ├── useResumenPuntos.ts                # Points summary state
│   │   ├── useSaldoPendiente.ts               # Pending balance state
│   │   ├── useHistorial.ts                    # History with filters state
│   │   ├── useVencimientos.ts                 # Upcoming expirations state
│   │   ├── useAplicacionPuntos.ts             # Payment points application state
│   │   └── useTerminos.ts                     # Terms state
│   ├── pages/
│   │   ├── PortalCliente.tsx                  # Page: Portal del cliente
│   │   ├── Inscripcion.tsx                    # Page: Inscripción
│   │   ├── ResumenPuntos.tsx                  # Page: Resumen de puntos
│   │   ├── SaldoDisponiblePendiente.tsx       # Page: Saldo disponible y pendiente
│   │   ├── Historial.tsx                      # Page: Historial
│   │   ├── ProximosVencimientos.tsx           # Page: Próximos vencimientos
│   │   ├── Terminos.tsx                       # Page: Términos
│   │   └── AplicacionPuntosPago.tsx           # Page: Aplicación de puntos en el pago
│   ├── components/
│   │   ├── ui/
│   │   │   ├── NavegacionPrincipal.tsx
│   │   │   ├── BotonPrimario.tsx
│   │   │   ├── Tarjeta.tsx
│   │   │   ├── ResumenPuntos.tsx
│   │   │   ├── EtiquetaEstado.tsx
│   │   │   ├── CampoTexto.tsx
│   │   │   ├── Selector.tsx
│   │   │   ├── TablaDatos.tsx
│   │   │   ├── BarraFiltros.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alerta.tsx
│   │   │   ├── EstadoVacio.tsx
│   │   │   ├── FilaMovimiento.tsx
│   │   │   ├── PasosProceso.tsx
│   │   │   ├── Pestanas.tsx
│   │   │   ├── PanelResumenAdmin.tsx
│   │   │   └── SubidaEvidencia.tsx
│   │   └── layout/
│   │       └── AppShell.tsx                    # Global header/nav/footer shell
│   └── router/
│       └── AppRouter.tsx                       # Route definitions mapping pages to /portal, /inscripcion, etc.
```

### 4.4 Root and Infrastructure

```
├── docker-compose.yml                          # Services: backend, frontend, postgres, redis
├── .env.example                                # Root env template
├── .gitignore
├── README.md
└── infrastructure/
    └── k8s/
        ├── namespace.yaml
        ├── configmap.yaml
        ├── backend-deployment.yaml
        ├── backend-service.yaml
        ├── frontend-deployment.yaml
        ├── frontend-service.yaml
        ├── postgres-statefulset.yaml
        ├── postgres-service.yaml
        ├── redis-deployment.yaml
        └── redis-service.yaml
```

## 5. ENVIRONMENT VARIABLES

### 5.1 Backend (`backend-service`)

| Variable | Type | Description | Example |
|---|---|---|---|
| `PORT` | number | Backend listening port | `3000` |
| `NODE_ENV` | string | Environment | `development` |
| `API_PREFIX` | string | Global API path prefix | `/api/v1` |
| `DB_HOST` | string | PostgreSQL host | `postgres` |
| `DB_PORT` | number | PostgreSQL port | `5432` |
| `DB_USER` | string | PostgreSQL user | `camper_user` |
| `DB_PASSWORD` | string | PostgreSQL password | `camper_pass` |
| `DB_NAME` | string | PostgreSQL database | `camper_points` |
| `DB_SYNC` | boolean | TypeORM synchronize (dev only) | `false` |
| `DB_SSL` | boolean | Enable SSL for DB | `false` |
| `REDIS_HOST` | string | Redis host | `redis` |
| `REDIS_PORT` | number | Redis port | `6379` |
| `REDIS_PASSWORD` | string | Redis password (optional) | `` |
| `CORS_ORIGIN` | string | Allowed frontend origin | `http://localhost:23002` |
| `LOG_LEVEL` | string | NestJS log level | `debug` |

### 5.2 Frontend (`frontend-web`)

| Variable | Type | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | string | Backend API base URL | `http://localhost:23001/api/v1` |
| `VITE_PORT` | number | Vite dev server port (dev only) | `5173` |

### 5.3 PostgreSQL service

| Variable | Type | Description | Example |
|---|---|---|---|
| `POSTGRES_DB` | string | Database name | `camper_points` |
| `POSTGRES_USER` | string | Database user | `camper_user` |
| `POSTGRES_PASSWORD` | string | Database password | `camper_pass` |

### 5.4 Redis service

| Variable | Type | Description | Example |
|---|---|---|---|
| `REDIS_PASSWORD` | string | Redis AUTH password | `redis_pass` |

## 6. IMPORT CONTRACTS

### 6.1 Backend Imports

```typescript
// Entity exports (each file exports its entity class and interface)
import { Cliente } from './entities/cliente.entity';
import { CuentaPuntos } from './entities/cuenta-puntos.entity';
import { Compra } from './entities/compra.entity';
import { LineaCompra } from './entities/linea-compra.entity';
import { ReglaPuntos } from './entities/regla-puntos.entity';
import { ConfiguracionRegla } from './entities/configuracion-regla.entity';
import { MovimientoPuntos } from './entities/movimiento-puntos.entity';
import { ReservaPuntos } from './entities/reserva-puntos.entity';
import { Devolucion } from './entities/devolucion.entity';
import { Auditoria } from './entities/auditoria.entity';

// Module exports
import { ClientesModule } from './modules/clientes/clientes.module';
import { ClientesService } from './modules/clientes/clientes.service';
import { ClientesController } from './modules/clientes/clientes.controller';
import { CuentasPuntosModule } from './modules/cuentas-puntos/cuentas-puntos.module';
import { CuentasPuntosService } from './modules/cuentas-puntos/cuentas-puntos.service';
import { CuentasPuntosController } from './modules/cuentas-puntos/cuentas-puntos.controller';
import { ComprasModule } from './modules/compras/compras.module';
import { ComprasService } from './modules/compras/compras.service';
import { ComprasController } from './modules/compras/compras.controller';
import { ReglasPuntosModule } from './modules/reglas-puntos/reglas-puntos.module';
import { ReglasPuntosService } from './modules/reglas-puntos/reglas-puntos.service';
import { ReglasPuntosController } from './modules/reglas-puntos/reglas-puntos.controller';
import { MovimientosPuntosModule } from './modules/movimientos-puntos/movimientos-puntos.module';
import { MovimientosPuntosService } from './modules/movimientos-puntos/movimientos-puntos.service';
import { MovimientosPuntosController } from './modules/movimientos-puntos/movimientos-puntos.controller';
import { ReservasPuntosModule } from './modules/reservas-puntos/reservas-puntos.module';
import { ReservasPuntosService } from './modules/reservas-puntos/reservas-puntos.service';
import { ReservasPuntosController } from './modules/reservas-puntos/reservas-puntos.controller';
import { DevolucionesModule } from './modules/devoluciones/devoluciones.module';
import { DevolucionesService } from './modules/devoluciones/devoluciones.service';
import { DevolucionesController } from './modules/devoluciones/devoluciones.controller';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { AuditoriaService } from './modules/auditoria/auditoria.service';
import { AuditoriaController } from './modules/auditoria/auditoria.controller';
import { AplicacionPuntosModule } from './modules/aplicacion-puntos/aplicacion-puntos.module';
import { AplicacionPuntosService } from './modules/aplicacion-puntos/aplicacion-puntos.service';
import { AplicacionPuntosController } from './modules/aplicacion-puntos/aplicacion-puntos.controller';
import { ExportacionesModule } from './modules/exportaciones/exportaciones.module';
import { ExportacionesService } from './modules/exportaciones/exportaciones.service';
import { ExportacionesController } from './modules/exportaciones/exportaciones.controller';
import { TerminosModule } from './modules/terminos/terminos.module';
import { TerminosService } from './modules/terminos/terminos.service';
import { TerminosController } from './modules/terminos/terminos.controller';
import { AdminModule } from './modules/admin/admin.module';
import { AdminService } from './modules/admin/admin.service';
import { AdminController } from './modules/admin/admin.controller';
import { HealthController } from './health/health.controller';
```

### 6.2 Frontend Imports

```typescript
// Design tokens
import { tokens } from './styles/tokens';

// UI components
import { NavegacionPrincipal } from './components/ui/NavegacionPrincipal';
import { BotonPrimario } from './components/ui/BotonPrimario';
import { Tarjeta } from './components/ui/Tarjeta';
import { ResumenPuntos } from './components/ui/ResumenPuntos';
import { EtiquetaEstado } from './components/ui/EtiquetaEstado';
import { CampoTexto } from './components/ui/CampoTexto';
import { Selector } from './components/ui/Selector';
import { TablaDatos } from './components/ui/TablaDatos';
import { BarraFiltros } from './components/ui/BarraFiltros';
import { Modal } from './components/ui/Modal';
import { Alerta } from './components/ui/Alerta';
import { EstadoVacio } from './components/ui/EstadoVacio';
import { FilaMovimiento } from './components/ui/FilaMovimiento';
import { PasosProceso } from './components/ui/PasosProceso';
import { Pestanas } from './components/ui/Pestanas';
import { PanelResumenAdmin } from './components/ui/PanelResumenAdmin';
import { SubidaEvidencia } from './components/ui/SubidaEvidencia';

// Hooks
import { usePortalCliente } from './hooks/usePortalCliente';
import { useInscripcion } from './hooks/useInscripcion';
import { useResumenPuntos } from './hooks/useResumenPuntos';
import { useSaldoPendiente } from './hooks/useSaldoPendiente';
import { useHistorial } from './hooks/useHistorial';
import { useVencimientos } from './hooks/useVencimientos';
import { useAplicacionPuntos } from './hooks/useAplicacionPuntos';
import { useTerminos } from './hooks/useTerminos';

// Types
import type {
  Cliente,
  CuentaPuntos,
  Compra,
  LineaCompra,
  ReglaPuntos,
  ConfiguracionRegla,
  MovimientoPuntos,
  ReservaPuntos,
  Devolucion,
  Auditoria,
  TipoMovimiento,
  TipoConfig,
  EstadoReserva,
  CurrentUser,
  NavItem,
  SelectOption,
  Column,
  Row,
  FilterDefinition,
  Step,
  Tab,
  EvidenceFile,
} from './types';
```

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### 7.1 Hooks

```typescript
// usePortalCliente(clienteId: string)
// Returns:
{
  cliente: Cliente | null,
  cuenta: CuentaPuntos | null,
  resumen: { disponible: number; pendiente: number; equivalenciaCOP: number } | null,
  accesosRapidos: NavItem[],
  loading: boolean,
  error: string | null,
  refetch: () => void,
}

// useInscripcion(clienteId: string)
// Returns:
{
  inscribir: (datos: { acepta_terminos: boolean; consentimiento_comercial: boolean; terminos_version: string }) => Promise<void>,
  loading: boolean,
  error: string | null,
  data: { cliente_id: string; cuenta_id: string; estado: string } | null,
}

// useResumenPuntos(clienteId: string)
// Returns:
{
  disponible: number,
  pendiente: number,
  equivalenciaCOP: number,
  exchangeRate: number,
  expiresSoonCount: number,
  loading: boolean,
  error: string | null,
  refetch: () => void,
}

// useSaldoPendiente(clienteId: string)
// Returns:
{
  saldoDisponible: number,
  saldoPendiente: number,
  totalAcumulado: number,
  lotes: Array<{ compra_id: string; fecha_compra: string; puntos_pendientes: number; fecha_estimada_liberacion: string }>,
  reglaLiberacion: string,
  loading: boolean,
  error: string | null,
  refetch: () => void,
}

// useHistorial(clienteId: string)
// Returns:
{
  movimientos: MovimientoPuntos[],
  filtros: Record<string, string>,
  setFiltros: (filtros: Record<string, string>) => void,
  loading: boolean,
  error: string | null,
  exportarCSV: () => Promise<void>,
  refetch: () => void,
}

// useVencimientos(clienteId: string)
// Returns:
{
  vencimientos: Array<{ fecha_vencimiento: string; puntos: number; regla_id: string }>,
  loading: boolean,
  error: string | null,
  refetch: () => void,
}

// useAplicacionPuntos()
// Returns:
{
  aplicarPuntos: (clienteId: string, compraId: string, puntosAUsar: number) => Promise<ReservaPuntos>,
  reserva: ReservaPuntos | null,
  loading: boolean,
  error: string | null,
}

// useTerminos()
// Returns:
{
  terminos: TerminosResponseDto | null,
  loading: boolean,
  error: string | null,
  refetch: () => void,
}
```

### 7.2 Base Component Props

All components below are located under `frontend/src/components/ui/`. The prop interface name is `<ComponentName>Props` and is exported from each file.

```typescript
// NavegacionPrincipal
export interface NavegacionPrincipalProps {
  items: NavItem[];
  activeId: string;
  user?: CurrentUser;
  onNavigate: (id: string) => void;
}

// BotonPrimario
export interface BotonPrimarioProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

// Tarjeta
export interface TarjetaProps {
  title?: string;
  sectionTitle?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'subtle' | 'card';
  children: ReactNode;
}

// ResumenPuntos
export interface ResumenPuntosProps {
  availablePoints: number;
  pendingPoints: number;
  currency: 'COP';
  exchangeRate: number;
  expiresSoonCount?: number;
}

// EtiquetaEstado
export interface EtiquetaEstadoProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  icon?: ReactNode;
}

// CampoTexto
export interface CampoTextoProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'search';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

// Selector
export interface SelectorProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

// TablaDatos
export interface TablaDatosProps {
  columns: Column[];
  rows: Row[];
  loading?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  onRowClick?: (row: Row) => void;
}

// BarraFiltros
export interface BarraFiltrosProps {
  filters: FilterDefinition[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

// Modal
export interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// Alerta
export interface AlertaProps {
  tone: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// EstadoVacio
export interface EstadoVacioProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// FilaMovimiento
export interface FilaMovimientoProps {
  type: 'acumulacion' | 'canje' | 'reversion' | 'ajuste' | 'vencimiento';
  points: number;
  timestamp: string;
  reference?: string;
  status?: string;
}

// PasosProceso
export interface PasosProcesoProps {
  steps: Step[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

// Pestanas
export interface PestanasProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

// PanelResumenAdmin
export interface PanelResumenAdminProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
  helperText?: string;
  icon?: ReactNode;
}

// SubidaEvidencia
export interface SubidaEvidenciaProps {
  files: EvidenceFile[];
  maxFiles?: number;
  acceptedTypes?: string[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
}
```

## 8. FILE EXTENSION CONVENTION

- **Project language**: TypeScript.
- **Frontend source files**: React components and pages use `.tsx`. Non-component files use `.ts`.
- **Backend source files**: `.ts`.
- **Entry point**: `/src/main.tsx` referenced in `index.html` as `<script type="module" src="/src/main.tsx"></script>`.
- No `.jsx` or `.js` files in the frontend or backend source tree. Configuration files (`vite.config.ts`, `nest-cli.json`, `package.json`) follow their standard extensions.

## 9. DESIGN TOKENS

`frontend/src/styles/tokens.ts` must export the following object. Values are copied verbatim from the UI/UX contract. Do NOT substitute or invent values.

```typescript
export const tokens = {
  provisional_notice: {
    value: 'Identidad visual oficial de Camper pendiente de entrega. Los tokens siguientes son una base provisional neutra y accesible, diseñada para ser sustituida por la paleta, tipografías, logotipos y componentes aprobados por Marca/Marketing sin alterar la arquitectura de pantallas.',
    type: 'other',
  },
  breakpoints: {
    mobile: { value: '360px', type: 'other' },
    tablet: { value: '768px', type: 'other' },
    desktop: { value: '1200px', type: 'other' },
    wide: { value: '1440px', type: 'other' },
  },
  color: {
    neutral: {
      ink: { value: '#111111', type: 'color' },
      ink_soft: { value: '#1C1C1C', type: 'color' },
      graphite: { value: '#414141', type: 'color' },
      slate: { value: '#6B6B6B', type: 'color' },
      muted: { value: '#8A8782', type: 'color' },
      line: { value: '#D8D5CF', type: 'color' },
      stone: { value: '#E7E5E0', type: 'color' },
      mist: { value: '#F5F4F1', type: 'color' },
      paper: { value: '#FFFFFF', type: 'color' },
    },
    action: {
      primary: { value: '#111111', type: 'color' },
      primary_hover: { value: '#2A2A2A', type: 'color' },
      primary_active: { value: '#000000', type: 'color' },
      primary_text: { value: '#FFFFFF', type: 'color' },
      secondary: { value: '#FFFFFF', type: 'color' },
      secondary_hover: { value: '#F5F4F1', type: 'color' },
      secondary_border: { value: '#D8D5CF', type: 'color' },
      secondary_text: { value: '#111111', type: 'color' },
      ghost_text: { value: '#414141', type: 'color' },
      ghost_hover: { value: '#F5F4F1', type: 'color' },
      disabled_bg: { value: '#E7E5E0', type: 'color' },
      disabled_text: { value: '#8A8782', type: 'color' },
    },
    semantic: {
      success: {
        text: { value: '#1E6B3A', type: 'color' },
        surface: { value: '#E7F4EC', type: 'color' },
        border: { value: '#A7D7B8', type: 'color' },
        icon: { value: '#1E6B3A', type: 'color' },
      },
      warning: {
        text: { value: '#7A5200', type: 'color' },
        surface: { value: '#FFF4D6', type: 'color' },
        border: { value: '#F0D48A', type: 'color' },
        icon: { value: '#7A5200', type: 'color' },
      },
      error: {
        text: { value: '#B3261E', type: 'color' },
        surface: { value: '#FBEAE9', type: 'color' },
        border: { value: '#F2B8B5', type: 'color' },
        icon: { value: '#B3261E', type: 'color' },
      },
      info: {
        text: { value: '#1D4ED8', type: 'color' },
        surface: { value: '#EAF1FF', type: 'color' },
        border: { value: '#B8CDFB', type: 'color' },
        icon: { value: '#1D4ED8', type: 'color' },
      },
    },
    focus: { value: '#2563EB', type: 'color' },
    overlay: { value: 'rgba(17, 17, 17, 0.48)', type: 'color' },
  },
  typography: {
    family: {
      primary: { value: 'Inter', type: 'other' },
      fallback: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", type: 'other' },
      numeric: { value: "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace", type: 'other' },
    },
    scale: {
      display_lg: {
        size: { value: '44px', type: 'dimension' },
        line_height: { value: '52px', type: 'number' },
        weight: { value: '600', type: 'other' },
        letter_spacing: { value: '-0.02em', type: 'dimension' },
      },
      display_md: {
        size: { value: '36px', type: 'dimension' },
        line_height: { value: '44px', type: 'number' },
        weight: { value: '600', type: 'other' },
        letter_spacing: { value: '-0.02em', type: 'dimension' },
      },
      title_lg: {
        size: { value: '28px', type: 'dimension' },
        line_height: { value: '36px', type: 'number' },
        weight: { value: '600', type: 'other' },
        letter_spacing: { value: '-0.01em', type: 'dimension' },
      },
      title_md: {
        size: { value: '22px', type: 'dimension' },
        line_height: { value: '30px', type: 'number' },
        weight: { value: '600', type: 'other' },
        letter_spacing: { value: '-0.01em', type: 'dimension' },
      },
      title_sm: {
        size: { value: '18px', type: 'dimension' },
        line_height: { value: '26px', type: 'number' },
        weight: { value: '600', type: 'other' },
        letter_spacing: { value: '0em', type: 'dimension' },
      },
      body_lg: {
        size: { value: '16px', type: 'dimension' },
        line_height: { value: '26px', type: 'number' },
        weight: { value: '400', type: 'other' },
        letter_spacing: { value: '0em', type: 'dimension' },
      },
      body_md: {
        size: { value: '14px', type: 'dimension' },
        line_height: { value: '22px', type: 'number' },
        weight: { value: '400', type: 'other' },
        letter_spacing: { value: '0em', type: 'dimension' },
      },
      body_sm: {
        size: { value: '13px', type: 'dimension' },
        line_height: { value: '20px', type: 'number' },
        weight: { value: '400', type: 'other' },
        letter_spacing: { value: '0em', type: 'dimension' },
      },
      label_md: {
        size: { value: '14px', type: 'dimension' },
        line_height: { value: '20px', type: 'number' },
        weight: { value: '500', type: 'other' },
        letter_spacing: { value: '0em', type: 'dimension' },
      },
      label_sm: {
        size: { value: '12px', type: 'dimension' },
        line_height: { value: '18px', type: 'number' },
        weight: { value: '500', type: 'other' },
        letter_spacing: { value: '0.02em', type: 'dimension' },
      },
    },
  },
  spacing: {
    unit: { value: '4px', type: 'dimension' },
    scale: { value: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128], type: 'dimension' },
    page_gutter: {
      mobile: { value: '20px', type: 'dimension' },
      desktop: { value: '48px', type: 'dimension' },
    },
    section_gap: {
      mobile: { value: '32px', type: 'dimension' },
      desktop: { value: '64px', type: 'dimension' },
    },
    card_padding: {
      mobile: { value: '16px', type: 'dimension' },
      desktop: { value: '24px', type: 'dimension' },
    },
  },
  radii: {
    small: { value: '8px', type: 'dimension' },
    medium: { value: '12px', type: 'dimension' },
    large: { value: '16px', type: 'dimension' },
    pill: { value: '999px', type: 'dimension' },
  },
  shadows: {
    subtle: { value: '0px 1px 2px rgba(17, 17, 17, 0.06)', type: 'shadow' },
    card: { value: '0px 4px 12px rgba(17, 17, 17, 0.07)', type: 'shadow' },
    floating: { value: '0px 8px 24px rgba(17, 17, 17, 0.10)', type: 'shadow' },
    modal: { value: '0px 16px 40px rgba(17, 17, 17, 0.16)', type: 'shadow' },
    focus_ring: { value: '0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #2563EB', type: 'shadow' },
  },
  icon_image_style: {
    icon_set: { value: 'Iconos de línea, trazo 1.5px, esquinas suaves, tamaño base 20px y 24px. Los íconos acompañan etiquetas de texto para estados y acciones.', type: 'other' },
    image_style: { value: 'Fotografía de producto en recorte cálido y neutro; proporción 4:5 en tarjetas. Mientras no exista banco autorizado, se usan placeholders neutros y sin marca. Sin ilustraciones decorativas.', type: 'other' },
    logo_usage: { value: 'El logotipo oficial queda pendiente. En los prototipos se reserva un contenedor de marca de alto contraste, sin sustituir ni redibujar el logo oficial.', type: 'other' },
  },
  motion: {
    duration_fast: { value: '120ms', type: 'duration' },
    duration_base: { value: '200ms', type: 'duration' },
    duration_slow: { value: '300ms', type: 'duration' },
    easing: { value: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)', type: 'duration' },
    reduced_motion: { value: 'Respetar prefers-reduced-motion: desactivar animaciones no esenciales y mantener únicamente cambios de opacidad o estado.', type: 'duration' },
  },
  accessibility: {
    contrast_target: { value: 'WCAG 2.2 AA', type: 'other' },
    focus_visible: { value: 'Anillo de 2px en azul #2563EB con contraste suficiente sobre cualquier superficie.', type: 'other' },
    states_without_color: { value: 'Los estados de puntos, reserva, error y vencimiento siempre combinan texto, icono y color.', type: 'other' },
    touch_target: { value: 'Mínimo 44x44px para controles táctiles.', type: 'other' },
  },
};
```

## 10. FUNCTIONAL REQUIREMENTS COVERAGE

| Requirement | Implementation | Files |
|---|---|---|
| Plataforma de puntos y beneficios canjeables | Backend point engine and frontend portal | `backend/src/app.module.ts`, `frontend/src/App.tsx` |
| Architect Database Schema Contract exact entities/fields/relationships | TypeORM entities with exact snake_case field names and FK relations | `backend/src/entities/*.entity.ts` |
| CLIENTE entity | `cliente_id`, `nombre`, `email`, `fecha_registro` | `backend/src/entities/cliente.entity.ts` |
| CUENTA_PUNTOS entity | `cuenta_id`, `cliente_id`, `saldo_actual`, `saldo_pendiente`, `fecha_creacion`, `fecha_actualizacion` | `backend/src/entities/cuenta-puntos.entity.ts` |
| COMPRA entity | `compra_id`, `cliente_id`, `canal_venta`, `estado`, `monto_total`, `fecha_compra` | `backend/src/entities/compra.entity.ts` |
| LINEA_COMPRA entity | `linea_id`, `compra_id`, `producto_id`, `cantidad`, `precio_unitario`, `puntos_acumulados` | `backend/src/entities/linea-compra.entity.ts` |
| REGLA_PUNTOS entity | `regla_id`, `nombre`, `descripcion`, `version`, `fecha_vigencia_inicio`, `fecha_vigencia_fin`, `activa` | `backend/src/entities/regla-puntos.entity.ts` |
| CONFIGURACION_REGLA entity | `config_id`, `regla_id`, `tipo_config`, `valor`, `meta_data` | `backend/src/entities/configuracion-regla.entity.ts` |
| MOVIMIENTO_PUNTOS entity | `movimiento_id`, `cuenta_id`, `tipo_movimiento`, `cantidad`, `fecha_movimiento`, `origen`, `regla_aplicada_id`, `auditoria_id` | `backend/src/entities/movimiento-puntos.entity.ts` |
| RESERVA_PUNTOS entity | `reserva_id`, `cuenta_id`, `cantidad_reservada`, `fecha_reserva`, `estado` | `backend/src/entities/reserva-puntos.entity.ts` |
| DEVOLUCION entity | `devolucion_id`, `compra_id`, `fecha_devolucion`, `monto_devolucion` | `backend/src/entities/devolucion.entity.ts` |
| AUDITORIA entity | `auditoria_id`, `usuario_admin`, `accion`, `fecha_accion`, `detalles` | `backend/src/entities/auditoria.entity.ts` |
| Puntos accumulation by purchase lines | `ComprasService.create` reads active rule config, calculates `puntos_acumulados` per line, creates `MOVIMIENTO_PUNTOS` type `ACUMULACION`, increments `saldo_pendiente` | `backend/src/modules/compras/compras.service.ts`, `reglas-puntos.service.ts` |
| Rule configuration types `tasa`, `limite`, `elegibilidad`, `vencimiento` | `ReglasPuntosService` evaluates `CONFIGURACION_REGLA` entries per `tipo_config` | `backend/src/modules/reglas-puntos/reglas-puntos.service.ts` |
| Pending balance release after delivery confirmation | `POST /compras/:compraId/configurar-entrega` moves points from `saldo_pendiente` to `saldo_actual` | `backend/src/modules/compras/compras.service.ts` |
| Return/devolution reversal | `DevolucionesService` creates `DEVOLUCION` and a `MOVIMIENTO_PUNTOS` type `DEVOLUCION` with negative quantity | `backend/src/modules/devoluciones/devoluciones.service.ts` |
| Point reservations with PENDIENTE/CONFIRMADA/CANCELADA | `ReservasPuntosService` uses Redis for temporary hold; PostgreSQL for persistent state; confirm/cancel endpoints | `backend/src/modules/reservas-puntos/reservas-puntos.service.ts` |
| Points application in payment | `AplicacionPuntosService` validates available balance, creates `ReservaPuntos`, then client confirms | `backend/src/modules/aplicacion-puntos/aplicacion-puntos.service.ts` |
| History with filters by type, date, order | `GET /movimientos-puntos` with `MovimientoQueryDto`; frontend `BarraFiltros` and `TablaDatos` | `backend/src/modules/movimientos-puntos/movimientos-puntos.controller.ts`, `frontend/src/pages/Historial.tsx` |
| History CSV export | `GET /exportaciones/movimientos` returns `text/csv` | `backend/src/modules/exportaciones/exportaciones.controller.ts`, `exportaciones.service.ts`, `frontend/src/hooks/useHistorial.ts` |
| Upcoming expirations | `GET /vencimientos` computes future expirations from movement history and `vencimiento` config | `backend/src/modules/movimientos-puntos/movimientos-puntos.service.ts`, `frontend/src/pages/ProximosVencimientos.tsx` |
| Enrollment with terms acceptance and optional marketing consent | `POST /clientes/:clienteId/inscripcion` writes audit record with accion `INSCRIPCION` and consent details | `backend/src/modules/clientes/clientes.service.ts`, `frontend/src/pages/Inscripcion.tsx` |
| Versioned terms display | `GET /terminos` returns current terms version and content; frontend displays terms page and enrollment excerpt | `backend/src/modules/terminos/terminos.service.ts`, `frontend/src/pages/Terminos.tsx` |
| Client portal home | Aggregated client info, balance card, quick access, expiry notice | `frontend/src/pages/PortalCliente.tsx`, `usePortalCliente` |
| Points summary page | Available, pending, COP equivalence, recent mini-history, redemption CTA | `frontend/src/pages/ResumenPuntos.tsx`, `useResumenPuntos` |
| Available and pending balance page | Balance cards, rule explanation, lots table, release estimate | `frontend/src/pages/SaldoDisponiblePendiente.tsx`, `useSaldoPendiente` |
| Admin summary panel / consola administrativa | `GET /admin/resumen` and `PanelResumenAdmin` component | `backend/src/modules/admin/admin.service.ts`, `frontend/src/components/ui/PanelResumenAdmin.tsx` |
| Audit trail | Every admin adjustment and rule change writes `AUDITORIA`; movements link `auditoria_id` | `backend/src/modules/auditoria/auditoria.service.ts`, `clientes.service.ts` |
| Visual direction neutral premium minimal | Global CSS with warm neutral backgrounds, fine borders, soft shadows, generous whitespace | `frontend/src/index.css`, `frontend/src/styles/tokens.ts` |
| Design tokens exact copy | `tokens.ts` exports verbatim object from UI/UX contract | `frontend/src/styles/tokens.ts` |
| WCAG 2.2 AA contrast | All text colors passed through semantic tokens; focus ring token `#2563EB` | `frontend/src/styles/tokens.ts`, `frontend/src/index.css` |
| States combine text, icon, color | `EtiquetaEstado`, `Alerta`, `FilaMovimiento` always render icon + label + semantic tone | `frontend/src/components/ui/EtiquetaEstado.tsx`, `Alerta.tsx`, `FilaMovimiento.tsx` |
| 44px minimum touch targets | `BotonPrimario`, `CampoTexto`, `Selector` include min-height 44px | `frontend/src/components/ui/BotonPrimario.tsx`, `CampoTexto.tsx`, `Selector.tsx` |
| Prefers-reduced-motion respected | `motion.reduced_motion` token applied in global CSS media query | `frontend/src/index.css` |
| Responsive breakpoints 360/768/1200/1440 | CSS media queries use `tokens.breakpoints` | `frontend/src/index.css`, `frontend/src/components/layout/AppShell.tsx` |
| Navigation principal with all 8 pages | `NavegacionPrincipal` receives `items` and `activeId`; `AppShell` renders it | `frontend/src/components/ui/NavegacionPrincipal.tsx`, `frontend/src/components/layout/AppShell.tsx` |
| 17 base UI components | Each component implemented as `.tsx` under `components/ui/` with exact props | `frontend/src/components/ui/*.tsx` |
| Docker and Kubernetes deployment | Dockerfiles for backend and frontend; docker-compose with host port mappings; K8s manifests | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`, `infrastructure/k8s/*` |
| Redis cache/reservations | Redis client configured in NestJS; reservation service uses Redis with fallback to PostgreSQL | `backend/src/app.module.ts`, `backend/src/modules/reservas-puntos/reservas-puntos.service.ts` |
| PostgreSQL persistence | TypeORM connects using env vars | `backend/src/app.module.ts`, `backend/src/config/configuration.ts` |