import React from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { EtiquetaEstado } from '../components/ui/EtiquetaEstado';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { Alerta } from '../components/ui/Alerta';
import { useSaldoPendiente } from '../hooks/useSaldoPendiente';

interface SaldoDisponiblePendienteProps {
  clienteId: string;
  onNavigate: (id: string) => void;
}

export const SaldoDisponiblePendiente: React.FC<SaldoDisponiblePendienteProps> = ({
  clienteId,
  onNavigate,
}) => {
  const {
    saldoDisponible,
    saldoPendiente,
    lotes,
    reglaLiberacion,
    loading,
  } = useSaldoPendiente(clienteId);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-CO').format(Math.round(num));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDaysUntilLiberation = (fechaEstimada: string): number => {
    const today = new Date();
    const targetDate = new Date(fechaEstimada);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
    balanceCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    balanceCard: {
      padding: '20px',
      backgroundColor: tokens.color.neutral.paper.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
    },
    balanceCardLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.slate.value,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em',
      marginBottom: '8px',
    },
    balanceCardValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
    },
    balanceCardAvailable: {
      backgroundColor: tokens.color.semantic.success.surface.value,
      borderColor: tokens.color.semantic.success.border.value,
    },
    balanceCardPending: {
      backgroundColor: tokens.color.semantic.info.surface.value,
      borderColor: tokens.color.semantic.info.border.value,
    },
    balanceCardValueAvailable: {
      color: tokens.color.semantic.success.text.value,
    },
    balanceCardValuePending: {
      color: tokens.color.semantic.info.text.value,
    },
    ruleSection: {
      padding: '16px',
      backgroundColor: tokens.color.neutral.mist.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.small.value,
    },
    ruleTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '600',
      color: tokens.color.neutral.ink.value,
      marginBottom: '8px',
    },
    ruleText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.graphite.value,
    },
    lotsSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    sectionTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    lotsTable: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    lotRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      gap: '16px',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: tokens.color.neutral.paper.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.small.value,
    },
    lotInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    lotPurchaseId: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
    },
    lotDate: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    lotPoints: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '600',
      color: tokens.color.semantic.info.text.value,
    },
    lotLiberation: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end',
      gap: '2px',
    },
    lotLiberationDays: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '600',
      color: tokens.color.neutral.ink.value,
    },
    lotLiberationDate: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    emptyLots: {
      textAlign: 'center' as const,
      padding: '24px',
      color: tokens.color.neutral.slate.value,
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
    },
    notesSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    notesTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    notesList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      paddingLeft: '20px',
    },
    noteItem: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.graphite.value,
      listStyleType: 'disc' as const,
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
        <h1 style={styles.title}>Saldos de Puntos</h1>
        <p style={styles.subtitle}>
          Detalle de tus puntos disponibles y pendientes
        </p>
      </div>

      <div style={styles.balanceCards}>
        <div style={{ ...styles.balanceCard, ...styles.balanceCardAvailable }}>
          <p style={styles.balanceCardLabel}>Disponible</p>
          <p style={{ ...styles.balanceCardValue, ...styles.balanceCardValueAvailable }}>
            {formatNumber(saldoDisponible)}
          </p>
          <p style={{ ...styles.balanceCardLabel, marginTop: '4px', color: tokens.color.semantic.success.text.value }}>
            Listo para canjear
          </p>
        </div>

        <div style={{ ...styles.balanceCard, ...styles.balanceCardPending }}>
          <p style={styles.balanceCardLabel}>Pendiente</p>
          <p style={{ ...styles.balanceCardValue, ...styles.balanceCardValuePending }}>
            {formatNumber(saldoPendiente)}
          </p>
          <p style={{ ...styles.balanceCardLabel, marginTop: '4px', color: tokens.color.semantic.info.text.value }}>
            En proceso de liberación
          </p>
        </div>
      </div>

      <Tarjeta title="Regla de Liberación">
        <div style={styles.ruleSection}>
          <p style={styles.ruleTitle}>¿Cómo funcionan los puntos pendientes?</p>
          <p style={styles.ruleText}>{reglaLiberacion}</p>
        </div>
      </Tarjeta>

      {lotes.length > 0 && (
        <Tarjeta title="Lotes de Puntos Pendientes">
          <div style={styles.lotsSection}>
            <h3 style={styles.sectionTitle}>Detalle por Compra</h3>
            <div style={styles.lotsTable}>
              {lotes.map((lote) => {
                const diasRestantes = getDaysUntilLiberation(lote.fecha_estimada_liberacion);
                return (
                  <div key={lote.compra_id} style={styles.lotRow}>
                    <div style={styles.lotInfo}>
                      <span style={styles.lotPurchaseId}>
                        Compra #{lote.compra_id.slice(0, 8)}
                      </span>
                      <span style={styles.lotDate}>
                        {formatDate(lote.fecha_compra)}
                      </span>
                    </div>
                    <span style={styles.lotPoints}>
                      +{formatNumber(lote.puntos_pendientes)}
                    </span>
                    <div style={styles.lotLiberation}>
                      <EtiquetaEstado
                        status={diasRestantes <= 2 ? 'warning' : 'info'}
                        label={`${diasRestantes} días`}
                      />
                      <span style={styles.lotLiberationDate}>
                        {formatDateShort(lote.fecha_estimada_liberacion)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Tarjeta>
      )}

      {lotes.length === 0 && saldoPendiente === 0 && (
        <Alerta
          tone="success"
          title="Sin puntos pendientes"
          message="Todos tus puntos están disponibles para canjear."
        />
      )}

      <Tarjeta title="Notas Importantes">
        <div style={styles.notesSection}>
          <ul style={styles.notesList}>
            <li style={styles.noteItem}>
              Los puntos se liberan automáticamente 7 días después de la confirmación de tu compra.
            </li>
            <li style={styles.noteItem}>
              Las devoluciones pueden afectar el saldo de puntos según las reglas vigentes.
            </li>
            <li style={styles.noteItem}>
              Los puntos tienen fecha de vencimiento; consulta la sección de vencimientos para más información.
            </li>
          </ul>
        </div>
      </Tarjeta>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <BotonPrimario
          label="Ver Historial"
          variant="secondary"
          onClick={() => onNavigate('historial')}
        />
        <BotonPrimario
          label="Canjear Puntos"
          onClick={() => onNavigate('canje')}
          disabled={saldoDisponible === 0}
        />
      </div>
    </div>
  );
};

export default SaldoDisponiblePendiente;
