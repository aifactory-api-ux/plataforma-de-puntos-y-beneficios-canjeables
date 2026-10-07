import React from 'react';
import { tokens } from '../../styles/tokens';
import { Tarjeta } from './Tarjeta';

export interface ResumenPuntosProps {
  availablePoints: number;
  pendingPoints: number;
  currency: 'COP';
  exchangeRate: number;
  expiresSoonCount?: number;
}

export const ResumenPuntos: React.FC<ResumenPuntosProps> = ({
  availablePoints,
  pendingPoints,
  currency,
  exchangeRate,
  expiresSoonCount = 0,
}) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-CO').format(Math.round(num));
  };

  const formatCOP = (points: number): string => {
    const copValue = points * exchangeRate;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(copValue);
  };

  const copEquivalent = availablePoints * exchangeRate;

  const style = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    pointsDisplay: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    availableLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.slate.value,
      letterSpacing: '0.02em',
      textTransform: 'uppercase' as const,
    },
    availableValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.display_md.size.value,
      fontWeight: tokens.typography.scale.display_md.weight.value,
      lineHeight: tokens.typography.scale.display_md.line_height.value,
      color: tokens.color.neutral.ink.value,
      letterSpacing: tokens.typography.scale.display_md.letter_spacing.value,
    },
    copEquivalent: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      fontWeight: '400',
      color: tokens.color.neutral.slate.value,
      marginTop: '4px',
    },
    pendingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: tokens.color.semantic.info.surface.value,
      borderRadius: tokens.radii.small.value,
      border: `1px solid ${tokens.color.semantic.info.border.value}`,
    },
    pendingIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokens.color.semantic.info.icon.value,
    },
    pendingContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px',
    },
    pendingLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.semantic.info.text.value,
    },
    pendingValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '600',
      color: tokens.color.semantic.info.text.value,
    },
    expiresSoonSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: tokens.color.semantic.warning.surface.value,
      borderRadius: tokens.radii.small.value,
      border: `1px solid ${tokens.color.semantic.warning.border.value}`,
    },
    expiresSoonIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokens.color.semantic.warning.icon.value,
    },
    expiresSoonContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px',
    },
    expiresSoonLabel: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.semantic.warning.text.value,
    },
    expiresSoonValue: {
      fontFamily: tokens.typography.family.numeric.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '600',
      color: tokens.color.semantic.warning.text.value,
    },
  };

  return (
    <Tarjeta padding="lg" elevation="card">
      <div style={style.container}>
        <div style={style.pointsDisplay}>
          <span style={style.availableLabel}>Puntos disponibles</span>
          <span style={style.availableValue} aria-label={`${formatNumber(availablePoints)} puntos disponibles`}>
            {formatNumber(availablePoints)}
          </span>
          <span style={style.copEquivalent}>
            Equivale a {formatCOP(copEquivalent)}
          </span>
        </div>

        {pendingPoints > 0 && (
          <div style={style.pendingSection}>
            <div style={style.pendingIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div style={style.pendingContent}>
              <span style={style.pendingLabel}>Pendiente de liberar</span>
              <span style={style.pendingValue}>{formatNumber(pendingPoints)} puntos</span>
            </div>
          </div>
        )}

        {expiresSoonCount > 0 && (
          <div style={style.expiresSoonSection}>
            <div style={style.expiresSoonIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div style={style.expiresSoonContent}>
              <span style={style.expiresSoonLabel}>Próximos a vencer</span>
              <span style={style.expiresSoonValue}>{expiresSoonCount} puntos</span>
            </div>
          </div>
        )}
      </div>
    </Tarjeta>
  );
};

export default ResumenPuntos;
