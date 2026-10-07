import React from 'react';
import { tokens } from '../../styles/tokens';
import { EvidenceFile } from '../../types/ui';
import { Alerta } from './Alerta';

export interface SubidaEvidenciaProps {
  files: EvidenceFile[];
  onFilesChange: (files: EvidenceFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  error?: string;
  disabled?: boolean;
  label?: string;
}

export const SubidaEvidencia: React.FC<SubidaEvidenciaProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = 'image/*,.pdf',
  error,
  disabled = false,
  label = 'Subir evidencia',
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${maxSizeMB}MB`;
    }
    return null;
  };

  const createEvidenceFile = (file: File): EvidenceFile => {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    setLocalError(null);
    const newErrors: string[] = [];

    const availableSlots = maxFiles - files.length;
    const filesToAdd = Array.from(fileList).slice(0, availableSlots);

    const validFiles: EvidenceFile[] = [];
    for (const file of filesToAdd) {
      const validationError = validateFile(file);
      if (validationError) {
        newErrors.push(validationError);
      } else {
        validFiles.push(createEvidenceFile(file));
      }
    }

    if (newErrors.length > 0) {
      setLocalError(newErrors.join('. '));
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string): React.ReactNode => {
    if (type.startsWith('image/')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  };

  const displayError = error || localError;
  const canAddMore = files.length < maxFiles;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    dropzone: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '32px 24px',
      border: `2px dashed ${isDragging ? tokens.color.action.primary.value : tokens.color.neutral.line.value}`,
      borderRadius: tokens.radii.medium.value,
      backgroundColor: isDragging ? tokens.color.neutral.mist.value : tokens.color.neutral.paper.value,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: `all ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
      opacity: disabled ? 0.6 : 1,
    },
    dropzoneIcon: {
      color: tokens.color.neutral.slate.value,
    },
    dropzoneText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      color: tokens.color.neutral.graphite.value,
      textAlign: 'center' as const,
    },
    dropzoneHint: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.muted.value,
    },
    fileList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: tokens.color.neutral.mist.value,
      borderRadius: tokens.radii.small.value,
      border: `1px solid ${tokens.color.neutral.line.value}`,
    },
    fileIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokens.color.neutral.slate.value,
      flexShrink: 0,
    },
    fileInfo: {
      flex: 1,
      minWidth: 0,
    },
    fileName: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    fileSize: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.muted.value,
    },
    removeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      padding: 0,
      background: 'none',
      border: 'none',
      borderRadius: tokens.radii.small.value,
      cursor: 'pointer',
      color: tokens.color.neutral.slate.value,
      transition: `background-color ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
    },
    hiddenInput: {
      display: 'none',
    },
    label: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.label_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.ink.value,
      letterSpacing: tokens.typography.scale.label_md.letter_spacing.value,
    },
  };

  return (
    <div style={styles.container}>
      {label && <span style={styles.label}>{label}</span>}

      {displayError && (
        <Alerta tone="error" title="Error" message={displayError} />
      )}

      {canAddMore && (
        <div
          style={styles.dropzone}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <span style={styles.dropzoneIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span style={styles.dropzoneText}>
            Arrastra archivos aquí o haz clic para seleccionar
          </span>
          <span style={styles.dropzoneHint}>
            Máx. {maxFiles} archivos, {maxSizeMB}MB cada uno
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleInputChange}
            disabled={disabled}
            style={styles.hiddenInput}
            aria-hidden="true"
          />
        </div>
      )}

      {files.length > 0 && (
        <div style={styles.fileList} role="list" aria-label="Archivos cargados">
          {files.map((file) => (
            <div key={file.id} style={styles.fileItem} role="listitem">
              <span style={styles.fileIcon}>{getFileIcon(file.type)}</span>
              <div style={styles.fileInfo}>
                <div style={styles.fileName} title={file.name}>
                  {file.name}
                </div>
                <div style={styles.fileSize}>{formatFileSize(file.size)}</div>
              </div>
              <button
                type="button"
                style={styles.removeButton}
                onClick={() => handleRemove(file.id)}
                disabled={disabled}
                aria-label={`Eliminar ${file.name}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length >= maxFiles && (
        <span style={styles.dropzoneHint}>
          Has alcanzado el límite de {maxFiles} archivos
        </span>
      )}
    </div>
  );
};

export default SubidaEvidencia;
