import React from 'react';
import { tokens } from '../../styles/tokens';

export interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  open,
  onClose,
  footer,
  size = 'md',
  children,
}) => {
  const sizeValues = {
    sm: '400px',
    md: '560px',
    lg: '720px',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.color.overlay.value,
    display: open ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: tokens.color.neutral.paper.value,
    borderRadius: tokens.radii.large.value,
    boxShadow: tokens.shadows.modal.value,
    width: '100%',
    maxWidth: sizeValues[size],
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.title_md.size.value,
    fontWeight: tokens.typography.scale.title_md.weight.value,
    lineHeight: tokens.typography.scale.title_md.line_height.value,
    color: tokens.color.neutral.ink.value,
    margin: 0,
    letterSpacing: tokens.typography.scale.title_md.letter_spacing.value,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.radii.small.value,
    cursor: 'pointer',
    color: tokens.color.neutral.graphite.value,
    transition: `background-color ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
  };

  const bodyStyle: React.CSSProperties = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: `1px solid ${tokens.color.neutral.line.value}`,
  };

  if (!open) return null;

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>{title}</h2>
          <button
            type="button"
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.color.neutral.mist.value}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Cerrar modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;