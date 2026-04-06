import { render, screen } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  it('deve renderizar os três itens de navegação', async () => {
    await render(SidebarComponent, {
      imports: [RouterTestingModule],
      inputs: { collapsed: false },
    });
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Configurações' })).toBeInTheDocument();
  });

  it('deve exibir labels de texto quando não está colapsado', async () => {
    await render(SidebarComponent, {
      imports: [RouterTestingModule],
      inputs: { collapsed: false },
    });
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('deve ocultar labels de texto quando colapsado', async () => {
    await render(SidebarComponent, {
      imports: [RouterTestingModule],
      inputs: { collapsed: true },
    });
    expect(screen.queryByText('Início')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument();
  });

  it('deve aplicar classe sidebar--collapsed quando colapsado', async () => {
    const { container } = await render(SidebarComponent, {
      imports: [RouterTestingModule],
      inputs: { collapsed: true },
    });
    expect(container.querySelector('.sidebar--collapsed')).toBeInTheDocument();
  });

  it('deve ter nav com aria-label de navegação', async () => {
    await render(SidebarComponent, {
      imports: [RouterTestingModule],
      inputs: { collapsed: false },
    });
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
  });
});
