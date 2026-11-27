import { useEffect, useRef } from 'react';
import { AppNavigation, DESTINATIONS, NavigationIcon, type AppSurface } from './AppNavigation';
import { ThemeControl, useThemePreference } from './ThemeSelect';

export function AppTopbar({ current }: { current: AppSurface }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [themePreference, setThemePreference] = useThemePreference();

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !menu.open) return;
      menu.open = false;
      summaryRef.current?.focus({ preventScroll: true });
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <header className="app-topbar">
      <div className="app-page-navigation">
        <a className="brand" href="/" aria-label="xangi チャット">
          <span aria-hidden="true">x</span>
        </a>
        <AppNavigation current={current} />
      </div>
      <details ref={menuRef} className="app-more-menu">
        <summary ref={summaryRef}>
          <svg className="app-navigation-icon" viewBox="0 0 24 24" aria-hidden="true">
            <NavigationIcon icon="more" />
          </svg>
          ほか
        </summary>
        <div className="app-more-panel">
          <nav className="app-more-links" aria-label="ほかの機能">
            {DESTINATIONS.filter((destination) => destination.placement === 'secondary').map(
              (destination) => (
                <a
                  className={current === destination.id ? 'active' : undefined}
                  aria-current={current === destination.id ? 'page' : undefined}
                  href={destination.href}
                  key={destination.id}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <NavigationIcon icon={destination.icon} />
                  </svg>
                  <span>{destination.label}</span>
                </a>
              )
            )}
          </nav>
          <ThemeControl variant="sheet" preference={themePreference} onChange={setThemePreference} />
        </div>
      </details>
    </header>
  );
}
