import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<'dark' | 'light'>('dark');

  readonly isDark = computed(() => this.theme() === 'dark');
  readonly cssClass = computed(() => `theme-${this.theme()}`);

  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
    this.persist();
    this.apply();
  }

  init(): void {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    this.theme.set(stored ?? preferred);
    this.apply();
  }

  private apply(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  private persist(): void {
    localStorage.setItem('theme', this.theme());
  }
}
