import React from 'react';
import { NavItem as NavItemType, CurrentUser } from '../../types/ui';
import { tokens } from '../../styles/tokens';

export interface NavegacionPrincipalProps {
  items: NavItemType[];
  activeId: string;
  user?: CurrentUser;
  onNavigate: (id: string) => void;
}

export const NavegacionPrincipal: React.FC<NavegacionPrincipalProps> = ({
  items,
  activeId,
  user,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const styles = {
    nav: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
      backgroundColor: tokens.color.neutral.paper.value,
      borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
    },
    container: {
      maxWidth: tokens.breakpoints.desktop.value,
      margin: '0 auto',
      padding: `0 ${tokens.spacing.page_gutter.mobile.value}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      gap: '24px',
    },
    logo: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.title_md.size.value,
      fontWeight: tokens.typography.scale.title_md.weight.value,
      color: tokens.color.neutral.ink.value,
      textDecoration: 'none',
      letterSpacing: tokens.typography.scale.title_md.letter_spacing.value,
    },
    desktopMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    desktopNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
    desktopLink: {
      padding: '10px 16px',
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_md.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.graphite.value,
      textDecoration: 'none',
      borderRadius: tokens.radii.small.value,
      transition: `all ${tokens.motion.duration_fast.value} ${tokens.motion.easing.value}`,
      cursor: 'pointer',
    },
    desktopLinkActive: {
      backgroundColor: tokens.color.neutral.mist.value,
      color: tokens.color.neutral.ink.value,
      fontWeight: '600',
    },
    desktopLinkHover: {
      backgroundColor: tokens.color.action.ghost_hover.value,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      paddingLeft: '16px',
      borderLeft: `1px solid ${tokens.color.neutral.line.value}`,
    },
    userName: {
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_sm.size.value,
      color: tokens.color.neutral.slate.value,
    },
    mobileMenuButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderRadius: tokens.radii.small.value,
      color: tokens.color.neutral.ink.value,
    },
    mobileMenu: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: tokens.color.neutral.paper.value,
      borderBottom: `1px solid ${tokens.color.neutral.line.value}`,
      boxShadow: tokens.shadows.card.value,
    },
    mobileNav: {
      display: 'flex',
      flexDirection: 'column' as const,
      padding: tokens.spacing.card_padding.mobile.value,
    },
    mobileLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      fontFamily: tokens.typography.family.primary.value,
      fontSize: tokens.typography.scale.body_lg.size.value,
      fontWeight: '500',
      color: tokens.color.neutral.graphite.value,
      textDecoration: 'none',
      borderRadius: tokens.radii.small.value,
      cursor: 'pointer',
      minHeight: '44px',
    },
    mobileLinkActive: {
      backgroundColor: tokens.color.neutral.mist.value,
      color: tokens.color.neutral.ink.value,
      fontWeight: '600',
    },
  };

  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(id);
    }
  };

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= parseInt(tokens.breakpoints.tablet.value);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= parseInt(tokens.breakpoints.tablet.value)) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={styles.nav} role="navigation" aria-label="Navegación principal">
      <div style={styles.container}>
        <a href="/" style={styles.logo}>
          Camper
        </a>

        <div style={{ ...styles.desktopMenu, display: isDesktop ? 'flex' : 'none' }}>
          <div style={styles.desktopNav}>
            {items.map((item) => {
              const isActive = item.id === activeId;
              const isHovered = item.id === hoveredId;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  style={{
                    ...styles.desktopLink,
                    ...(isActive ? styles.desktopLinkActive : {}),
                    ...(isHovered && !isActive ? styles.desktopLinkHover : {}),
                  }}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {user && (
            <div style={styles.userSection}>
              <span style={styles.userName}>{user.nombre}</span>
            </div>
          )}
        </div>

        <button
          style={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileNav} role="menu">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive ? styles.mobileLinkActive : {}),
                  }}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavegacionPrincipal;
