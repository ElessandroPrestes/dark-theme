import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ThemeService } from '../../core/services/theme.service';
import { HomeComponent } from './home.component';

const buildThemeStub = (isDarkValue: boolean) => {
  const isDark = signal(isDarkValue);
  return {
    isDark,
    cssClass: signal(isDarkValue ? 'theme-dark' : 'theme-light'),
    toggle: jest.fn(),
    setTheme: jest.fn(),
    init: jest.fn(),
  };
};

describe('HomeComponent', () => {
  it('deve renderizar o formulário de login e o CTA de entrada', async () => {
    const themeStub = buildThemeStub(true);

    await render(HomeComponent, {
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Bem-vindo de volta' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve selecionar o tema ao clicar no icone correspondente', async () => {
    const user = userEvent.setup();
    const themeStub = buildThemeStub(true);

    await render(HomeComponent, {
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });

    await user.click(screen.getByRole('button', { name: 'Ativar modo claro' }));

    expect(themeStub.setTheme).toHaveBeenCalledWith('light');
  });

  it('deve validar o formulário antes de confirmar o login demo', async () => {
    const user = userEvent.setup();
    const themeStub = buildThemeStub(true);

    await render(HomeComponent, {
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument();
    expect(screen.getByText('Use ao menos 8 caracteres.')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Login demo validado. O fluxo está pronto para integração com autenticação real.',
      ),
    ).not.toBeInTheDocument();
  });

  it('deve exibir confirmação quando o formulário estiver válido', async () => {
    const user = userEvent.setup();
    const themeStub = buildThemeStub(true);

    await render(HomeComponent, {
      providers: [{ provide: ThemeService, useValue: themeStub }],
    });

    await user.type(screen.getByLabelText('Email corporativo'), 'hello@empresa.com');
    await user.type(screen.getByLabelText('Senha'), 'segredo123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      screen.getByText(
        'Login demo validado. O fluxo está pronto para integração com autenticação real.',
      ),
    ).toBeInTheDocument();
  }, 10000);
});
