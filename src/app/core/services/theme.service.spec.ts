import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  const mockMatchMedia = ({
    prefersDark = true,
    prefersReducedMotion = false,
  }: {
    prefersDark?: boolean;
    prefersReducedMotion?: boolean;
  } = {}) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? prefersDark : prefersReducedMotion,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-shift');
    delete (document as Document & { startViewTransition?: (callback: () => void) => void })
      .startViewTransition;
    mockMatchMedia();

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('init()', () => {
    it('deve usar o tema salvo no localStorage quando existe', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve usar prefers-color-scheme dark quando não há tema salvo', () => {
      mockMatchMedia({ prefersDark: true });
      service.init();
      expect(service.isDark()).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('deve usar prefers-color-scheme light quando não há tema salvo', () => {
      mockMatchMedia({ prefersDark: false });
      service.init();
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve preferir localStorage sobre prefers-color-scheme', () => {
      localStorage.setItem('theme', 'light');
      mockMatchMedia({ prefersDark: true });
      service.init();
      expect(service.isDark()).toBe(false);
    });
  });

  describe('toggle()', () => {
    it('deve alternar de dark para light', () => {
      service.init();
      expect(service.isDark()).toBe(true);
      service.toggle();
      expect(service.isDark()).toBe(false);
    });

    it('deve alternar de light para dark', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      service.toggle();
      expect(service.isDark()).toBe(true);
    });

    it('deve persistir o tema no localStorage após toggle', () => {
      service.init();
      service.toggle();
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('deve aplicar o data-theme no elemento html após toggle', () => {
      service.init();
      service.toggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve aplicar e remover a direção de transição ao alternar o tema', () => {
      jest.useFakeTimers();
      service.init();

      service.toggle();

      expect(document.documentElement.getAttribute('data-theme-shift')).toBe('sunrise');

      jest.advanceTimersByTime(901);

      expect(document.documentElement.hasAttribute('data-theme-shift')).toBe(false);
    });

    it('deve limpar a transição anterior quando o tema muda novamente antes do timeout', () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      service.init();

      service.toggle();
      service.toggle();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(document.documentElement.getAttribute('data-theme-shift')).toBe('sunset');
    });
  });

  describe('cssClass()', () => {
    it('deve retornar theme-dark quando dark', () => {
      service.init();
      expect(service.cssClass()).toBe('theme-dark');
    });

    it('deve retornar theme-light quando light', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      expect(service.cssClass()).toBe('theme-light');
    });
  });

  describe('setTheme()', () => {
    it('não deve reaplicar o tema quando o valor informado já está ativo', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      service.init();

      service.setTheme('dark');

      expect(setItemSpy).not.toHaveBeenCalled();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('deve usar startViewTransition quando houver suporte e movimento permitido', () => {
      const startViewTransition = jest.fn((callback: () => void) => callback());
      (
        document as Document & { startViewTransition?: (callback: () => void) => void }
      ).startViewTransition = startViewTransition;
      mockMatchMedia({ prefersDark: true, prefersReducedMotion: false });
      service.init();

      service.setTheme('light');

      expect(startViewTransition).toHaveBeenCalledTimes(1);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve ignorar startViewTransition quando o usuário prefere reduzir movimento', () => {
      const startViewTransition = jest.fn((callback: () => void) => callback());
      (
        document as Document & { startViewTransition?: (callback: () => void) => void }
      ).startViewTransition = startViewTransition;
      mockMatchMedia({ prefersDark: true, prefersReducedMotion: true });
      service.init();

      service.setTheme('light');

      expect(startViewTransition).not.toHaveBeenCalled();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve tratar a aplicação animada sem tema anterior informado', () => {
      (
        service as unknown as {
          apply: (
            animate: boolean,
            previousTheme?: 'dark' | 'light',
            nextTheme?: 'dark' | 'light',
          ) => void;
        }
      ).apply(true, undefined, 'light');

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.hasAttribute('data-theme-shift')).toBe(false);
    });
  });
});
