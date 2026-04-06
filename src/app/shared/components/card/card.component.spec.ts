import { render } from '@testing-library/angular';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  it('deve renderizar o skeleton placeholder antes do defer carregar', async () => {
    const { container } = await render(CardComponent, {
      inputs: { title: 'Título', elevated: false },
    });
    // O placeholder é renderizado antes do @defer (on viewport) disparar
    expect(container.querySelector('.card-skeleton')).toBeInTheDocument();
  });

  it('deve ter aria-hidden no skeleton', async () => {
    const { container } = await render(CardComponent, {
      inputs: { title: '', elevated: false },
    });
    const skeleton = container.querySelector('.card-skeleton');
    expect(skeleton?.getAttribute('aria-hidden')).toBe('true');
  });

  it('deve aceitar input title sem lançar erros', async () => {
    await expect(
      render(CardComponent, {
        inputs: { title: 'Teste de Card', elevated: false },
      }),
    ).resolves.not.toThrow();
  });

  it('deve aceitar input elevated sem lançar erros', async () => {
    await expect(
      render(CardComponent, {
        inputs: { title: '', elevated: true },
      }),
    ).resolves.not.toThrow();
  });
});
