import React from 'react';
import { tokens } from '../../styles/tokens';

export interface BotonPrimarioProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export const BotonPrimario: React.FC<BotonPrimarioProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  onClick,
}) => {
  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: tokens.typography.scale.body_sm.size.value,
      minHeight: '36px',
      gap: '6px',
    },
    md: {
      padding: '10px 20px',
      fontSize: tokens.typography.scale.body_md.size.value,
      minHeight: '44px',
      gap: '8px',
    },
    lg: {
      padding: '14px 28px',
      fontSize: tokens.typography.scale.body_lg.size.value,
      minHeight: '52px',
      gap: '10px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? tokens.color.action.disabled_bg.value : tokens.color.action.primary.value,
      color: disabled ? tokens.color.action.disabled_text.value : tokens.color.action.primary_text.value,
      border: 'none',
      hoverBg: disabled ? undefined : tokens.color.action.primary_hover.value,
      activeBg: disabled ? undefined : tokens.color.action.primary_active.value,
    },
    secondary: {
      backgroundColor: disabled ? tokens.color.action.disabled_bg.value : tokens.color.action.secondary.value,
      color: disabled ? tokens.color.action.disabled_text.value : tokens.color.action.secondary_text.value,
      border: `1px solid ${disabled ? tokens.color.neutral.stone.value : tokens.color.action.secondary_border.value}`,
      hoverBg: disabled ? undefined : tokens.color.action.secondary_hover.value,
      activeBg: disabled ? undefined : tokens.color.neutral.stone.value,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? tokens.color.action.disabled_text.value : tokens.color.action.ghost_text.value,
      border: 'none',
      hoverBg: disabled ? undefined : tokens.color.action.ghost_hover.value,
      activeBg: disabled ? undefined : tokens.color.neutral.stone.value,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: tokens.typography.family.primary.value,
    fontWeight: '600',
    letterSpacing: '0em',
    borderRadius: tokens.radii.small.value,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: `all ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    outline: 'none',
    ...currentSize,
    ...currentVariant,
    backgroundColor: isActive
      ? currentVariant.activeBg
      : isHovered
      ? currentVariant.hoverBg
      : currentVariant.backgroundColor,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading) {
        onClick();
      }
    }
  };

  return (
    <button
      type="button"
      style={style}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = tokens.shadows.focus_ring.value;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      <span>{label}</span>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

export default BotonPrimario;
