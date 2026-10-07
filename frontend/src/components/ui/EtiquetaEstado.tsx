import React from 'react';
import { tokens } from '../../styles/tokens';

export interface EtiquetaEstadoProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  icon?: React.ReactNode;
}

export const EtiquetaEstado: React.FC<EtiquetaEstadoProps> = ({
  status,
  label,
  icon,
}) => {
  const semanticStyles = {
    success: {
      backgroundColor: tokens.color.semantic.success.surface.value,
      borderColor: tokens.color.semantic.success.border.value,
      color: tokens.color.semantic.success.text.value,
      iconColor: tokens.color.semantic.success.icon.value,
    },
    warning: {
      backgroundColor: tokens.color.semantic.warning.surface.value,
      borderColor: tokens.color.semantic.warning.border.value,
      color: tokens.color.semantic.warning.text.value,
      iconColor: tokens.color.semantic.warning.icon.value,
    },
    error: {
      backgroundColor: tokens.color.semantic.error.surface.value,
      borderColor: tokens.color.semantic.error.border.value,
      color: tokens.color.semantic.error.text.value,
      iconColor: tokens.color.semantic.error.icon.value,
    },
    info: {
      backgroundColor: tokens.color.semantic.info.surface.value,
      borderColor: tokens.color.semantic.info.border.value,
      color: tokens.color.semantic.info.text.value,
      iconColor: tokens.color.semantic.info.icon.value,
    },
    neutral: {
      backgroundColor: tokens.color.neutral.mist.value,
      borderColor: tokens.color.neutral.line.value,
      color: tokens.color.neutral.graphite.value,
      iconColor: tokens.color.neutral.slate.value,
    },
  };

  const currentStyle = semanticStyles[status];

  const defaultIcons: Record<string, React.ReactNode> = {
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    warning: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    neutral: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    fontWeight: '500',
    lineHeight: tokens.typography.scale.body_sm.line_height.value,
    borderRadius: tokens.radii.pill.value,
    border: `1px solid ${currentStyle.borderColor}`,
    backgroundColor: currentStyle.backgroundColor,
    color: currentStyle.color,
    letterSpacing: '0em',
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: currentStyle.iconColor,
    flexShrink: 0,
  };

  return (
    <span style={style} role="status" aria-label={label}>
      <span style={iconStyle}>
        {icon || defaultIcons[status]}
      </span>
      {label}
    </span>
  );
};

export default EtiquetaEstado;
