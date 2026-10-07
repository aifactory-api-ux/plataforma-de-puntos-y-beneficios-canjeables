import React from 'react';
import { tokens } from '../../styles/tokens';
import { FilterDefinition } from '../../types/ui';
import { CampoTexto } from './CampoTexto';
import { Selector } from './Selector';

export interface BarraFiltrosProps {
  filters: FilterDefinition[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export const BarraFiltros: React.FC<BarraFiltrosProps> = ({
  filters,
  values,
  onChange,
}) => {
  const handleChange = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  const style: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '16px',
    backgroundColor: tokens.color.neutral.mist.value,
    borderRadius: tokens.radii.medium.value,
    border: `1px solid ${tokens.color.neutral.line.value}`,
  };

  return (
    <div style={style} role="search" aria-label="Filtros de búsqueda">
      {filters.map((filter) => {
        if (filter.type === 'select' && filter.options) {
          return (
            <Selector
              key={filter.key}
              label={filter.label}
              value={values[filter.key] || ''}
              options={filter.options}
              placeholder={`Seleccionar ${filter.label.toLowerCase()}`}
              onChange={(val) => handleChange(filter.key, val)}
            />
          );
        }
        if (filter.type === 'search' || filter.type === 'text') {
          return (
            <CampoTexto
              key={filter.key}
              label={filter.label}
              value={values[filter.key] || ''}
              placeholder={`Buscar ${filter.label.toLowerCase()}`}
              type="search"
              onChange={(val) => handleChange(filter.key, val)}
            />
          );
        }
        if (filter.type === 'date') {
          return (
            <CampoTexto
              key={filter.key}
              label={filter.label}
              value={values[filter.key] || ''}
              type="date"
              onChange={(val) => handleChange(filter.key, val)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default BarraFiltros;