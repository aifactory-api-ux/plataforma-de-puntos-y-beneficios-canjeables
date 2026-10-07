import React, { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { Alerta } from '../components/ui/Alerta';
import { useInscripcion } from '../hooks/useInscripcion';
import { terminosService } from '../services/terminos';
import type { TerminosResponseDto } from '../types';

interface InscripcionProps {
  clienteId: string;
  onNavigate: (id: string) => void;
}

export const Inscripcion: React.FC<InscripcionProps> = ({ clienteId, onNavigate }) => {
  const { inscribir, loading, error, data } = useInscripcion(clienteId);

  const [terminos, setTerminos] = useState<TerminosResponseDto | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [consentimientoComercial, setConsentimientoComercial] = useState(false);
  const [terminosError, setTerminosError] = useState<string | null>(null);
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false);

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const terminosData = await terminosService.obtenerTerminos();
        setTerminos(terminosData);
      } catch (err) {
        console.error('Error al cargar términos:', err);
      }
    };
    fetchTerminos();
  }, []);

  const handleSubmit = async () => {
    setTerminosError(null);

    if (!aceptaTerminos) {
      setTerminosError('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (!terminos) {
      setTerminosError('No se han cargado los términos y condiciones');
      return;
    }

    try {
      await inscribir({
        acepta_terminos: aceptaTerminos,
        consentimiento_comercial: consentimientoComercial,
        terminos_version: terminos.version,
      });
      setInscripcionExitosa(true);
    } catch (err) {
      // Error already handled by the hook
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
    benefitCard: {
      backgroundColor: tokens.color.neutral.mist.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
      padding: '24px',
    },
    benefitTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: '0 0 16px 0',
    },
    benefitList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    benefitItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    benefitIcon: {
      color: tokens.color.semantic.success.text.value,
      flexShrink: 0,
      marginTop: '2px',
    },
    benefitText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      color: tokens.color.neutral.graphite.value,
    },
    termsCard: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
      padding: '20px',
      backgroundColor: tokens.color.neutral.mist.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.small.value,
    },
    termsVersion: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.muted.value,
      marginBottom: '16px',
    },
    termsContent: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      lineHeight: tokens.typography.scale.body_sm.line_height.value,
      color: tokens.color.neutral.graphite.value,
      whiteSpace: 'pre-wrap' as const,
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      cursor: 'pointer',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginTop: '2px',
      accentColor: tokens.color.action.primary.value,
    },
    checkboxText: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    checkboxTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
    },
    checkboxDescription: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '8px',
    },
    successCard: {
      textAlign: 'center' as const,
      padding: '48px 24px',
    },
    successIcon: {
      color: tokens.color.semantic.success.text.value,
      marginBottom: '16px',
    },
    successTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: '0 0 8px 0',
    },
    successMessage: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      color: tokens.color.neutral.slate.value,
      margin: '0 0 24px 0',
    },
  };

  if (inscripcionExitosa || data) {
    return (
      <div style={styles.container}>
        <Tarjeta>
          <div style={styles.successCard as React.CSSProperties}>
            <div style={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 10 11 15 8 12" />
              </svg>
            </div>
            <h2 style={styles.successTitle}>¡Inscripción Exitosa!</h2>
            <p style={styles.successMessage}>
              Ahora eres parte del programa de puntos. Empieza a acumular puntos con cada compra.
            </p>
            <BotonPrimario
              label="Ver mi Saldo"
              onClick={() => onNavigate('portal')}
            />
          </div>
        </Tarjeta>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inscripción al Programa</h1>
        <p style={styles.subtitle}>
          Únete al programa de puntos y comienza a acumular beneficios con cada compra.
        </p>
      </div>

      <Tarjeta title="Beneficios del Programa">
        <div style={styles.benefitList}>
          <div style={styles.benefitItem}>
            <span style={styles.benefitIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 10 11 15 8 12" />
              </svg>
            </span>
            <span style={styles.benefitText}>
              Acumula puntos con cada compra de calzado
            </span>
          </div>
          <div style={styles.benefitItem}>
            <span style={styles.benefitIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 10 11 15 8 12" />
              </svg>
            </span>
            <span style={styles.benefitText}>
              Canjea tus puntos por descuentos en tu próxima compra
            </span>
          </div>
          <div style={styles.benefitItem}>
            <span style={styles.benefitIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 10 11 15 8 12" />
              </svg>
            </span>
            <span style={styles.benefitText}>
              Consulta tu saldo y historial en cualquier momento
            </span>
          </div>
        </div>
      </Tarjeta>

      <Tarjeta title="Términos y Condiciones">
        {terminos ? (
          <>
            <div style={styles.termsCard}>
              <p style={styles.termsVersion}>
                Versión {terminos.version} - Vigente desde{' '}
                {new Date(terminos.fecha_vigencia).toLocaleDateString('es-CO')}
              </p>
              <div style={styles.termsContent}>
                {terminos.contenido}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>
                    <span style={styles.checkboxTitle}>
                      Acepto los términos y condiciones *
                    </span>
                    <span style={styles.checkboxDescription}>
                      He leído y acepto los términos y condiciones del programa de puntos.
                    </span>
                  </span>
                </label>

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={consentimientoComercial}
                    onChange={(e) => setConsentimientoComercial(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>
                    <span style={styles.checkboxTitle}>
                      Deseo recibir comunicaciones comerciales
                    </span>
                    <span style={styles.checkboxDescription}>
                      Acepto recibir ofertas y promociones exclusivas por correo electrónico.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {terminosError && (
              <div style={{ marginTop: '16px' }}>
                <Alerta tone="error" title="Error" message={terminosError} />
              </div>
            )}

            {error && (
              <div style={{ marginTop: '16px' }}>
                <Alerta tone="error" title="Error en la inscripción" message={error} />
              </div>
            )}

            <div style={styles.buttonContainer}>
              <BotonPrimario
                label="Cancelar"
                variant="secondary"
                onClick={() => onNavigate('portal')}
              />
              <BotonPrimario
                label="Inscribirme"
                onClick={handleSubmit}
                loading={loading}
                disabled={!aceptaTerminos}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' as const, padding: '24px' }}>
            <span style={{ color: tokens.color.neutral.slate.value }}>
              Cargando términos y condiciones...
            </span>
          </div>
        )}
      </Tarjeta>
    </div>
  );
};

export default Inscripcion;
