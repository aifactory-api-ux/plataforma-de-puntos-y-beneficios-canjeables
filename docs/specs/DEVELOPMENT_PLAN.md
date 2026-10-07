# DEVELOPMENT PLAN: Programa de Puntos Camper

## 1. ARCHITECTURE OVERVIEW
Aplicación full-stack para gestión de puntos y beneficios canjeables, compuesta por:

- **Backend NestJS 10** sobre Node.js 20, TypeScript estricto, TypeORM 0.3 y PostgreSQL 15. Usa Redis 7 para reservas de puntos de corta duración y caché de saldos. Sigue una arquitectura modular por dominio: clientes, cuentas-puntos, compras, reglas-puntos, movimientos-puntos, reservas-puntos, devoluciones, auditoría, aplicación-puntos, exportaciones, términos y admin.
- **Frontend React 18 + Vite 5**, TypeScript estricto, CSS puro con design tokens neutros y accesibles. Implementa 8 páginas del portal del cliente, 17 componentes UI base, 8 hooks de estado, servicios de API con Axios y router de aplicación.
- **Persistencia** mediante entidades TypeORM exactas al contrato de arquitectura: `Cliente`, `CuentaPuntos`, `Compra`, `LineaCompra`, `ReglaPuntos`, `ConfiguracionRegla`, `MovimientoPuntos`, `ReservaPuntos`, `Devolucion` y `Auditoria`.
- **API REST** bajo `/api/v1` con todos los endpoints definidos en SPEC.md: health, clientes, cuentas de puntos, compras, reglas de puntos, reservas, movimientos, vencimientos, aplicación de puntos, exportaciones, términos, auditoría y resumen administrativo.
- **Despliegue local** con Docker Compose, healthchecks y dependencias saludables. Backend expone puerto `23001` → contenedor `3000`; frontend expone `23002` → contenedor `80`; PostgreSQL expone `25432` → contenedor `5432`; Redis expone `26379` → contenedor `6379`. Incluye manifiestos Kubernetes para backend, frontend, PostgreSQL y Redis.

## 2. ACCEPTANCE CRITERIA
1. TC001: Verificar acumulación de puntos por compra de calzado elegible. → El cliente acumula 150.5 puntos en su saldo disponible, reflejando la precisión decimal en COP.
2. TC002: Verificar canje de puntos por descuento durante el proceso de pago. → La compra aplica un descuento de 20.000 COP y el saldo de puntos del cliente se reduce en 200 puntos.
3. TC003: Verificar que el cliente puede consultar su saldo y historial de puntos. → Se muestra el saldo actual de 100.5 puntos disponibles. El historial detalla movimientos de acumulación y canje con fechas y descripciones.
4. TC004: Verificar que un administrador puede configurar y activar nuevas reglas de acumulación. → La nueva regla de acumulación se guarda, activa y es visible. El motor de reglas versionado la reconoce y aplica.
5. TC005: Verificar que un agente puede realizar ajustes manuales de puntos con registro. → El saldo de puntos del cliente se incrementa en 50. El historial muestra el ajuste, el motivo y el usuario que realizó la operación.
6. TC006: Verificar reversión de puntos acumulados tras una devolución de compra. → El saldo de puntos del cliente se reduce en 100 puntos, y el historial de movimientos registra la reversión.
7. TC007: Verificar que el acceso a la configuración de reglas está restringido por rol. → El usuario no tiene acceso a la sección 'Gestión de Reglas' o las opciones de configuración están deshabilitadas/ocultas, mostrando un mensaje de 'Acceso Denegado' si aplica.
8. TC008: Verificar acumulación de puntos como pendientes y su posterior liberación. → Inicialmente, el cliente tiene 200 puntos pendientes. Después de 7 días, los 200 puntos se liberan y se añaden al saldo disponible.
9. TC009: Verificar manejo de canje de puntos simultáneo con saldo insuficiente. → Solo una de las transacciones de canje de 100 puntos debe ser exitosa. La otra transacción debe fallar con un mensaje de 'Saldo de puntos insuficiente' o similar, y el saldo final del cliente debe ser 0.
10. TC010: Verificar liberación de puntos reservados tras un pago fallido. → Los 150 puntos que fueron reservados se liberan y se reintegran al saldo disponible del cliente, volviendo a tener 300 puntos.
11. TC011: Verificar reversión de puntos en devolución parcial con puntos ya utilizados. → El sistema debe deducir los 100 puntos correspondientes al artículo A. Si el saldo actual es insuficiente, el saldo puede volverse negativo o se ajustará según la RN-08, y el historial debe reflejar claramente la operación.
12. TC012: Verificar que un administrador no puede aprobar su propio ajuste de puntos. → El Admin A no puede aprobar su propio ajuste manual de puntos. El sistema debe requerir la aprobación de un Admin B. Una vez que Admin B aprueba, el ajuste se aplica y se registra con ambos usuarios.
13. TC013: Verificar que los puntos próximos a vencer se consumen primero en un canje. → Los 50 puntos canjeados se descuentan del lote de puntos que vencen en 30 días. El cliente debe tener 50 puntos que vencen en 30 días y 100 puntos que vencen en 60 días.
14. TC014: Verificar la visualización del saldo y historial de puntos en dispositivos móviles. → El saldo de puntos, el historial y los vencimientos se muestran de forma clara y legible, con un diseño adaptativo que facilita la navegación y la comprensión en pantallas pequeñas.
15. TC001: Verificar la capacidad del servicio de puntos para manejar alta concurrencia de acumulaciones. → El servicio debe procesar todas las transacciones de acumulación con un tiempo de respuesta promedio < 500ms y sin pérdida de datos.
16. TC002: Evaluar el tiempo de respuesta al consultar el saldo y el historial de puntos de un cliente. → El saldo y el historial de puntos deben cargarse en menos de 2 segundos.
17. TC003: Validar que los permisos por rol se apliquen correctamente en la consola administrativa. → El usuario 'Marketing' debe ser denegado el acceso a la funcionalidad de ajustes manuales. El usuario 'Aprobador de Ajustes' debe tener acceso.
18. TC004: Verificar la consistencia de los saldos de puntos si la integración falla durante una transacción. → El sistema debe garantizar la consistencia del saldo de puntos, ya sea revirtiendo la acumulación o procesándola una vez restaurada la conexión, sin duplicidades ni pérdidas.
19. TC005: Asegurar que el 'Servicio de Gestión de Puntos' se recupera automáticamente tras un fallo. → La nueva instancia del servicio debe levantarse automáticamente en menos de 60 segundos. Las operaciones deben continuar sin interrupción o pérdida de datos.
20. TC006: Verificar que los datos personales del cliente asociados a los puntos se almacenan y transmiten de forma segura. → Los datos personales sensibles deben estar cifrados en tránsito y en reposo. El acceso no autorizado a la base de datos debe ser denegado. La política de privacidad debe ser informada.
21. TC007: Medir la latencia del proceso de consulta y reserva de puntos para canje durante el checkout. → La consulta y reserva de puntos debe completarse en menos de 1 segundo para no impactar la experiencia de compra.
22. NFR001: Verificar el rendimiento del portal del cliente con 500 usuarios concurrentes en campaña. → El portal debe mantener tiempos de respuesta < 2 segundos y procesar todas las solicitudes sin errores, demostrando estabilidad bajo carga.
23. NFR002: Validar la recuperación de datos del programa de puntos desde un backup reciente. → Todos los datos de puntos deben ser restaurados correctamente y ser consistentes con el estado del último backup, sin pérdida de información crítica.
24. NFR003: Evaluar la robustez del sistema de autenticación contra ataques de fuerza bruta y credenciales débiles. → El sistema debe bloquear o ralentizar los intentos de fuerza bruta y forzar el uso de contraseñas robustas. La autenticación debe ser resistente a ataques comunes.
25. NFR004: Verificar la inmutabilidad y trazabilidad de los registros de movimientos de puntos. → Los registros de movimientos deben ser inmutables. Cualquier intento de modificación directa debe ser rechazado o registrarse como un evento de seguridad. El historial debe coincidir con la auditoría.
26. NFR005: Medir el tiempo de procesamiento de eventos asíncronos (ej. conciliación de devoluciones). → El sistema debe procesar los eventos asíncronos de manera eficiente, manteniendo la cola de eventos manejable y actualizando los saldos de puntos en un tiempo aceptable (ej. < 5 minutos para 1000 eventos).
27. NFR006: Validar la continuidad del servicio durante un despliegue de nueva versión (Blue-Green/Canary). → El servicio debe permanecer completamente disponible y funcional durante todo el proceso de despliegue, sin impacto en las operaciones de los clientes.
28. NFR007: Evaluar el rendimiento de PostgreSQL bajo carga sostenida de operaciones de puntos. → PostgreSQL debe mantener un rendimiento estable y dentro de los umbrales definidos durante la carga sostenida, sin degradación significativa o fallos.

## 3. EXECUTABLE ITEMS

### ITEM 1: Foundation — entidades TypeORM, configuración, contratos de frontend y design tokens
**Goal:** Crear todos los archivos compartidos que los demás ítems importarán: entidades TypeORM exactas del contrato de base de datos, cargador de configuración, filtro e interceptor comunes, tipos TypeScript de frontend y design tokens verbatim.
**Files to create:**
- backend/package.json (create) - dependencias NestJS, TypeORM, PostgreSQL, Redis, class-validator/class-transformer; scripts: build (nest build), start (node dist/main.js)
- backend/tsconfig.json (create) - experimentalDecorators: true, emitDecoratorMetadata: true, strictNullChecks: true
- backend/nest-cli.json (create) - { sourceRoot: 'src', compilerOptions: { deleteOutDir: true } }
- backend/src/config/configuration.ts (create) - carga tipada de variables de entorno sin valores secretos por defecto
- backend/src/common/filters/http-exception.filter.ts (create) - normaliza respuestas de error, oculta stack traces
- backend/src/common/interceptors/transform.interceptor.ts (create) - envuelve respuestas en { data }
- backend/src/entities/cliente.entity.ts (create) - entidad CLIENTE
- backend/src/entities/cuenta-puntos.entity.ts (create) - entidad CUENTA_PUNTOS
- backend/src/entities/compra.entity.ts (create) - entidad COMPRA
- backend/src/entities/linea-compra.entity.ts (create) - entidad LINEA_COMPRA
- backend/src/entities/regla-puntos.entity.ts (create) - entidad REGLA_PUNTOS
- backend/src/entities/configuracion-regla.entity.ts (create) - entidad CONFIGURACION_REGLA
- backend/src/entities/movimiento-puntos.entity.ts (create) - entidad MOVIMIENTO_PUNTOS
- backend/src/entities/reserva-puntos.entity.ts (create) - entidad RESERVA_PUNTOS
- backend/src/entities/devolucion.entity.ts (create) - entidad DEVOLUCION
- backend/src/entities/auditoria.entity.ts (create) - entidad AUDITORIA
- frontend/src/types/index.ts (create) - todas las interfaces de dominio, DTOs y enums del frontend
- frontend/src/types/ui.ts (create) - CurrentUser, NavItem, SelectOption, Column, Row, FilterDefinition, Step, Tab, EvidenceFile
- frontend/src/styles/tokens.ts (create) - objeto tokens verbatim del contrato UI/UX
**Dependencies:** None
**Validation:** Ejecutar `cd backend && npm install && npm run build` para verificar que las entidades y archivos comunes compilan sin errores.
**Role:** role-tl (technical_lead)

### ITEM 2: Backend Clientes, Cuentas de Puntos y Movimientos API
**Goal:** Implementar los módulos `clientes`, `cuentas-puntos` y `movimientos-puntos` con todos los endpoints de SPEC.md §3.2, §3.3 y §3.7. Incluye creación y consulta de clientes, inscripción con aceptación de términos, consulta de compras por cliente, cuenta de puntos, ajustes manuales con registro de auditoría, y listado/detalle de movimientos con filtros.
**Files to create:**
- backend/src/modules/clientes/clientes.module.ts (create) - módulo NestJS de clientes
- backend/src/modules/clientes/clientes.controller.ts (create) - controlador de clientes con endpoints REST
- backend/src/modules/clientes/clientes.service.ts (create) - lógica de negocio de clientes e inscripción
- backend/src/modules/clientes/dto/create-cliente.dto.ts (create) - DTO de creación de cliente
- backend/src/modules/cuentas-puntos/cuentas-puntos.module.ts (create) - módulo NestJS de cuentas
- backend/src/modules/cuentas-puntos/cuentas-puntos.controller.ts (create) - controlador de cuentas de puntos
- backend/src/modules/cuentas-puntos/cuentas-puntos.service.ts (create) - lógica de consulta y ajuste de saldos
- backend/src/modules/cuentas-puntos/dto/adjust-cuenta.dto.ts (create) - DTO de ajuste manual de puntos
- backend/src/modules/movimientos-puntos/movimientos-puntos.module.ts (create) - módulo de movimientos
- backend/src/modules/movimientos-puntos/movimientos-puntos.controller.ts (create) - controlador de movimientos
- backend/src/modules/movimientos-puntos/movimientos-puntos.service.ts (create) - lógica de consulta y cálculo de vencimientos
- backend/src/modules/movimientos-puntos/dto/query-movimientos.dto.ts (create) - DTO de filtros de movimientos
**Dependencies:** ITEM 1
**Validation:** Ejecutar `cd backend && npm run build`; los tres módulos compilan correctamente contra las entidades y DTOs base.
**Role:** role-be (backend_developer)

### ITEM 3: Backend Compras, Reglas de Puntos y Devoluciones API
**Goal:** Implementar los módulos `compras`, `reglas-puntos` y `devoluciones`. `ComprasService` calcula acumulación según reglas activas, crea lineas con `puntos_acumulados`, movimiento `ACUMULACION`, incrementa `saldo_pendiente` y libera puntos en confirmación de entrega. `ReglasPuntosService` expone CRUD versionado y configuración de reglas. `DevolucionesService` crea devoluciones y reversa puntos.
**Files to create:**
- backend/src/modules/compras/compras.module.ts (create) - módulo de compras
- backend/src/modules/compras/compras.controller.ts (create) - controlador de compras y devoluciones
- backend/src/modules/compras/compras.service.ts (create) - lógica de acumulación y liberación de puntos pendientes
- backend/src/modules/compras/dto/create-compra.dto.ts (create) - DTO de creación de compra
- backend/src/modules/compras/dto/create-linea-compra.dto.ts (create) - DTO de línea de compra
- backend/src/modules/compras/dto/confirmar-entrega.dto.ts (create) - DTO de confirmación de entrega
- backend/src/modules/reglas-puntos/reglas-puntos.module.ts (create) - módulo de reglas
- backend/src/modules/reglas-puntos/reglas-puntos.controller.ts (create) - controlador de reglas y configuraciones
- backend/src/modules/reglas-puntos/reglas-puntos.service.ts (create) - motor de evaluación de reglas versionado
- backend/src/modules/reglas-puntos/dto/create-regla.dto.ts (create) - DTO de creación de regla
- backend/src/modules/reglas-puntos/dto/update-regla.dto.ts (create) - DTO de actualización de regla
- backend/src/modules/reglas-puntos/dto/create-configuracion-regla.dto.ts (create) - DTO de configuración de regla
- backend/src/modules/devoluciones/devoluciones.module.ts (create) - módulo de devoluciones
- backend/src/modules/devoluciones/devoluciones.controller.ts (create) - controlador de devoluciones
- backend/src/modules/devoluciones/devoluciones.service.ts (create) - lógica de reversión de puntos
- backend/src/modules/devoluciones/dto/create-devolucion.dto.ts (create) - DTO de devolución
**Dependencies:** ITEM 1
**Validation:** Ejecutar `cd backend && npm run build`; los tres módulos compilan y los servicios referencian correctamente entidades y DTOs.
**Role:** role-be (backend_developer)

### ITEM 4: Backend Reservas de Puntos y Aplicación de Puntos API
**Goal:** Implementar los módulos `reservas-puntos` y `aplicacion-puntos`. `ReservasPuntosService` implementa la máquina de estados `PENDIENTE → CONFIRMADA/CANCELADA` usando Redis para holds temporales y PostgreSQL para persistencia. `AplicacionPuntosService` valida saldo disponible y crea una reserva en Redis para canje durante checkout.
**Files to create:**
- backend/src/modules/reservas-puntos/reservas-puntos.module.ts (create) - módulo de reservas
- backend/src/modules/reservas-puntos/reservas-puntos.controller.ts (create) - controlador de reservas
- backend/src/modules/reservas-puntos/reservas-puntos.service.ts (create) - estado de reservas con Redis y PostgreSQL
- backend/src/modules/reservas-puntos/dto/create-reserva.dto.ts (create) - DTO de creación de reserva
- backend/src/modules/aplicacion-puntos/aplicacion-puntos.module.ts (create) - módulo de aplicación de puntos
- backend/src/modules/aplicacion-puntos/aplicacion-puntos.controller.ts (create) - controlador de aplicación de puntos
- backend/src/modules/aplicacion-puntos/aplicacion-puntos.service.ts (create) - validación de saldo y creación de reserva
- backend/src/modules/aplicacion-puntos/dto/aplicar-puntos.dto.ts (create) - DTO de aplicación de puntos
**Dependencies:** ITEM 1
**Validation:** Ejecutar `cd backend && npm run build`; ambos módulos compilan sin errores.
**Role:** role-be (backend_developer)

### ITEM 5: Backend Auditoría, Exportaciones, Términos, Admin, Health y Bootstrap NestJS
**Goal:** Implementar los módulos restantes `auditoria`, `exportaciones`, `terminos`, `admin`, el controlador de health, y los archivos raíz `app.module.ts` y `main.ts` que conectan TypeORM, Redis, todos los módulos, filtro e interceptor. Incluye `backend/Dockerfile` multi-stage con arranque en puerto 3000.
**Files to create:**
- backend/src/modules/auditoria/auditoria.module.ts (create) - módulo de auditoría
- backend/src/modules/auditoria/auditoria.controller.ts (create) - controlador de auditoría
- backend/src/modules/auditoria/auditoria.service.ts (create) - lógica de consulta de auditorías
- backend/src/modules/exportaciones/exportaciones.module.ts (create) - módulo de exportaciones
- backend/src/modules/exportaciones/exportaciones.controller.ts (create) - controlador de exportación CSV
- backend/src/modules/exportaciones/exportaciones.service.ts (create) - generación de CSV
- backend/src/modules/terminos/terminos.module.ts (create) - módulo de términos
- backend/src/modules/terminos/terminos.controller.ts (create) - controlador de términos
- backend/src/modules/terminos/terminos.service.ts (create) - lógica de término vigente
- backend/src/modules/admin/admin.module.ts (create) - módulo administrativo
- backend/src/modules/admin/admin.controller.ts (create) - controlador de resumen administrativo
- backend/src/modules/admin/admin.service.ts (create) - agregación de métricas de resumen
- backend/src/health/health.controller.ts (create) - endpoint GET /health
- backend/src/app.module.ts (create) - módulo raíz con TypeORM, Redis y todos los feature modules
- backend/src/main.ts (create) - bootstrap NestJS, validación de variables, puerto 3000
- backend/Dockerfile (create) - build context ./backend; multi-stage; EXPOSE 3000; CMD: node dist/main.js tras npm run build
**Dependencies:** ITEM 2, ITEM 3, ITEM 4, ITEM 1
**Validation:** Ejecutar `cd backend && npm run build`; la aplicación completa compila. Ejecutar `docker build -t camper-backend ./backend` para verificar la imagen.
**Role:** role-be (backend_developer)

### ITEM 6: Frontend Foundation — scaffolding, servicios API y estilos globales
**Goal:** Crear configuración de proyecto Vite/React, cliente Axios con interceptores y todos los servicios frontend para clientes, compras, reglas, movimientos, reservas, aplicación de puntos, términos y admin. Incluye CSS global con tokens accesibles, breakpoints y `prefers-reduced-motion`.
**Files to create:**
- frontend/package.json (create) - dependencias React 18, Vite, Axios; scripts dev/build
- frontend/tsconfig.json (create) - TypeScript estricto, JSX react-jsx
- frontend/vite.config.ts (create) - configuración de Vite y variables de entorno
- frontend/src/index.css (create) - resets, tipografía, espaciado, estados focus, responsive y reduced motion
- frontend/src/services/api.ts (create) - instancia Axios con `baseURL` y manejo de errores
- frontend/src/services/clientes.ts (create) - llamadas API de clientes
- frontend/src/services/compras.ts (create) - llamadas API de compras y devoluciones
- frontend/src/services/reglas.ts (create) - llamadas API de reglas
- frontend/src/services/movimientos.ts (create) - llamadas API de movimientos y exportaciones
- frontend/src/services/reservas.ts (create) - llamadas API de reservas
- frontend/src/services/aplicacion-puntos.ts (create) - llamadas API de aplicación de puntos
- frontend/src/services/terminos.ts (create) - llamadas API de términos
- frontend/src/services/admin.ts (create) - llamadas API de resumen administrativo
**Dependencies:** ITEM 1
**Validation:** Ejecutar `cd frontend && npm install && npx tsc --noEmit`; los servicios compilan contra los tipos compartidos.
**Role:** role-fe (frontend_developer)

### ITEM 7: Frontend UI Component Library
**Goal:** Implementar los 17 componentes UI base definidos en SPEC.md §7.2 con props exactas, accesibilidad AA, objetivos táctiles de 44px, íconos + color + texto para estados, y el layout global `AppShell`.
**Files to create:**
- frontend/src/components/ui/NavegacionPrincipal.tsx (create) - navegación principal
- frontend/src/components/ui/BotonPrimario.tsx (create) - botón con variantes y estados
- frontend/src/components/ui/Tarjeta.tsx (create) - contenedor tarjeta
- frontend/src/components/ui/ResumenPuntos.tsx (create) - tarjeta resumen de puntos
- frontend/src/components/ui/EtiquetaEstado.tsx (create) - etiqueta de estado semántico
- frontend/src/components/ui/CampoTexto.tsx (create) - campo de texto accesible
- frontend/src/components/ui/Selector.tsx (create) - selector accesible
- frontend/src/components/ui/TablaDatos.tsx (create) - tabla de datos reutilizable
- frontend/src/components/ui/BarraFiltros.tsx (create) - barra de filtros
- frontend/src/components/ui/Modal.tsx (create) - modal accesible
- frontend/src/components/ui/Alerta.tsx (create) - alerta semántica
- frontend/src/components/ui/EstadoVacio.tsx (create) - estado vacío
- frontend/src/components/ui/FilaMovimiento.tsx (create) - fila de movimiento
- frontend/src/components/ui/PasosProceso.tsx (create) - pasos de proceso
- frontend/src/components/ui/Pestanas.tsx (create) - pestañas
- frontend/src/components/ui/PanelResumenAdmin.tsx (create) - panel de resumen administrativo
- frontend/src/components/ui/SubidaEvidencia.tsx (create) - subida de evidencia
- frontend/src/components/layout/AppShell.tsx (create) - shell global header/nav/footer
**Dependencies:** ITEM 1
**Validation:** Ejecutar `cd frontend && npx tsc --noEmit`; todos los componentes compilan y usan las props/contratos definidos.
**Role:** role-fe (frontend_developer)

### ITEM 8: Frontend Client Portal Flow — Portal, Inscripción, Resumen y Saldo Pendiente
**Goal:** Implementar las páginas del flujo de cliente `PortalCliente`, `Inscripcion`, `ResumenPuntos` y `SaldoDisponiblePendiente`, junto con sus hooks `usePortalCliente`, `useInscripcion`, `useResumenPuntos` y `useSaldoPendiente`, conectados a los servicios frontend del ITEM 6.
**Files to create:**
- frontend/src/hooks/usePortalCliente.ts (create) - estado agregado del portal
- frontend/src/hooks/useInscripcion.ts (create) - estado de inscripción
- frontend/src/hooks/useResumenPuntos.ts (create) - estado de resumen de puntos
- frontend/src/hooks/useSaldoPendiente.ts (create) - estado de saldo disponible y pendiente
- frontend/src/pages/PortalCliente.tsx (create) - página Portal del cliente
- frontend/src/pages/Inscripcion.tsx (create) - página Inscripción
- frontend/src/pages/ResumenPuntos.tsx (create) - página Resumen de puntos
- frontend/src/pages/SaldoDisponiblePendiente.tsx (create) - página Saldo disponible y pendiente
**Dependencies:** ITEM 1, ITEM 6, ITEM 7
**Validation:** Ejecutar `cd frontend && npx tsc --noEmit`; las páginas y hooks compilan e importan correctamente componentes y servicios.
**Role:** role-fe (frontend_developer)

### ITEM 9: Frontend Historial, Vencimientos y Términos Flow
**Goal:** Implementar las páginas `Historial`, `ProximosVencimientos` y `Terminos`, con sus hooks `useHistorial`, `useVencimientos` y `useTerminos`. Incluye exportación CSV desde historial.
**Files to create:**
- frontend/src/hooks/useHistorial.ts (create) - historial con filtros y exportarCSV
- frontend/src/hooks/useVencimientos.ts (create) - estado de vencimientos
- frontend/src/hooks/useTerminos.ts (create) - estado de términos
- frontend/src/pages/Historial.tsx (create) - página Historial
- frontend/src/pages/ProximosVencimientos.tsx (create) - página Próximos vencimientos
- frontend/src/pages/Terminos.tsx (create) - página Términos
**Dependencies:** ITEM 1, ITEM 6, ITEM 7
**Validation:** Ejecutar `cd frontend && npx tsc --noEmit`; páginas y hooks compilan correctamente.
**Role:** role-fe (frontend_developer)

### ITEM 10: Frontend Aplicación de Puntos en Pago y Bootstrap de la SPA
**Goal:** Implementar la página `AplicacionPuntosPago`, el hook `useAplicacionPuntos`, el router `AppRouter`, `App.tsx`, `main.tsx`, `index.html` y `frontend/Dockerfile`. Este ítem integra todas las páginas en una SPA navegable y construye el contenedor frontend con Nginx y build ARG `VITE_API_URL`.
**Files to create:**
- frontend/src/hooks/useAplicacionPuntos.ts (create) - estado de aplicación de puntos en pago
- frontend/src/pages/AplicacionPuntosPago.tsx (create) - página Aplicación de puntos en el pago
- frontend/src/router/AppRouter.tsx (create) - definición de rutas del portal
- frontend/src/App.tsx (create) - componente raíz con router y shell
- frontend/src/main.tsx (create) - entry point React
- frontend/index.html (create) - HTML base con script module /src/main.tsx
- frontend/Dockerfile (create) - build context ./frontend; multi-stage Vite → Nginx; EXPOSE 80; ARG VITE_API_URL
**Dependencies:** ITEM 1, ITEM 6, ITEM 7, ITEM 8, ITEM 9
**Validation:** Ejecutar `cd frontend && npm install && npm run build`; la SPA compila y genera el bundle. Ejecutar `docker build -t camper-frontend ./frontend` para verificar la imagen.
**Role:** role-fe (frontend_developer)

### ITEM 11: Infrastructure & Deployment — Docker Compose, Kubernetes y arranque local
**Goal:** Orquestación completa con Docker Compose, healthchecks y dependencias saludables; manifiestos Kubernetes para backend, frontend, PostgreSQL y Redis; archivos raíz `.env.example`, `.gitignore`, `.dockerignore`, `run.sh` y `README.md`. El flujo `./run.sh` debe levantar todo sin pasos manuales.
**Files to create:**
- docker-compose.yml (create) - servicios backend, frontend, postgres, redis con healthchecks y depends_on condition service_healthy
- .env.example (create) - plantilla con todas las variables: POSTGRES_*, REDIS_*, VITE_API_URL, variables backend
- .gitignore (create) - exclusión de node_modules, dist, .env, logs
- .dockerignore (create) - exclusión de node_modules, .git, dist
- run.sh (create) - valida Docker, levanta servicios, espera healthchecks e imprime URL de acceso
- README.md (create) - requisitos, clonación, ejecución con ./run.sh, pruebas y endpoints
- infrastructure/k8s/namespace.yaml (create) - namespace
- infrastructure/k8s/configmap.yaml (create) - configmap de variables no sensibles
- infrastructure/k8s/backend-deployment.yaml (create) - deployment backend
- infrastructure/k8s/backend-service.yaml (create) - service backend
- infrastructure/k8s/frontend-deployment.yaml (create) - deployment frontend
- infrastructure/k8s/frontend-service.yaml (create) - service frontend
- infrastructure/k8s/postgres-statefulset.yaml (create) - statefulset PostgreSQL
- infrastructure/k8s/postgres-service.yaml (create) - service PostgreSQL
- infrastructure/k8s/redis-deployment.yaml (create) - deployment Redis
- infrastructure/k8s/redis-service.yaml (create) - service Redis
**Dependencies:** ITEM 5, ITEM 10 y todos los anteriores
**Validation:** Ejecutar `./run.sh` sin errores; todos los servicios reportan healthy; frontend accesible en `http://localhost:23002`; backend responde en `http://localhost:23001/api/v1/health`.
**Role:** role-devops (devops_support)