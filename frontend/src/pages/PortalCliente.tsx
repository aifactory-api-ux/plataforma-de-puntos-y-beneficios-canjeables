import React from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { ResumenPuntos } from '../components/ui/ResumenPuntos';
import { Alerta } from '../components/ui/Alerta';
import { usePortalCliente } from '../hooks/usePortalCliente';

interface PortalClienteProps {
  clienteId: string;
  onNavigate: (id: string) => void;
}

export const PortalCliente: React.FC<PortalClienteProps> = ({ clienteId, onNavigate }) => {
  const { cliente, resumen, loading, error, refetch } = usePortalCliente(clienteId);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
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
    greeting: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_lg.size.value,
      fontWeight: tokens.typography.scale.title_lg.weight.value,
      lineHeight: tokens.typography.scale.title_lg.line_height.value,
      color: tokens.color.neutral.ink.value,
      letterSpacing: tokens.typography.scale.title_lg.letter_spacing.value,
      margin: 0,
    },
    memberSince: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '400',
      color: tokens.color.neutral.slate.value,
    },
    sectionTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      lineHeight: tokens.typography.scale.title_sm.line_height.value,
      color: tokens.color.neutral.ink.value,
      letterSpacing: tokens.typography.scale.title_sm.letter_spacing.value,
      margin: '0 0 16px 0',
    },
    quickAccess: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    quickAccessItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      padding: '16px',
      backgroundColor: tokens.color.neutral.paper.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    },
    quickAccessLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
    },
    quickAccessIcon: {
      color: tokens.color.neutral.slate.value,
    },
    recentActivity: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
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
      padding: '24px 0',
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

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <Alerta
          tone="error"
          title="Error al cargar los datos"
          message={error}
          actionLabel="Reintentar"
          onAction={refetch}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.greeting}>
          {cliente ? `Hola, ${cliente.nombre}` : 'Bienvenido'}
        </h1>
        {cliente && (
          <span style={styles.memberSince}>
            Miembro desde {formatDate(cliente.fecha_registro)}
          </span>
        )}
      </div>

      {resumen && (
        <ResumenPuntos
          availablePoints={resumen.disponible}
          pendingPoints={resumen.pendiente}
          currency="COP"
          exchangeRate={100}
        />
      )}

      <div>
        <h2 style={styles.sectionTitle}>Accesos Rápidos</h2>
        <div style={styles.quickAccess}>
          <div
            style={styles.quickAccessItem}
            onClick={() => handleNavigate('resumen')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigate('resumen');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span style={styles.quickAccessIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span style={styles.quickAccessLabel}>Resumen de Puntos</span>
          </div>

          <div
            style={styles.quickAccessItem}
            onClick={() => handleNavigate('historial')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigate('historial');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span style={styles.quickAccessIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span style={styles.quickAccessLabel}>Historial</span>
          </div>

          <div
            style={styles.quickAccessItem}
            onClick={() => handleNavigate('vencimientos')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigate('vencimientos');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span style={styles.quickAccessIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span style={styles.quickAccessLabel}>Próximos Vencimientos</span>
          </div>

          <div
            style={styles.quickAccessItem}
            onClick={() => handleNavigate('terminos')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigate('terminos');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span style={styles.quickAccessIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span style={styles.quickAccessLabel}>Términos y Condiciones</span>
          </div>
        </div>
      </div>

      <Tarjeta title="Actividad Reciente">
        <div style={styles.recentActivity}>
          <span style={{ color: tokens.color.neutral.slate.value, fontSize: tokens.typography.scale.body_sm.size.value }}>
            Tu actividad reciente aparecerá aquí
          </span>
        </div>
      </Tarjeta>

      {resumen && resumen.pendiente > 0 && (
        <Alerta
          tone="info"
          title="Puntos Pendientes"
          message={`Tienes ${resumen.pendiente} puntos pendientes de liberar. Se añadirán a tu saldo disponible en los próximos días.`}
          actionLabel="Ver Detalles"
          onAction={() => handleNavigate('saldo')}
        />
      )}
    </div>
  );
};

export default PortalCliente;
