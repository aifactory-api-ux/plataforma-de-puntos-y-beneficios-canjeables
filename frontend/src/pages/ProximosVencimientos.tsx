import React, { useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { EtiquetaEstado } from '../components/ui/EtiquetaEstado';
import { EstadoVacio } from '../components/ui/EstadoVacio';
import { useVencimientos } from '../hooks/useVencimientos';

interface ProximosVencimientosPageProps {
  clienteId: string;
}

interface VencimientoItem {
  fecha_vencimiento: string;
  puntos: number;
  regla_id: string;
  dias_restantes: number;
}

export const ProximosVencimientosPage: React.FC<ProximosVencimientosPageProps> = ({
  clienteId,
}) => {
  const { vencimientos, loading, error, refetch } = useVencimientos(clienteId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getDiasRestantes = (fechaVencimiento: string): number => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyStatus = (
    diasRestantes: number
  ): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (diasRestantes <= 7) return 'error';
    if (diasRestantes <= 30) return 'warning';
    return 'success';
  };

  const getUrgencyLabel = (diasRestantes: number): string => {
    if (diasRestantes <= 7) return `Vence en ${diasRestantes} días`;
    if (diasRestantes <= 30) return `Vence en ${diasRestantes} días`;
    return `${diasRestantes} días`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatPoints = (value: number): string => {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  const vencimientosConDias: VencimientoItem[] = vencimientos.map((v) => ({
    ...v,
    dias_restantes: getDiasRestantes(v.fecha_vencimiento),
  }));

  const sortedVencimientos = [...vencimientosConDias].sort(
    (a, b) => a.dias_restantes - b.dias_restantes
  );

  const totalProximoVencer = vencimientosConDias
    .filter((v) => v.dias_restantes <= 30)
    .reduce((sum, v) => sum + v.puntos, 0);

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
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    summaryCard: {
      padding: '20px',
      backgroundColor: tokens.color.neutral.paper.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
    },
    summaryLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.slate.value,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em',
      marginBottom: '8px',
    },
    summaryValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
    },
    vencimientosList: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    vencimientoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
      minHeight: '72px',
    },
    vencimientoInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      flex: 1,
    },
    vencimientoFecha: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    vencimientoMeta: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    vencimientoPuntos: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end',
      gap: '4px',
    },
    puntosValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: '600',
      color: tokens.color.neutral.ink.value,
      margin: 0,
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
    infoSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      padding: '16px',
      backgroundColor: tokens.color.semantic.info.surface.value,
      borderRadius: tokens.radii.medium.value,
      border: `1px solid ${tokens.color.semantic.info.border.value}`,
    },
    infoText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.semantic.info.text.value,
      margin: 0,
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Próximos Vencimientos</h1>
          <p style={styles.subtitle}>
            Puntos que vencerán pronto en tu cuenta
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
          <h1 style={styles.title}>Próximos Vencimientos</h1>
          <p style={styles.subtitle}>
            Puntos que vencerán pronto en tu cuenta
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
        <h1 style={styles.title}>Próximos Vencimientos</h1>
        <p style={styles.subtitle}>
          Puntos que vencerán pronto en tu cuenta
        </p>
      </div>

      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total a vencer (30 días)</p>
          <p style={styles.summaryValue}>{formatPoints(totalProximoVencer)} puntos</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Lotes programados</p>
          <p style={styles.summaryValue}>{vencimientos.length} vencimientos</p>
        </div>
      </div>

      <div style={styles.infoSection}>
        <p style={styles.infoText}>
          Los puntos se consumen primero por orden de vencimiento (FIFO).
          Cuando canjees puntos, se usarán primero los más próximos a vencer.
        </p>
      </div>

      <Tarjeta title="Calendario de Vencimientos">
        <div style={styles.vencimientosList}>
          {sortedVencimientos.length > 0 ? (
            sortedVencimientos.map((vencimiento, index) => (
              <div
                key={`${vencimiento.fecha_vencimiento}-${index}`}
                style={styles.vencimientoRow}
              >
                <div style={styles.vencimientoInfo}>
                  <p style={styles.vencimientoFecha}>
                    {formatDate(vencimiento.fecha_vencimiento)}
                  </p>
                  <p style={styles.vencimientoMeta}>
                    Regla: {vencimiento.regla_id}
                  </p>
                </div>
                <div style={styles.vencimientoPuntos}>
                  <p style={styles.puntosValue}>
                    {formatPoints(vencimiento.puntos)} pts
                  </p>
                  <EtiquetaEstado
                    status={getUrgencyStatus(vencimiento.dias_restantes)}
                    label={getUrgencyLabel(vencimiento.dias_restantes)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyContainer}>
              <EstadoVacio
                title="No hay vencimientos programados"
                description="No tienes puntos próximos a vencer en este momento."
              />
            </div>
          )}
        </div>
      </Tarjeta>
    </div>
  );
};

export default ProximosVencimientosPage;