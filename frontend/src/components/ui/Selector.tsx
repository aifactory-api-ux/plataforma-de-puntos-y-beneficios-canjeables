import React from 'react';
import { tokens } from '../../styles/tokens';
import { SelectOption } from '../../types/ui';

export interface SelectorProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const Selector: React.FC<SelectorProps> = ({
  label,
  value,
  options,
  placeholder = 'Seleccionar...',
  error,
  disabled = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const labelId = React.useId();

  const selectedOption = options.find((opt) => opt.value === value);

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

  const triggerStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '44px',
    padding: '10px 40px 10px 14px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '400',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: disabled
      ? tokens.color.action.disabled_text.value
      : selectedOption
      ? tokens.color.neutral.ink.value
      : tokens.color.neutral.slate.value,
    backgroundColor: disabled ? tokens.color.action.disabled_bg.value : tokens.color.neutral.paper.value,
    border: `1px solid ${error ? tokens.color.semantic.error.border.value : isFocused ? tokens.color.focus.value : tokens.color.neutral.line.value}`,
    borderRadius: tokens.radii.small.value,
    textAlign: 'left' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: `border-color ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    boxSizing: 'border-box' as const,
    letterSpacing: '0em',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: tokens.color.neutral.paper.value,
    border: `1px solid ${tokens.color.neutral.line.value}`,
    borderRadius: tokens.radii.small.value,
    boxShadow: tokens.shadows.card.value,
    zIndex: 1000,
    maxHeight: '240px',
    overflowY: 'auto' as const,
  };

  const optionStyle = (isSelected: boolean, isHighlighted: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '400',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: isSelected ? tokens.color.neutral.ink.value : tokens.color.neutral.graphite.value,
    backgroundColor: isHighlighted
      ? tokens.color.neutral.mist.value
      : isSelected
      ? tokens.color.neutral.stone.value
      : 'transparent',
    cursor: 'pointer',
    outline: 'none',
    letterSpacing: '0em',
  });

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

  const iconStyle: React.CSSProperties = {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.color.neutral.slate.value,
  };

  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' as const }}>
      <label id={labelId} style={labelStyle}>
        {label}
      </label>
      <button
        type="button"
        style={triggerStyle}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        aria-invalid={!!error}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      <span style={iconStyle}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
      {isOpen && (
        <ul style={dropdownStyle} role="listbox" id={listboxId} aria-labelledby={labelId}>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              style={optionStyle(option.value === value, index === highlightedIndex)}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              tabIndex={-1}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span style={errorStyle} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Selector;
