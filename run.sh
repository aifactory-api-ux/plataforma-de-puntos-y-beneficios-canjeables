#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Plataforma de Puntos - Iniciando..."
echo "=========================================="

# Crear .env desde .env.example si no existe
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[OK] Archivo .env creado desde .env.example"
else
    echo "[OK] Archivo .env ya existe"
fi

# Verificar que Docker esté disponible
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker no está instalado o no está en el PATH"
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "[ERROR] Docker Compose no está disponible"
    exit 1
fi

DOCKER_COMPOSE="docker compose"
if ! command -v docker compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

echo "[OK] Docker y Docker Compose detectados"

# Verificar que los servicios estén corriendo
echo ""
echo "Verificando estado de contenedores..."
$DOCKER_COMPOSE ps

echo ""
echo "=========================================="
echo "Construyendo e iniciando servicios..."
echo "=========================================="

# Construir e iniciar los servicios
$DOCKER_COMPOSE up -d --build

# Esperar a que los servicios estén healthy
echo ""
echo "Esperando a que los servicios estén disponibles..."

MAX_WAIT=120
ELAPSED=0
INTERVAL=5

while [ $ELAPSED -lt $MAX_WAIT ]; do
    BACKEND_STATUS=$($DOCKER_COMPOSE ps backend --format "{{.Health}}" 2>/dev/null || echo "starting")
    FRONTEND_STATUS=$($DOCKER_COMPOSE ps frontend --format "{{.Health}}" 2>/dev/null || echo "starting")

    if [ "$BACKEND_STATUS" = "healthy" ] && [ "$FRONTEND_STATUS" = "healthy" ]; then
        echo "[OK] Backend está healthy"
        echo "[OK] Frontend está healthy"
        break
    fi

    echo "  Esperando... (${ELAPSED}s/${MAX_WAIT}s) - Backend: ${BACKEND_STATUS}, Frontend: ${FRONTEND_STATUS}"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "[WARN] Tiempo de espera máximo alcanzado"
fi

echo ""
echo "=========================================="
echo "Servicios iniciados"
echo "=========================================="
echo ""
echo "  Frontend:  http://localhost:${FRONTEND_PORT:-23002}"
echo "  Backend:   http://localhost:${BACKEND_PORT:-23001}"
echo "  API Docs:  http://localhost:${BACKEND_PORT:-23001}/api/docs"
echo ""
echo "  PostgreSQL: localhost:${DB_HOST_PORT:-5432}"
echo "  Redis:      localhost:${REDIS_HOST_PORT:-6379}"
echo ""
echo "=========================================="
echo "Comandos útiles:"
echo "  $DOCKER_COMPOSE logs -f        Ver logs"
echo "  $DOCKER_COMPOSE down           Detener servicios"
echo "  $DOCKER_COMPOSE restart        Reiniciar servicios"
echo "=========================================="
