import React from 'react';
import { tokens } from '../../styles/tokens';
import { BotonPrimario } from './BotonPrimario';

export interface EstadoVacioProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EstadoVacio: React.FC<EstadoVacioProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '48px 24px',
    minHeight: '200px',
  };

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    backgroundColor: tokens.color.neutral.mist.value,
    borderRadius: tokens.radii.large.value,
    marginBottom: '20px',
    color: tokens.color.neutral.muted.value,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.title_sm.size.value,
    fontWeight: tokens.typography.scale.title_sm.weight.value,
    lineHeight: tokens.typography.scale.title_sm.line_height.value,
    color: tokens.color.neutral.ink.value,
    margin: 0,
    letterSpacing: tokens.typography.scale.title_sm.letter_spacing.value,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: tokens.color.neutral.slate.value,
    margin: '8px 0 0 0',
    maxWidth: '320px',
    letterSpacing: '0em',
  };

  return (
    <div style={style} role="status" aria-label={title}>
      <div style={iconContainerStyle}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      </div>
      <h3 style={titleStyle}>{title}</h3>
      {description && <p style={descriptionStyle}>{description}</p>}
      {actionLabel && onAction && (
        <div style={{ marginTop: '20px' }}>
          <BotonPrimario
            label={actionLabel}
            variant="secondary"
            size="md"
            onClick={onAction}
          />
        </div>
      )}
    </div>
  );
};

export default EstadoVacio;