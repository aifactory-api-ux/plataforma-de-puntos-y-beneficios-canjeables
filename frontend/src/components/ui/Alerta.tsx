import React from 'react';
import { tokens } from '../../styles/tokens';
import { BotonPrimario } from './BotonPrimario';

export interface AlertaProps {
  tone: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const Alerta: React.FC<AlertaProps> = ({
  tone,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const semanticStyles = {
    success: {
      backgroundColor: tokens.color.semantic.success.surface.value,
      borderColor: tokens.color.semantic.success.border.value,
      titleColor: tokens.color.semantic.success.text.value,
      iconColor: tokens.color.semantic.success.icon.value,
    },
    warning: {
      backgroundColor: tokens.color.semantic.warning.surface.value,
      borderColor: tokens.color.semantic.warning.border.value,
      titleColor: tokens.color.semantic.warning.text.value,
      iconColor: tokens.color.semantic.warning.icon.value,
    },
    error: {
      backgroundColor: tokens.color.semantic.error.surface.value,
      borderColor: tokens.color.semantic.error.border.value,
      titleColor: tokens.color.semantic.error.text.value,
      iconColor: tokens.color.semantic.error.icon.value,
    },
    info: {
      backgroundColor: tokens.color.semantic.info.surface.value,
      borderColor: tokens.color.semantic.info.border.value,
      titleColor: tokens.color.semantic.info.text.value,
      iconColor: tokens.color.semantic.info.icon.value,
    },
  };

  const defaultIcons: Record<string, React.ReactNode> = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 10 11 15 8 12" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  const currentStyle = semanticStyles[tone];

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: currentStyle.backgroundColor,
    border: `1px solid ${currentStyle.borderColor}`,
    borderRadius: tokens.radii.medium.value,
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: currentStyle.iconColor,
    flexShrink: 0,
    marginTop: '2px',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '600',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: currentStyle.titleColor,
    margin: 0,
    letterSpacing: '0em',
  };

  const messageStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    lineHeight: tokens.typography.scale.body_sm.line_height.value,
    color: tokens.color.neutral.graphite.value,
    margin: message ? '4px 0 0 0' : 0,
    letterSpacing: '0em',
  };

  return (
    <div style={style} role="alert" aria-live="polite">
      <span style={iconStyle}>
        {defaultIcons[tone]}
      </span>
      <div style={contentStyle}>
        <p style={titleStyle}>{title}</p>
        {message && <p style={messageStyle}>{message}</p>}
        {actionLabel && onAction && (
          <div style={{ marginTop: '12px' }}>
            <BotonPrimario
              label={actionLabel}
              variant="secondary"
              size="sm"
              onClick={onAction}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerta;