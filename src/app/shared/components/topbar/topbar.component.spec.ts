import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { signal } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { ThemeService } from '../../../core/services/theme.service';

const buildThemeStub = (isDarkValue: boolean) => {
  const isDark = signal(isDarkValue);
  return {
    isDark,
    cssClass: signal(isDarkValue ? 'theme-dark' : 'theme-light'),
    toggle: jest.fn(),
    init: jest.fn(),
  };
};

describe('TopbarComponent', () => {
  it('deve renderizar o título passado via input', async () => {
    const themeStub = buildThemeStub(true);
    await render(TopbarComponent, {
      inputs: { title: 'Meu App' },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    expect(screen.getByText('Meu App')).toBeInTheDocument();
  });

  it('deve exibir ícone light_mode quando tema é dark', async () => {
    const themeStub = buildThemeStub(true);
    await render(TopbarComponent, {
      inputs: { title: '' },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    expect(screen.getByText('light_mode')).toBeInTheDocument();
  });

  it('deve exibir ícone dark_mode quando tema é light', async () => {
    const themeStub = buildThemeStub(false);
    await render(TopbarComponent, {
      inputs: { title: '' },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    expect(screen.getByText('dark_mode')).toBeInTheDocument();
  });

  it('deve ter aria-label "Ativar tema claro" quando tema é dark', async () => {
    const themeStub = buildThemeStub(true);
    await render(TopbarComponent, {
      inputs: { title: '' },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument();
  });

  it('deve chamar toggle() ao clicar no botão de tema', async () => {
    const user = userEvent.setup();
    const themeStub = buildThemeStub(true);
    await render(TopbarComponent, {
      inputs: { title: '' },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }));
    expect(themeStub.toggle).toHaveBeenCalledTimes(1);
  });

  it('deve emitir sidebarToggle ao clicar no botão de menu', async () => {
    const user = userEvent.setup();
    const themeStub = buildThemeStub(true);
    const sidebarToggleSpy = jest.fn();
    await render(TopbarComponent, {
      inputs: { title: '' },
      on: { sidebarToggle: sidebarToggleSpy },
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });
    await user.click(screen.getByRole('button', { name: 'Alternar menu lateral' }));
    expect(sidebarToggleSpy).toHaveBeenCalledTimes(1);
  });
});
