import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AppNavigation, DESTINATIONS } from '../web-ui/src/AppNavigation.js';
import { AppTopbar } from '../web-ui/src/AppTopbar.js';
import { ThemeControl } from '../web-ui/src/ThemeSelect.js';

describe('AppNavigation', () => {
  it('keeps primary destinations separate from overflow destinations', () => {
    expect(DESTINATIONS.filter((destination) => destination.placement === 'primary')).toEqual([
      expect.objectContaining({ id: 'chat', href: '/' }),
      expect.objectContaining({ id: 'workspace', href: '/workspace' }),
      expect.objectContaining({ id: 'monitor', href: '/monitor' }),
    ]);
    expect(DESTINATIONS.filter((destination) => destination.placement === 'secondary')).toEqual([
      expect.objectContaining({ id: 'schedules', href: '/schedules' }),
      expect.objectContaining({ id: 'extensions', href: '/extensions' }),
    ]);
  });

  it('keeps the primary destinations and the shared more menu in one header', () => {
    const nav = renderToStaticMarkup(createElement(AppNavigation, { current: 'workspace' }));
    vi.stubGlobal('window', { localStorage: { getItem: () => null } });
    let header: string;
    try {
      header = renderToStaticMarkup(createElement(AppTopbar, { current: 'extensions' }));
    } finally {
      vi.unstubAllGlobals();
    }

    expect(nav).toContain('aria-label="xangiの主要機能"');
    expect(nav).toContain('aria-current="page"');
    expect(nav).not.toContain('href="/extensions"');
    expect(header).toContain('href="/extensions"');
    expect(header).toContain('aria-current="page"');
    expect(header).toContain('<details class="app-more-menu">');
    expect(header).toContain('ほか');
  });

  it('keeps the shared navigation fixed instead of overriding it per page', () => {
    const styles = readFileSync(new URL('../web-ui/src/styles.css', import.meta.url), 'utf8');
    const monitorOverride = styles.match(/\.monitor-page\s*>\s*\.app-topbar\s*\{([^}]*)\}/)?.[1];

    expect(styles).toMatch(/\.app-topbar\s*\{[\s\S]*?position:\s*fixed;/);
    expect(styles).toMatch(
      /@media\s*\(max-width:\s*768px\)[\s\S]*?\.app-topbar\s*\{[\s\S]*?inset:\s*auto 0 0;/
    );
    expect(monitorOverride).toBeUndefined();
  });

  it('lets the workspace browser fill the viewport after navigation leaves document flow', () => {
    const styles = readFileSync(new URL('../web-ui/src/styles.css', import.meta.url), 'utf8');
    const workspaceShell = styles.match(/\.workspace-browser-shell\s*\{([^}]*)\}/)?.[1];

    expect(workspaceShell).toMatch(/grid-template-rows:\s*minmax\(0,\s*1fr\);/);
    expect(workspaceShell).not.toMatch(/grid-template-rows:\s*auto/);
  });

  it('uses a compact theme menu in the rail and direct choices in the mobile sheet', () => {
    const rail = renderToStaticMarkup(
      createElement(ThemeControl, {
        variant: 'rail',
        preference: 'system',
        onChange: () => undefined,
      })
    );
    const sheet = renderToStaticMarkup(
      createElement(ThemeControl, {
        variant: 'sheet',
        preference: 'dark',
        onChange: () => undefined,
      })
    );

    expect(rail).toContain('aria-label="表示テーマ: 端末設定"');
    expect(rail).toContain('aria-haspopup="true"');
    expect(rail).toContain('aria-expanded="false"');
    expect(rail).not.toContain('<select');
    expect(sheet).toContain('aria-label="表示テーマ"');
    expect(sheet).toContain('端末設定');
    expect(sheet).toContain('ライト');
    expect(sheet).toContain('ダーク');
    expect(sheet).toContain('aria-pressed="true"');
    expect(sheet).not.toContain('<select');
  });
});
