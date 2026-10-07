import React, { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { Tarjeta } from '../components/ui/Tarjeta';
import { BotonPrimario } from '../components/ui/BotonPrimario';
import { CampoTexto } from '../components/ui/CampoTexto';
import { Alerta } from '../components/ui/Alerta';
import { useAplicacionPuntos } from '../hooks/useAplicacionPuntos';
import { clientesService } from '../services/clientes';
import type { Compra } from '../types';

interface AplicacionPuntosPagoProps {
  clienteId: string;
  onNavigate: (id: string) => void;
}

export const AplicacionPuntosPago: React.FC<AplicacionPuntosPagoProps> = ({ clienteId, onNavigate }) => {
  const {
    aplicarPuntos,
    consultarDescuento,
    confirmarReserva,
    cancelarReserva,
    reserva,
    descuentoInfo,
    loading,
    error,
    reset,
  } = useAplicacionPuntos();

  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [puntosInput, setPuntosInput] = useState('');
  const [compraSeleccionada, setCompraSeleccionada] = useState<string>('');
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pasoActual, setPasoActual] = useState<'seleccion' | 'confirmacion' | 'resultado'>('seleccion');

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setFetchError(null);
      try {
        const [cuentaData, comprasData] = await Promise.all([
          clientesService.obtenerCuentaPuntos(clienteId),
          clientesService.obtenerCompras(clienteId),
        ]);
        setSaldoDisponible(cuentaData.saldo_actual);
        const comprasPendientes = comprasData.filter(c => c.estado === 'PENDIENTE' || c.estado === 'ENTREGADA');
        setCompras(comprasPendientes);
        if (comprasPendientes.length > 0) {
          setCompraSeleccionada(comprasPendientes[0].compra_id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar datos';
        setFetchError(message);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [clienteId]);

  const handleConsultarDescuento = async () => {
    const puntos = parseInt(puntosInput, 10);
    if (isNaN(puntos) || puntos <= 0) return;
    await consultarDescuento(clienteId, puntos);
  };

  const handleAplicarPuntos = async () => {
    const puntos = parseInt(puntosInput, 10);
    if (isNaN(puntos) || puntos <= 0 || !compraSeleccionada) return;
    await aplicarPuntos(clienteId, compraSeleccionada, puntos);
    setPasoActual('confirmacion');
  };

  const handleConfirmar = async () => {
    if (!reserva) return;
    await confirmarReserva(reserva.reserva_id);
    setPasoActual('resultado');
  };

  const handleCancelar = async () => {
    if (!reserva) return;
    await cancelarReserva(reserva.reserva_id);
    reset();
    setPasoActual('seleccion');
    setPuntosInput('');
  };

  const handleVolver = () => {
    reset();
    setPasoActual('seleccion');
    setPuntosInput('');
    onNavigate('portal');
  };

  const formatCOP = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
      paddingTop: '24px',
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
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '400',
      color: tokens.color.neutral.slate.value,
    },
    saldoCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      backgroundColor: tokens.color.neutral.mist.value,
      borderRadius: tokens.radii.medium.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
    },
    saldoLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '400',
      color: tokens.color.neutral.graphite.value,
    },
    saldoValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '12px',
      alignItems: 'flex-end',
    },
    sectionTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_sm.size.value,
      fontWeight: tokens.typography.scale.title_sm.weight.value,
      lineHeight: tokens.typography.scale.title_sm.line_height.value,
      color: tokens.color.neutral.ink.value,
      margin: '0 0 12px 0',
    },
    compraCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      padding: '16px',
      backgroundColor: tokens.color.neutral.paper.value,
      borderRadius: tokens.radii.small.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
      cursor: 'pointer',
    },
    compraCardSelected: {
      borderColor: tokens.color.action.primary.value,
      backgroundColor: tokens.color.neutral.mist.value,
    },
    compraMonto: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      fontWeight: '600',
      color: tokens.color.neutral.ink.value,
    },
    compraFecha: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    descuentoPreview: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      padding: '16px',
      backgroundColor: tokens.color.semantic.success.surface.value,
      borderRadius: tokens.radii.small.value,
      border: `1px solid ${tokens.color.semantic.success.border.value}`,
    },
    descuentoValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.semantic.success.text.value,
    },
    descuentoLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.semantic.success.text.value,
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
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
    resultadoContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '24px',
      padding: '32px 0',
      textAlign: 'center' as const,
    },
    resultadoIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultadoTitle: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
      margin: 0,
    },
    resultadoMessage: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      color: tokens.color.neutral.graphite.value,
    },
  };

  if (loadingData) {
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

  if (fetchError) {
    return (
      <div style={styles.container}>
        <Alerta
          tone="error"
          title="Error al cargar datos"
          message={fetchError}
          actionLabel="Reintentar"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Aplicar Puntos al Pago</h1>
        <p style={styles.subtitle}>Utiliza tus puntos disponibles para obtener descuentos en tu compra</p>
      </div>

      <div style={styles.saldoCard}>
        <span style={styles.saldoLabel}>Saldo Disponible</span>
        <span style={styles.saldoValue}>{saldoDisponible.toLocaleString('es-CO')} pts</span>
      </div>

      {error && (
        <Alerta
          tone="error"
          title="Error"
          message={error}
          actionLabel="Intentar de nuevo"
          onAction={reset}
        />
      )}

      {pasoActual === 'seleccion' && (
        <>
          <Tarjeta>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Selecciona una compra</h3>
              {compras.length === 0 ? (
                <p style={{ color: tokens.color.neutral.slate.value, margin: 0 }}>
                  No tienes compras disponibles para aplicar puntos.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  {compras.map((compra) => (
                    <div
                      key={compra.compra_id}
                      style={{
                        ...styles.compraCard,
                        ...(compraSeleccionada === compra.compra_id ? styles.compraCardSelected : {}),
                      }}
                      onClick={() => setCompraSeleccionada(compra.compra_id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setCompraSeleccionada(compra.compra_id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span style={styles.compraMonto}>{formatCOP(compra.monto_total)}</span>
                      <span style={styles.compraFecha}>
                        {new Date(compra.fecha_compra).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tarjeta>

          <Tarjeta>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Cantidad de puntos a usar</h3>
              <div style={styles.inputRow}>
                <CampoTexto
                  label="Puntos"
                  value={puntosInput}
                  placeholder="Ej: 500"
                  type="number"
                  onChange={setPuntosInput}
                />
                <BotonPrimario
                  label="Consultar Descuento"
                  onClick={handleConsultarDescuento}
                  disabled={!puntosInput || parseInt(puntosInput, 10) <= 0}
                  loading={loading}
                />
              </div>

              {descuentoInfo && (
                <div style={styles.descuentoPreview}>
                  {descuentoInfo.viable ? (
                    <>
                      <span style={styles.descuentoValue}>
                        {formatCOP(descuentoInfo.descuento_cop)}
                      </span>
                      <span style={styles.descuentoLabel}>
                        Equivalente en descuento
                      </span>
                    </>
                  ) : (
                    <span style={{ color: tokens.color.semantic.error.text.value }}>
                      {descuentoInfo.mensaje || 'No es posible aplicar estos puntos'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Tarjeta>

          <div style={styles.buttonRow}>
            <BotonPrimario
              label="Aplicar Puntos"
              onClick={handleAplicarPuntos}
              disabled={
                !compraSeleccionada ||
                !puntosInput ||
                parseInt(puntosInput, 10) <= 0 ||
                !descuentoInfo?.viable
              }
              loading={loading}
              size="lg"
            />
            <BotonPrimario
              label="Cancelar"
              variant="secondary"
              onClick={() => onNavigate('portal')}
            />
          </div>
        </>
      )}

      {pasoActual === 'confirmacion' && reserva && descuentoInfo && (
        <>
          <Tarjeta>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Confirmar aplicación de puntos</h3>
              <div style={styles.descuentoPreview}>
                <span style={styles.descuentoValue}>
                  {formatCOP(descuentoInfo.descuento_cop)}
                </span>
                <span style={styles.descuentoLabel}>
                  Descuento que recibirás
                </span>
              </div>
              <p style={{ margin: 0, color: tokens.color.neutral.graphite.value }}>
                Se reservarán <strong>{reserva.cantidad_reservada}</strong> puntos de tu saldo.
                Una vez confirmado, el descuento será aplicado a tu compra.
              </p>
            </div>
          </Tarjeta>

          <div style={styles.buttonRow}>
            <BotonPrimario
              label="Confirmar"
              onClick={handleConfirmar}
              loading={loading}
              size="lg"
            />
            <BotonPrimario
              label="Cancelar"
              variant="secondary"
              onClick={handleCancelar}
              disabled={loading}
            />
          </div>
        </>
      )}

      {pasoActual === 'resultado' && (
        <Tarjeta>
          <div style={styles.resultadoContainer}>
            <div
              style={{
                ...styles.resultadoIcon,
                backgroundColor: tokens.color.semantic.success.surface.value,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke={tokens.color.semantic.success.icon.value}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={styles.resultadoTitle}>¡Descuento aplicado exitosamente!</h2>
            <p style={styles.resultadoMessage}>
              El descuento ha sido aplicado a tu compra. Los puntos utilizados han sido descontados de tu saldo.
            </p>
            <BotonPrimario
              label="Volver al inicio"
              onClick={handleVolver}
              size="lg"
            />
          </div>
        </Tarjeta>
      )}
    </div>
  );
};

export default AplicacionPuntosPago;
