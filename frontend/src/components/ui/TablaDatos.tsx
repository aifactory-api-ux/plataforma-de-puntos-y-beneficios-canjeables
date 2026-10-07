import React from 'react';
import { tokens } from '../../styles/tokens';
import { Column, Row } from '../../types/ui';

export interface TablaDatosProps {
  columns: Column[];
  rows: Row[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  onRowClick?: (row: Row) => void;
}

export const TablaDatos: React.FC<TablaDatosProps> = ({
  columns,
  rows,
  loading = false,
  emptyState,
  errorState,
  onRowClick,
}) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    lineHeight: tokens.typography.scale.body_md.line_height.value,
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: tokens.color.neutral.mist.value,
    borderBottom: `2px solid ${tokens.color.neutral.line.value}`,
  };

  const thStyle = (align: 'left' | 'right' | 'center' = 'left'): React.CSSProperties => ({
    padding: '12px 16px',
    textAlign: align,
    fontWeight: '600',
    color: tokens.color.neutral.ink.value,
    letterSpacing: '0em',
    whiteSpace: 'nowrap' as const,
  });

  const trStyle = (clickable: boolean): React.CSSProperties => ({
    borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
    backgroundColor: 'transparent',
    cursor: clickable ? 'pointer' : 'default',
    transition: `background-color ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
  });

  const tdStyle = (align: 'left' | 'right' | 'center' = 'left'): React.CSSProperties => ({
    padding: '14px 16px',
    textAlign: align,
    color: tokens.color.neutral.ink.value,
    letterSpacing: '0em',
    verticalAlign: 'middle' as const,
  });

  const loadingRowStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: tokens.color.neutral.slate.value,
  };

  const emptyContainerStyle: React.CSSProperties = {
    padding: '48px 16px',
    textAlign: 'center' as const,
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_lg.size.value,
    fontWeight: '600',
    color: tokens.color.neutral.graphite.value,
    marginBottom: '8px',
  };

  const emptyDescStyle: React.CSSProperties = {
    fontFamily: tokens.typography.family.primary.value,
    fontSize: tokens.typography.scale.body_md.size.value,
    fontWeight: '400',
    color: tokens.color.neutral.slate.value,
  };

  const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>(null);

  if (loading) {
    return (
      <table style={tableStyle} aria-busy="true" aria-label="Cargando datos">
        <thead style={theadStyle}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle(col.align)} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} style={loadingRowStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Cargando...
              </div>
            </td>
          </tr>
        </tbody>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </table>
    );
  }

  if (errorState) {
    return (
      <table style={tableStyle} aria-label="Datos con error">
        <thead style={theadStyle}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle(col.align)} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length}>{errorState}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (rows.length === 0) {
    return (
      <table style={tableStyle} aria-label="Sin datos">
        <thead style={theadStyle}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle(col.align)} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length}>
              <div style={emptyContainerStyle}>
                {emptyState ? (
                  emptyState
                ) : (
                  <>
                    <p style={emptyTitleStyle}>No hay datos disponibles</p>
                    <p style={emptyDescStyle}>Intenta ajustar los filtros o realizar una nueva búsqueda</p>
                  </>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table style={tableStyle} aria-label="Tabla de datos">
      <thead style={theadStyle}>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={thStyle(col.align)} scope="col">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const isClickable = !!onRowClick;
          const isHovered = hoveredRowIndex === rowIndex;
          return (
            <tr
              key={rowIndex}
              style={{
                ...trStyle(isClickable),
                backgroundColor: isHovered ? tokens.color.neutral.mist.value : 'transparent',
              }}
              onClick={() => onRowClick?.(row)}
              onMouseEnter={() => setHoveredRowIndex(rowIndex)}
              onMouseLeave={() => setHoveredRowIndex(null)}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick?.(row);
                }
              }}
              role={isClickable ? 'button' : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} style={tdStyle(col.align)}>
                  {row[col.key] !== undefined ? String(row[col.key]) : ''}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TablaDatos;
