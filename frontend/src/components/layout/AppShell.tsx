import React from 'react';
import { tokens } from '../../styles/tokens';
import { NavItem, CurrentUser } from '../../types/ui';
import { NavegacionPrincipal } from '../ui/NavegacionPrincipal';

export interface AppShellProps {
  children: React.ReactNode;
  items: NavItem[];
  activeId: string;
  user?: CurrentUser;
  onNavigate: (id: string) => void;
  variant?: 'portal' | 'admin';
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  items,
  activeId,
  user,
  onNavigate,
  variant = 'portal',
}) => {
  const styles = {
    shell: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: tokens.color.neutral.mist.value,
    },
    main: {
      flex: 1,
      width: '100%',
      maxWidth: variant === 'admin' ? 'none' : tokens.breakpoints.desktop.value,
      margin: '0 auto',
      padding: `0 ${tokens.spacing.page_gutter.mobile.value}`,
    },
    footer: {
      marginTop: 'auto',
      padding: `${tokens.spacing.section_gap.mobile.value} ${tokens.spacing.page_gutter.mobile.value}`,
      borderTop: `1px solid ${tokens.color.neutral.line.value}`,
      backgroundColor: tokens.color.neutral.paper.value,
    },
    footerContent: {
      maxWidth: tokens.breakpoints.desktop.value,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      alignItems: 'center',
      textAlign: 'center' as const,
    },
    footerText: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.muted.value,
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
    },
    footerLink: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
  };

  const filteredItems = React.useMemo(() => {
    if (variant === 'admin' && user) {
      return items;
    }
    return items;
  }, [items, variant, user]);

  const footerLinks = [
    { id: 'terminos', label: 'Términos y Condiciones' },
    { id: 'privacidad', label: 'Política de Privacidad' },
    { id: 'ayuda', label: 'Ayuda' },
  ];

  return (
    <div style={styles.shell}>
      <NavegacionPrincipal
        items={filteredItems}
        activeId={activeId}
        user={user}
        onNavigate={handleNavigate}
      />

      <main style={styles.main} id="main-content" role="main">
        {children}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Programa de Puntos Camper © {new Date().getFullYear()}
          </p>
          <div style={styles.footerLinks}>
            {footerLinks.map((link) => (
              <span
                key={link.id}
                style={styles.footerLink}
                onClick={() => onNavigate(link.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(link.id);
                  }
                }}
              >
                {link.label}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
