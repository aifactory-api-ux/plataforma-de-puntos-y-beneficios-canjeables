import React, { useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { useTerminos } from '../hooks/useTerminos';

interface TerminosPageProps {
  clienteId?: string;
}

export const TerminosPage: React.FC<TerminosPageProps> = () => {
  const { terminos, loading, error, refetch } = useTerminos();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const defaultContent = `
TÉRMINOS Y CONDICIONES DEL PROGRAMA DE PUNTOS CAMPER

1. ACEPTACIÓN DE LOS TÉRMINOS
Al participar en el programa de puntos Camper, el cliente acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con alguno de estos términos, no deberá participar en el programa.

2. ELEGIBILIDAD
El programa de puntos está disponible para clientes mayores de edad que realicen compras elegibles en calzado Camper. Solo aplica para compras realizadas en Colombia.

3. ACUMULACIÓN DE PUNTOS
Por cada compra elegible, el cliente acumulará puntos según la tasa de conversión vigente. Los puntos se calcularán sobre el monto total de la compra en COP. Los puntos pendientes se liberarán al saldo disponible después de 7 días hábiles.

4. CANJE DE PUNTOS
Los puntos acumulados podrán ser canjeados por descuentos en futuras compras. El valor de conversión será de 1 punto = 100 COP. Los puntos próximos a vencer se consumirán primero en cada canje.

5. VIGENCIA DE LOS PUNTOS
Los puntos tendrán una vigencia de 12 meses desde la fecha de acumulación. Los puntos vencidos no podrán ser reactivados ni utilizados.

6. DEVOLUCIONES
En caso de devolución de una compra, los puntos acumulados por esa compra serán revertidos. Si los puntos ya fueron canjeados, el sistema ajustará el saldo según las reglas de reversión vigentes.

7. LIMITACIONES
- No se podrán canjear más puntos de los disponibles en la cuenta.
- Los puntos no son transferibles entre cuentas.
- Los puntos no tienen valor monetario fuera del programa.
- El programa puede ser modificado o descontinuado en cualquier momento con previo aviso.

8. PROTECCIÓN DE DATOS
Los datos personales del cliente serán tratados conforme a la política de privacidad de Camper. Los datos de puntos se almacenan de forma segura y no serán compartidos con terceros sin consentimiento.

9. CONTACTO
Para cualquier consulta sobre el programa de puntos, comunícate con nuestro servicio al cliente.
  `.trim();

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
    versionBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: tokens.color.neutral.mist.value,
      borderRadius: tokens.radii.pill.value,
      marginTop: '8px',
    },
    versionText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.graphite.value,
    },
    contentSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    contentText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      lineHeight: tokens.typography.scale.body_lg.line_height.value,
      color: tokens.color.neutral.ink.value,
      whiteSpace: 'pre-line' as const,
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
      flexDirection: 'column' as const,
      gap: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    errorText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      color: tokens.color.semantic.error.text.value,
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '16px',
    },
    lastUpdated: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
      textAlign: 'center' as const,
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Términos y Condiciones</h1>
          <p style={styles.subtitle}>
            Lee attentamente los términos del programa de puntos
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
          <h1 style={styles.title}>Términos y Condiciones</h1>
          <p style={styles.subtitle}>
            Lee attentamente los términos del programa de puntos
          </p>
        </div>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <BotonPrimario
            label="Reintentar"
            variant="secondary"
            onClick={refetch}
          />
        </div>
      </div>
    );
  }

  const contenidoMostrar = terminos?.contenido || defaultContent;
  const versionMostrar = terminos?.version || '1.0';
  const fechaVigenciaMostrar = terminos?.fecha_vigencia
    ? formatDate(terminos.fecha_vigencia)
    : formatDate(new Date().toISOString());

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Términos y Condiciones</h1>
        <p style={styles.subtitle}>
          Lee attentamente los términos del programa de puntos
        </p>
        <div style={styles.versionBadge}>
          <span style={styles.versionText}>Versión {versionMostrar}</span>
        </div>
      </div>

      <div style={styles.contentSection}>
        <Tarjeta padding="lg">
          <div style={styles.contentText}>{contenidoMostrar}</div>
        </Tarjeta>
      </div>

      <div style={styles.footer}>
        <p style={styles.lastUpdated}>
          Última actualización: {fechaVigenciaMostrar}
        </p>
      </div>
    </div>
  );
};

export default TerminosPage;