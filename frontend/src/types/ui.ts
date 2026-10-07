export interface CurrentUser {
  cliente_id: string;
  nombre: string;
  email: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Column {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
}

export interface Row {
  [key: string]: string | number;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'search';
  options?: SelectOption[];
}

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface Tab {
  id: string;
  label: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}
