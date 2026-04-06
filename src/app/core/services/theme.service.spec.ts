import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches, addEventListener: jest.fn() }),
    });
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    mockMatchMedia(true);

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  describe('init()', () => {
    it('deve usar o tema salvo no localStorage quando existe', () => {
      localStorage.setItem('theme', 'light');
      service.init();
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve usar prefers-color-scheme dark quando não há tema salvo', () => {
      mockMatchMedia(true);
      service.init();
      expect(service.isDark()).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('deve usar prefers-color-scheme light quando não há tema salvo', () => {
      mockMatchMedia(false);
      service.init();
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('deve preferir localStorage sobre prefers-color-scheme', () => {
      localStorage.setItem('theme', 'light');
      mockMatchMedia(true);
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
});
