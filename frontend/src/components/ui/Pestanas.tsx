import React from 'react';
import { tokens } from '../../styles/tokens';
import { Tab } from '../../types/ui';

export interface PestanasProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export const Pestanas: React.FC<PestanasProps> = ({
  tabs,
  activeId,
  onChange,
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
    gap: '0',
    overflowX: 'auto',
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: isActive ? '600' : '400',
    lineHeight: tokens.typography.scale.body_md.line_height.value,
    color: isActive
      ? tokens.color.neutral.ink.value
      : tokens.color.neutral.slate.value,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${isActive ? tokens.color.neutral.ink.value : 'transparent'}`,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `all ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    letterSpacing: '0em',
    marginBottom: '-1px',
  });

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      onChange(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div style={style} role="tablist" aria-label="Pestañas de navegación">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            style={getTabStyle(isActive)}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${tokens.color.focus.value}`;
              e.currentTarget.style.outlineOffset = '-2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = tokens.color.neutral.graphite.value;
                e.currentTarget.style.backgroundColor = tokens.color.neutral.mist.value;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = tokens.color.neutral.slate.value;
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Pestanas;