# Plataforma de Puntos y Beneficios Canjeables

Sistema de fidelización basado en puntos para clientes de Camper, con gestión de acumulación, canje y vencimiento de puntos.

## Requisitos

- Docker 24.0+
- Docker Compose 2.20+
- (Opcional) Kubernetes 1.28+ para despliegue en K8s

## Inicio Rápido

```bash
# Clonar el repositorio
git clone <repository-url>
cd plataforma-puntos

# Iniciar todos los servicios automáticamente
./run.sh
```

Esto automáticamente:
1. Crea el archivo `.env` desde `.env.example`
2. Construye las imágenes de Docker
3. Inicia todos los servicios (PostgreSQL, Redis, Backend, Frontend)
4. Espera a que los servicios estén healthy
5. Muestra las URLs de acceso

## URLs de Acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:3000/api/docs |

## Servicios

### Backend (NestJS)
- API REST con NestJS 10.x
- TypeORM para acceso a PostgreSQL
- Redis para cache y reservas de puntos
- Swagger para documentación de API

### Frontend (React)
- React 18 con Vite
- TypeScript strict mode
- Diseño responsive con CSS custom

### PostgreSQL 15
- Base de datos principal
- Volumen persistente para datos

### Redis 7
- Cache de saldos
- Gestión de reservas de puntos

## Comandos Docker Compose

```bash
# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend

# Detener servicios
docker compose down

# Reiniciar servicios
docker compose restart

# Reconstruir imágenes
docker compose up -d --build

# Eliminar volúmenes (BORRA DATOS)
docker compose down -v
```

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_USERNAME` | Usuario de PostgreSQL | postgres |
| `DB_PASSWORD` | Contraseña de PostgreSQL | postgres |
| `DB_NAME` | Nombre de la base de datos | puntos_db |
| `REDIS_PASSWORD` | Contraseña de Redis | (vacío) |
| `BACKEND_PORT` | Puerto expuesto del backend | 3000 |
| `FRONTEND_PORT` | Puerto expuesto del frontend | 8080 |

## Kubernetes

Los manifiestos de Kubernetes están en `infrastructure/k8s/`.

```bash
# Aplicar todos los manifiestos
kubectl apply -f infrastructure/k8s/

# Ver pods
kubectl get pods -n plataforma-puntos

# Ver servicios
kubectl get svc -n plataforma-puntos
```

## Desarrollo

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Licencia

Proprietario - Camper
