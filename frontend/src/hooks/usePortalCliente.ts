import { useState, useCallback } from 'react';
import { clientesService } from '../services/clientes';
import type { Cliente, CuentaPuntos } from '../types';
import type { NavItem } from '../types/ui';

interface ResumenCliente {
  disponible: number;
  pendiente: number;
  equivalenciaCOP: number;
}

interface PortalClienteReturn {
  cliente: Cliente | null;
  cuenta: CuentaPuntos | null;
  resumen: ResumenCliente | null;
  accesosRapidos: NavItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const EXCHANGE_RATE = 100;

export function usePortalCliente(clienteId: string): PortalClienteReturn {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cuenta, setCuenta] = useState<CuentaPuntos | null>(null);
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
      const [clienteData, cuentaData] = await Promise.all([
        clientesService.obtenerCliente(clienteId),
        clientesService.obtenerCuentaPuntos(clienteId),
      ]);

      setCliente(clienteData);
      setCuenta(cuentaData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos del cliente';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  const resumen: ResumenCliente | null = cuenta
    ? {
        disponible: cuenta.saldo_actual,
        pendiente: cuenta.saldo_pendiente,
        equivalenciaCOP: (cuenta.saldo_actual * EXCHANGE_RATE) + (cuenta.saldo_pendiente * EXCHANGE_RATE),
      }
    : null;

  const accesosRapidos: NavItem[] = [
    { id: 'resumen', label: 'Resumen de Puntos', href: '/resumen' },
    { id: 'historial', label: 'Historial', href: '/historial' },
    { id: 'vencimientos', label: 'Próximos Vencimientos', href: '/vencimientos' },
    { id: 'terminos', label: 'Términos y Condiciones', href: '/terminos' },
  ];

  return {
    cliente,
    cuenta,
    resumen,
    accesosRapidos,
    loading,
    error,
    refetch: fetchData,
  };
}
