import React from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { ResumenPuntos as ResumenPuntosComponent } from '../components/ui/ResumenPuntos';
import { FilaMovimiento } from '../components/ui/FilaMovimiento';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { useResumenPuntos } from '../hooks/useResumenPuntos';

interface ResumenPuntosPageProps {
  clienteId: string;
  onNavigate: (id: string) => void;
}

export const ResumenPuntosPage: React.FC<ResumenPuntosPageProps> = ({ clienteId, onNavigate }) => {
  const {
    disponible,
    pendiente,
    equivalenciaCOP,
    exchangeRate,
    expiresSoonCount,
    recentMovements,
    loading,
  } = useResumenPuntos(clienteId);

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
    summarySection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    pointsRow: {
      display: 'flex',
      gap: '16px',
    },
    pointCard: {
      flex: 1,
      padding: '20px',
      backgroundColor: tokens.color.neutral.paper.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
    },
    pointCardLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.slate.value,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em',
      marginBottom: '8px',
    },
    pointCardValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
    },
    pointCardCOP: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
      marginTop: '4px',
    },
    recentSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    recentTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    recentList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    emptyRecent: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      color: tokens.color.neutral.slate.value,
      textAlign: 'center' as const,
      padding: '24px',
    },
    ctaContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '8px',
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
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Resumen de Puntos</h1>
        <p style={styles.subtitle}>
          Vista general de tus puntos acumulados y su valor
        </p>
      </div>

      <div style={styles.summarySection}>
        <ResumenPuntosComponent
          availablePoints={disponible}
          pendingPoints={pendiente}
          currency="COP"
          exchangeRate={exchangeRate}
          expiresSoonCount={expiresSoonCount}
        />

        <div style={styles.pointsRow}>
          <div style={styles.pointCard}>
            <p style={styles.pointCardLabel}>Total Puntos</p>
            <p style={styles.pointCardValue}>
              {new Intl.NumberFormat('es-CO').format(disponible + pendiente)}
            </p>
            <p style={styles.pointCardCOP}>
              Equivale a{' '}
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
              }).format(equivalenciaCOP)}
            </p>
          </div>

          <div style={styles.pointCard}>
            <p style={styles.pointCardLabel}>Tasa de Cambio</p>
            <p style={styles.pointCardValue}>1 punto</p>
            <p style={styles.pointCardCOP}>
              = {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
              }).format(exchangeRate)}
            </p>
          </div>
        </div>
      </div>

      <Tarjeta title="Movimientos Recientes">
        <div style={styles.recentSection}>
          {recentMovements.length > 0 ? (
            <div style={styles.recentList}>
              {recentMovements.map((movimiento) => (
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
              ))}
            </div>
          ) : (
            <p style={styles.emptyRecent}>
              No tienes movimientos registrados aún
            </p>
          )}
        </div>

        {recentMovements.length > 0 && (
          <div style={styles.ctaContainer}>
            <BotonPrimario
              label="Ver Historial Completo"
              variant="secondary"
              onClick={() => onNavigate('historial')}
            />
          </div>
        )}
      </Tarjeta>

      <div style={styles.ctaContainer}>
        <BotonPrimario
          label="Canjear Puntos"
          onClick={() => onNavigate('canje')}
        />
      </div>
    </div>
  );
};

export default ResumenPuntosPage;
