import React, { useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { FilaMovimiento } from '../components/ui/FilaMovimiento';
import { BarraFiltros } from '../components/ui/BarraFiltros';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { EstadoVacio } from '../components/ui/EstadoVacio';
import { useHistorial } from '../hooks/useHistorial';
import type { FilterDefinition } from '../types/ui';

interface HistorialPageProps {
  clienteId: string;
}

export const HistorialPage: React.FC<HistorialPageProps> = ({ clienteId }) => {
  const {
    movimientos,
    filtros,
    setFiltros,
    loading,
    error,
    exportarCSV,
    refetch,
  } = useHistorial(clienteId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getMovementType = (
    tipo: string
  ): 'acumulacion' | 'canje' | 'reversion' | 'ajuste' | 'vencimiento' => {
    switch (tipo) {
      case 'ACUMULACION':
        return 'acumulacion';
      case 'CANJE':
        return 'canje';
      case 'DEVOLUCION':
        return 'reversion';
      case 'AJUSTE':
        return 'ajuste';
      case 'VENCIMIENTO':
        return 'vencimiento';
      default:
        return 'acumulacion';
    }
  };

  const getMovementDescription = (tipo: string, origen: string): string => {
    switch (tipo) {
      case 'ACUMULACION':
        return `Acumulación por compra`;
      case 'CANJE':
        return `Canje de puntos`;
      case 'DEVOLUCION':
        return `Reversión - ${origen}`;
      case 'AJUSTE':
        return `Ajuste manual`;
      case 'VENCIMIENTO':
        return `Puntos vencidos`;
      default:
        return tipo;
    }
  };

  const filtrosDef: FilterDefinition[] = [
    {
      key: 'tipo_movimiento',
      label: 'Tipo de movimiento',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
        { value: 'ACUMULACION', label: 'Acumulación' },
        { value: 'CANJE', label: 'Canje' },
        { value: 'DEVOLUCION', label: 'Devolución' },
        { value: 'AJUSTE', label: 'Ajuste' },
        { value: 'VENCIMIENTO', label: 'Vencimiento' },
      ],
    },
    {
      key: 'fecha_desde',
      label: 'Desde',
      type: 'date',
    },
    {
      key: 'fecha_hasta',
      label: 'Hasta',
      type: 'date',
    },
  ];

  const handleExportarCSV = async () => {
    try {
      await exportarCSV();
    } catch {
      // Error already handled in hook
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '32px',
      paddingTop: '32px',
      paddingBottom: '48px',
    },
    header: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    title: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_lg.size.value,
      fontWeight: tokens.typography.scale.title_lg.weight.value,
      lineHeight: tokens.typography.scale.title_lg.line_height.value,
      color: tokens.color.neutral.ink.value,
      letterSpacing: tokens.typography.scale.title_lg.letter_spacing.value,
      margin: 0,
    },
    subtitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      fontWeight: '400',
      color: tokens.color.neutral.slate.value,
    },
    filtersSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    filtersHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filtersTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    exportButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    movementsList: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    movementsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: tokens.color.neutral.mist.value,
      borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
    },
    movementsHeaderText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.label_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.slate.value,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em',
      margin: 0,
    },
    countText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: `3px solid ${tokens.color.neutral.line.value}`,
      borderTopColor: tokens.color.action.primary.value,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    errorText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      color: tokens.color.semantic.error.text.value,
    },
    emptyContainer: {
      padding: '48px 24px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Historial de Movimientos</h1>
          <p style={styles.subtitle}>
            Consulta todos los movimientos de puntos de tu cuenta
          </p>
        </div>
        <div style={styles.loadingContainer}>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          <div style={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Historial de Movimientos</h1>
          <p style={styles.subtitle}>
            Consulta todos los movimientos de puntos de tu cuenta
          </p>
        </div>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Historial de Movimientos</h1>
        <p style={styles.subtitle}>
          Consulta todos los movimientos de puntos de tu cuenta
        </p>
      </div>

      <div style={styles.filtersSection}>
        <div style={styles.filtersHeader}>
          <h2 style={styles.filtersTitle}>Filtros</h2>
          <div style={styles.exportButton}>
            <BotonPrimario
              label="Exportar CSV"
              variant="secondary"
              size="sm"
              onClick={handleExportarCSV}
            />
          </div>
        </div>
        <BarraFiltros
          filters={filtrosDef}
          values={filtros}
          onChange={setFiltros}
        />
      </div>

      <Tarjeta>
        <div style={styles.movementsList}>
          <div style={styles.movementsHeader}>
            <p style={styles.movementsHeaderText}>Movimiento</p>
            <p style={styles.countText}>{movimientos.length} registros</p>
          </div>

          {movimientos.length > 0 ? (
            movimientos.map((movimiento) => (
              <FilaMovimiento
                key={movimiento.movimiento_id}
                type={getMovementType(movimiento.tipo_movimiento)}
                points={movimiento.cantidad}
                timestamp={formatDate(movimiento.fecha_movimiento)}
                reference={getMovementDescription(
                  movimiento.tipo_movimiento,
                  movimiento.origen
                )}
              />
            ))
          ) : (
            <div style={styles.emptyContainer}>
              <EstadoVacio
                title="No hay movimientos registrados"
                description="Los movimientos de puntos aparecerán aquí cuando realices compras o canjes."
              />
            </div>
          )}
        </div>
      </Tarjeta>
    </div>
  );
};

export default HistorialPage;