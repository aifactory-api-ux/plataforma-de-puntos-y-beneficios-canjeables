import { useState, useCallback } from 'react';
import { clientesService } from '../services/clientes';
import type { Compra, MovimientoPuntos } from '../types';

interface LotePendiente {
  compra_id: string;
  fecha_compra: string;
  puntos_pendientes: number;
  fecha_estimada_liberacion: string;
}

interface SaldoPendienteReturn {
  saldoDisponible: number;
  saldoPendiente: number;
  totalAcumulado: number;
  lotes: LotePendiente[];
  reglaLiberacion: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DIAS_LIBERACION = 7;

function calcularFechaLiberacion(fechaCompra: string): string {
  const fecha = new Date(fechaCompra);
  fecha.setDate(fecha.getDate() + DIAS_LIBERACION);
  return fecha.toISOString();
}

export function useSaldoPendiente(clienteId: string): SaldoPendienteReturn {
  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [lotes, setLotes] = useState<LotePendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [cuentaData, comprasData, movimientosData] = await Promise.all([
        clientesService.obtenerCuentaPuntos(clienteId),
        clientesService.obtenerCompras(clienteId),
        clientesService.obtenerMovimientos(clienteId, {}),
      ]);

      setSaldoDisponible(cuentaData.saldo_actual);
      setSaldoPendiente(cuentaData.saldo_pendiente);

      const comprasMap = new Map<string, Compra>();
      comprasData.forEach((compra) => {
        comprasMap.set(compra.compra_id, compra);
      });

      const movimientosPorCompra = new Map<string, MovimientoPuntos[]>();
      movimientosData.forEach((mov) => {
        if (mov.origen && mov.origen.startsWith('compra_')) {
          const compraId = mov.origen.replace('compra_', '');
          if (!movimientosPorCompra.has(compraId)) {
            movimientosPorCompra.set(compraId, []);
          }
          movimientosPorCompra.get(compraId)!.push(mov);
        }
      });

      const lotesCalculados: LotePendiente[] = [];
      comprasData.forEach((compra) => {
        if (compra.estado === 'PENDIENTE' || compra.estado === 'ENTREGADA') {
          const movimientos = movimientosPorCompra.get(compra.compra_id) || [];
          const puntosAcumulados = compra.lineas
            ? compra.lineas.reduce((sum, linea) => sum + linea.puntos_acumulados, 0)
            : 0;
          const puntosReversados = movimientos
            .filter((m) => m.tipo_movimiento === 'DEVOLUCION')
            .reduce((sum, m) => sum + m.cantidad, 0);

          const puntosNetos = Math.max(0, puntosAcumulados - puntosReversados);

          if (puntosNetos > 0) {
            lotesCalculados.push({
              compra_id: compra.compra_id,
              fecha_compra: compra.fecha_compra,
              puntos_pendientes: puntosNetos,
              fecha_estimada_liberacion: calcularFechaLiberacion(compra.fecha_compra),
            });
          }
        }
      });

      setLotes(lotesCalculados);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el saldo pendiente';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  const totalAcumulado = saldoDisponible + saldoPendiente;
  const reglaLiberacion = `Los puntos se liberan ${DIAS_LIBERACION} días después de la compra`;

  return {
    saldoDisponible,
    saldoPendiente,
    totalAcumulado,
    lotes,
    reglaLiberacion,
    loading,
    error,
    refetch: fetchData,
  };
}
