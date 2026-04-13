import { Injectable, computed, signal } from '@angular/core';

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => void;
};

const THEME_SHIFT_DURATION_MS = 900;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<'dark' | 'light'>('dark');
  private shiftTimeoutId: number | null = null;

  readonly isDark = computed(() => this.theme() === 'dark');
  readonly cssClass = computed(() => `theme-${this.theme()}`);

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: 'dark' | 'light'): void {
    if (theme === this.theme()) {
      return;
    }

    const previousTheme = this.theme();
    this.theme.set(theme);
    this.persist();
    this.apply(true, previousTheme, theme);
  }

  init(): void {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme.set(stored ?? preferred);
    this.apply(false);
  }

  private apply(
    animate: boolean,
    previousTheme?: 'dark' | 'light',
    nextTheme?: 'dark' | 'light',
  ): void {
    const root = document.documentElement;
    const resolvedTheme = nextTheme ?? this.theme();
    const supportsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as DocumentWithViewTransition;
    const shift = animate ? this.getShift(previousTheme ?? resolvedTheme, resolvedTheme) : null;

    this.applyShift(shift);

    if (animate && supportsMotion && doc.startViewTransition) {
      doc.startViewTransition(() => {
        root.setAttribute('data-theme', resolvedTheme);
      });
      return;
    }

    root.setAttribute('data-theme', resolvedTheme);
  }

  private getShift(
    previousTheme: 'dark' | 'light',
    nextTheme: 'dark' | 'light',
  ): 'sunrise' | 'sunset' | null {
    if (previousTheme === nextTheme) {
      return null;
    }

    return nextTheme === 'light' ? 'sunrise' : 'sunset';
  }

  private applyShift(shift: 'sunrise' | 'sunset' | null): void {
    const root = document.documentElement;

    if (this.shiftTimeoutId !== null) {
      window.clearTimeout(this.shiftTimeoutId);
      this.shiftTimeoutId = null;
    }

    root.removeAttribute('data-theme-shift');

    if (!shift) {
      return;
    }

    root.setAttribute('data-theme-shift', shift);
    this.shiftTimeoutId = window.setTimeout(() => {
      root.removeAttribute('data-theme-shift');
      this.shiftTimeoutId = null;
    }, THEME_SHIFT_DURATION_MS);
  }

  private persist(): void {
    localStorage.setItem('theme', this.theme());
  }
}
