import React from 'react';
import { tokens } from '../../styles/tokens';
import { EtiquetaEstado } from './EtiquetaEstado';

export interface FilaMovimientoProps {
  type: 'acumulacion' | 'canje' | 'reversion' | 'ajuste' | 'vencimiento';
  points: number;
  timestamp: string;
  reference?: string;
  status?: string;
}

export const FilaMovimiento: React.FC<FilaMovimientoProps> = ({
  type,
  points,
  timestamp,
  reference,
  status,
}) => {
  const typeConfig: Record<string, { label: string; tone: 'success' | 'warning' | 'error' | 'info' | 'neutral'; prefix: string }> = {
    acumulacion: { label: 'Acumulación', tone: 'success', prefix: '+' },
    canje: { label: 'Canje', tone: 'info', prefix: '-' },
    reversion: { label: 'Reversión', tone: 'warning', prefix: '+' },
    ajuste: { label: 'Ajuste', tone: 'neutral', prefix: '' },
    vencimiento: { label: 'Vencimiento', tone: 'error', prefix: '-' },
  };

  const config = typeConfig[type];

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPoints = (value: number): string => {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: tokens.color.neutral.paper.value,
    borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
    gap: '16px',
    minHeight: '72px',
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  };

  const typeLabelStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '500',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: tokens.color.neutral.ink.value,
    letterSpacing: '0em',
    margin: 0,
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const timestampStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    lineHeight: tokens.typography.scale.body_sm.line_height.value,
    color: tokens.color.neutral.slate.value,
    letterSpacing: '0em',
  };

  const referenceStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    lineHeight: tokens.typography.scale.body_sm.line_height.value,
    color: tokens.color.neutral.muted.value,
    letterSpacing: '0em',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    flexShrink: 0,
  };

  const pointsStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.numeric.value,
    fontSize: tokens.typography.scale.title_sm.size.value,
    fontWeight: '600',
    lineHeight: tokens.typography.scale.title_sm.line_height.value,
    color: config.prefix === '-' ? tokens.color.semantic.error.text.value : tokens.color.semantic.success.text.value,
    letterSpacing: '-0.01em',
    margin: 0,
  };

  const ariaLabel = `${config.label}: ${config.prefix}${formatPoints(points)} puntos${reference ? `, referencia ${reference}` : ''}, ${formatDate(timestamp)}`;

  return (
    <div style={style} role="listitem" aria-label={ariaLabel}>
      <div style={leftSectionStyle}>
        <p style={typeLabelStyle}>{config.label}</p>
        <div style={metaStyle}>
          <span style={timestampStyle}>{formatDate(timestamp)}</span>
          {reference && <span style={referenceStyle}>· {reference}</span>}
        </div>
      </div>
      <div style={rightSectionStyle}>
        <p style={pointsStyle}>
          {config.prefix}{formatPoints(points)}
        </p>
        {status && (
          <EtiquetaEstado
            status={config.tone}
            label={status}
          />
        )}
      </div>
    </div>
  );
};

export default FilaMovimiento;