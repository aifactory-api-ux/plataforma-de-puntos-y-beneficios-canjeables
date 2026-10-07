import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PortalCliente } from '../pages/PortalCliente';
import { Inscripcion } from '../pages/Inscripcion';
import { ResumenPuntosPage } from '../pages/ResumenPuntos';
import { SaldoDisponiblePendiente } from '../pages/SaldoDisponiblePendiente';
import { HistorialPage } from '../pages/Historial';
import { ProximosVencimientosPage } from '../pages/ProximosVencimientos';
import { TerminosPage } from '../pages/Terminos';
import { AplicacionPuntosPago } from '../pages/AplicacionPuntosPago';
import { useEffect, useCallback } from 'react';
import type { NavItem, CurrentUser } from '../types/ui';

const DEFAULT_CLIENTE_ID = 'demo-cliente-001';

const user: CurrentUser = {
  cliente_id: DEFAULT_CLIENTE_ID,
  nombre: 'Cliente Demo',
  email: 'cliente@ejemplo.com',
};

const portalNavItems: NavItem[] = [
  { id: 'portal', label: 'Inicio', href: '/' },
  { id: 'resumen', label: 'Resumen', href: '/resumen' },
  { id: 'saldo', label: 'Saldos', href: '/saldo' },
  { id: 'historial', label: 'Historial', href: '/historial' },
  { id: 'vencimientos', label: 'Vencimientos', href: '/vencimientos' },
  { id: 'canje', label: 'Canjear', href: '/canje' },
  { id: 'terminos', label: 'Términos', href: '/terminos' },
];

function getActiveIdFromPath(path: string): string {
  if (path === '/' || path === '/portal') return 'portal';
  if (path === '/resumen') return 'resumen';
  if (path === '/saldo') return 'saldo';
  if (path === '/historial') return 'historial';
  if (path === '/vencimientos') return 'vencimientos';
  if (path === '/terminos') return 'terminos';
  if (path === '/inscripcion') return 'inscripcion';
  if (path === '/canje') return 'canje';
  return 'portal';
}

function getTitleFromPath(path: string): string {
  if (path === '/' || path === '/portal') return 'Portal del Cliente';
  if (path === '/resumen') return 'Resumen de Puntos';
  if (path === '/saldo') return 'Saldos';
  if (path === '/historial') return 'Historial';
  if (path === '/vencimientos') return 'Próximos Vencimientos';
  if (path === '/terminos') return 'Términos y Condiciones';
  if (path === '/inscripcion') return 'Inscripción';
  if (path === '/canje') return 'Canjear Puntos';
  return 'Portal del Cliente';
}

function usePageNavigate() {
  const navigate = useNavigate();
  return useCallback((pageId: string) => {
    const href = portalNavItems.find(item => item.id === pageId)?.href ?? '/';
    navigate(href);
  }, [navigate]);
}

function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeId = getActiveIdFromPath(location.pathname);

  const handleNavigate = useCallback((pageId: string) => {
    const href = portalNavItems.find(item => item.id === pageId)?.href ?? '/';
    navigate(href);
  }, [navigate]);

  useEffect(() => {
    document.title = getTitleFromPath(location.pathname);
  }, [location.pathname]);

  return (
    <AppShell
      items={portalNavItems}
      activeId={activeId}
      user={user}
      onNavigate={handleNavigate}
      variant="portal"
    >
      <Outlet context={{ navigate: handleNavigate }} />
    </AppShell>
  );
}

interface WithOnNavigateProps {
  onNavigate?: (id: string) => void;
}

function withOnNavigate<P extends WithOnNavigateProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, 'onNavigate'>> {
  return function WrappedComponent(props: Omit<P, 'onNavigate'>) {
    const handleNavigate = usePageNavigate();
    return <Component {...(props as P)} onNavigate={handleNavigate} />;
  };
}

const WrappedPortalCliente = withOnNavigate(PortalCliente);
const WrappedResumenPuntosPage = withOnNavigate(ResumenPuntosPage);
const WrappedSaldoDisponiblePendiente = withOnNavigate(SaldoDisponiblePendiente);
const WrappedInscripcion = withOnNavigate(Inscripcion);
const WrappedAplicacionPuntosPago = withOnNavigate(AplicacionPuntosPago);

export const AppRouter = createBrowserRouter([
  {
    element: <PortalLayout />,
    children: [
      {
        path: '/',
        element: <WrappedPortalCliente clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/portal',
        element: <WrappedPortalCliente clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/resumen',
        element: <WrappedResumenPuntosPage clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/saldo',
        element: <WrappedSaldoDisponiblePendiente clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/historial',
        element: <HistorialPage clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/vencimientos',
        element: <ProximosVencimientosPage clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/terminos',
        element: <TerminosPage />,
      },
      {
        path: '/inscripcion',
        element: <WrappedInscripcion clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '/canje',
        element: <WrappedAplicacionPuntosPago clienteId={DEFAULT_CLIENTE_ID} />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default AppRouter;
