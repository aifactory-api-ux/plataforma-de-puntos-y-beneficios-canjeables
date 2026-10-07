import React from 'react';
import { tokens } from '../../styles/tokens';
import { Tarjeta } from './Tarjeta';

export interface PanelResumenAdminProps {
  totalClientes?: number;
  totalPuntosDisponibles?: number;
  totalPuntosPendientes?: number;
  totalCanjeados?: number;
  totalVencidos?: number;
  tendencia?: 'up' | 'down' | 'flat';
  loading?: boolean;
}

export const PanelResumenAdmin: React.FC<PanelResumenAdminProps> = ({
  totalClientes = 0,
  totalPuntosDisponibles = 0,
  totalPuntosPendientes = 0,
  totalCanjeados = 0,
  totalVencidos = 0,
  tendencia = 'flat',
  loading = false,
}) => {
  const formatNumber = (value: number): string => {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const tendenciaIcon: Record<string, React.ReactNode> = {
    up: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    down: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    ),
    flat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  };

  const tendenciaColor: Record<string, string> = {
    up: tokens.color.semantic.success.text.value,
    down: tokens.color.semantic.error.text.value,
    flat: tokens.color.neutral.slate.value,
  };

  const statStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: '140px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.label_sm.size.value,
    fontWeight: '500',
    lineHeight: tokens.typography.scale.label_sm.line_height.value,
    color: tokens.color.neutral.slate.value,
    letterSpacing: tokens.typography.scale.label_sm.letter_spacing.value,
    textTransform: 'uppercase',
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.numeric.value,
    fontSize: tokens.typography.scale.title_lg.size.value,
    fontWeight: '600',
    lineHeight: tokens.typography.scale.title_lg.line_height.value,
    color: tokens.color.neutral.ink.value,
    letterSpacing: '-0.01em',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
  };

  const tendenciaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
    color: tendenciaColor[tendencia],
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    fontWeight: '500',
  };

  if (loading) {
    return (
      <Tarjeta title="Resumen del Programa" padding="lg" elevation="card">
        <div style={containerStyle}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={statStyle}>
              <div style={{
                ...labelStyle,
                width: '60px',
                height: '14px',
                backgroundColor: tokens.color.neutral.mist.value,
                borderRadius: '4px',
              }} />
              <div style={{
                ...valueStyle,
                width: '80px',
                height: '32px',
                backgroundColor: tokens.color.neutral.mist.value,
                borderRadius: '4px',
                marginTop: '4px',
              }} />
            </div>
          ))}
        </div>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta title="Resumen del Programa" padding="lg" elevation="card">
      <div style={containerStyle}>
        <div style={statStyle}>
          <span style={labelStyle}>Total Clientes</span>
          <span style={valueStyle}>{formatNumber(totalClientes)}</span>
        </div>
        <div style={statStyle}>
          <span style={labelStyle}>Puntos Disponibles</span>
          <span style={valueStyle}>{formatNumber(totalPuntosDisponibles)}</span>
        </div>
        <div style={statStyle}>
          <span style={labelStyle}>Puntos Pendientes</span>
          <span style={valueStyle}>{formatNumber(totalPuntosPendientes)}</span>
        </div>
        <div style={statStyle}>
          <span style={labelStyle}>Total Canjeados</span>
          <span style={valueStyle}>{formatNumber(totalCanjeados)}</span>
          <div style={tendenciaStyle}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{tendenciaIcon[tendencia]}</span>
            <span>vs mes anterior</span>
          </div>
        </div>
        <div style={statStyle}>
          <span style={labelStyle}>Total Vencidos</span>
          <span style={{ ...valueStyle, color: tokens.color.semantic.error.text.value }}>
            {formatNumber(totalVencidos)}
          </span>
        </div>
      </div>
    </Tarjeta>
  );
};

export default PanelResumenAdmin;