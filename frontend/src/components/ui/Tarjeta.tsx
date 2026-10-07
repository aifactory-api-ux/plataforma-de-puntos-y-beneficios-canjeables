import React from 'react';
import { tokens } from '../../styles/tokens';

export interface TarjetaProps {
  title?: string;
  sectionTitle?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'subtle' | 'card';
  children: React.ReactNode;
}

export const Tarjeta: React.FC<TarjetaProps> = ({
  title,
  sectionTitle,
  padding = 'md',
  elevation = 'card',
  children,
}) => {
  const paddingValues = {
    sm: tokens.spacing.card_padding.mobile.value,
    md: '24px',
    lg: '32px',
  };

  const elevationStyles = {
    subtle: {
      boxShadow: tokens.shadows.subtle.value,
      border: `1px solid ${tokens.color.neutral.stone.value}`,
    },
    card: {
      boxShadow: tokens.shadows.card.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
    },
  };

  const style: React.CSSProperties = {
    backgroundColor: tokens.color.neutral.paper.value,
    borderRadius: tokens.radii.medium.value,
    padding: paddingValues[padding],
    ...elevationStyles[elevation],
  };

  return (
    <div style={style}>
      {title && (
        <h2
          style={{
            fontFamily: tokens.typography.family.primary.value,
            fontSize: tokens.typography.scale.title_sm.size.value,
            fontWeight: tokens.typography.scale.title_sm.weight.value,
            lineHeight: tokens.typography.scale.title_sm.line_height.value,
            color: tokens.color.neutral.ink.value,
            margin: '0 0 4px 0',
            letterSpacing: tokens.typography.scale.title_sm.letter_spacing.value,
          }}
        >
          {title}
        </h2>
      )}
      {sectionTitle && (
        <h3
          style={{
            fontFamily: tokens.typography.family.primary.value,
            fontSize: tokens.typography.scale.body_lg.size.value,
            fontWeight: '600',
            lineHeight: tokens.typography.scale.body_lg.line_height.value,
            color: tokens.color.neutral.ink_soft.value,
            margin: '0 0 16px 0',
          }}
        >
          {sectionTitle}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Tarjeta;
