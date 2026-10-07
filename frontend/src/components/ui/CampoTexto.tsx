import React from 'react';
import { tokens } from '../../styles/tokens';

export interface CampoTextoProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'search';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const CampoTexto: React.FC<CampoTextoProps> = ({
  label,
  value,
  placeholder,
  type = 'text',
  error,
  required = false,
  disabled = false,
  onChange,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputId = React.useId();
  const errorId = `${inputId}-error`;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.label_md.size.value,
    fontWeight: '500',
    lineHeight: tokens.typography.scale.label_md.line_height.value,
    color: error ? tokens.color.semantic.error.text.value : tokens.color.neutral.graphite.value,
    marginBottom: '6px',
    letterSpacing: tokens.typography.scale.label_md.letter_spacing.value,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '44px',
    padding: '10px 14px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '400',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: disabled ? tokens.color.action.disabled_text.value : tokens.color.neutral.ink.value,
    backgroundColor: disabled ? tokens.color.action.disabled_bg.value : tokens.color.neutral.paper.value,
    border: `1px solid ${error ? tokens.color.semantic.error.border.value : isFocused ? tokens.color.focus.value : tokens.color.neutral.line.value}`,
    borderRadius: tokens.radii.small.value,
    outline: 'none',
    transition: `border-color ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    boxSizing: 'border-box' as const,
    letterSpacing: '0em',
  };

  const errorStyle: React.CSSProperties = {
    display: 'block',
    marginTop: '6px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_sm.size.value,
    fontWeight: '400',
    lineHeight: tokens.typography.scale.body_sm.line_height.value,
    color: tokens.color.semantic.error.text.value,
    letterSpacing: '0em',
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute' as const,
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.color.neutral.slate.value,
    pointerEvents: 'none' as const,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
        {required && (
          <span style={{ color: tokens.color.semantic.error.text.value, marginLeft: '4px' }} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div style={inputWrapperStyle}>
        {type === 'search' && (
          <div style={searchIconStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          style={{
            ...inputStyle,
            paddingLeft: type === 'search' ? '40px' : '14px',
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error && (
        <span id={errorId} style={errorStyle} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default CampoTexto;
