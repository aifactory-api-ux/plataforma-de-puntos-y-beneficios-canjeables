import React from 'react';
import { tokens } from '../../styles/tokens';
import { Step } from '../../types/ui';

export interface PasosProcesoProps {
  steps: Step[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

export const PasosProceso: React.FC<PasosProcesoProps> = ({
  steps,
  currentIndex,
  onStepClick,
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0',
    width: '100%',
  };

  const stepWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  };

  const getStepIcon = (index: number, isCompleted: boolean, isCurrent: boolean): React.ReactNode => {
    if (isCompleted) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    if (isCurrent) {
      return (
        <span style={{
          fontFamily: tokens.typography.family.numeric.value,
          fontSize: '12px',
          fontWeight: '600',
        }}>
          {index + 1}
        </span>
      );
    }
    return (
      <span style={{
        fontFamily: tokens.typography.family.numeric.value,
        fontSize: '12px',
        fontWeight: '600',
        color: tokens.color.neutral.muted.value,
      }}>
        {index + 1}
      </span>
    );
  };

  const renderStep = (step: Step, index: number) => {
    const isCompleted = index < currentIndex;
    const isCurrent = index === currentIndex;
    const isPending = index > currentIndex;

    const circleStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: `2px solid ${
        isCompleted
          ? tokens.color.semantic.success.border.value
          : isCurrent
          ? tokens.color.neutral.ink.value
          : tokens.color.neutral.line.value
      }`,
      backgroundColor: isCompleted
        ? tokens.color.semantic.success.surface.value
        : isCurrent
        ? tokens.color.neutral.paper.value
        : tokens.color.neutral.mist.value,
      color: isCompleted
        ? tokens.color.semantic.success.text.value
        : isCurrent
        ? tokens.color.neutral.ink.value
        : tokens.color.neutral.muted.value,
      transition: `all ${tokens.motion.duration_base.value} ${tokens.motion.easing.value}`,
      cursor: onStepClick && isCompleted ? 'pointer' : 'default',
      zIndex: 1,
    };

    const labelStyle: React.CSSProperties = {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: isCurrent ? '600' : '400',
      lineHeight: tokens.typography.scale.body_sm.line_height.value,
      color: isCurrent
        ? tokens.color.neutral.ink.value
        : isPending
        ? tokens.color.neutral.muted.value
        : tokens.color.neutral.graphite.value,
      textAlign: 'center',
      marginTop: '8px',
      maxWidth: '100px',
      letterSpacing: '0em',
    };

    const descriptionStyle: React.CSSProperties = {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.label_sm.size.value,
      lineHeight: tokens.typography.scale.label_sm.line_height.value,
      color: tokens.color.neutral.slate.value,
      textAlign: 'center',
      marginTop: '4px',
      maxWidth: '120px',
      letterSpacing: '0em',
    };

    const connectorStyle: React.CSSProperties = {
      position: 'absolute',
      top: '18px',
      left: '50%',
      width: '100%',
      height: '2px',
      backgroundColor: index < currentIndex
        ? tokens.color.semantic.success.border.value
        : tokens.color.neutral.line.value,
      zIndex: 0,
      transition: `background-color ${tokens.motion.duration_base.value} ${tokens.motion.easing.value}`,
    };

    return (
      <div
        key={step.id}
        style={stepWrapperStyle}
        onClick={() => isCompleted && onStepClick?.(index)}
      >
        {index < steps.length - 1 && (
          <div
            style={{
              ...connectorStyle,
              left: '50%',
              width: '100%',
            }}
          />
        )}
        <div style={circleStyle}>
          {getStepIcon(index, isCompleted, isCurrent)}
        </div>
        <span style={labelStyle}>{step.label}</span>
        {step.description && (
          <span style={descriptionStyle}>{step.description}</span>
        )}
      </div>
    );
  };

  return (
    <div style={style} role="navigation" aria-label="Pasos del proceso">
      {steps.map((step, index) => renderStep(step, index))}
    </div>
  );
};

export default PasosProceso;