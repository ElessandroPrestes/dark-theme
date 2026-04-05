import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconButton, MatIconModule, MatTooltipModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  readonly title = input<string>('');
  readonly sidebarToggle = output<void>();

  protected readonly themeService = inject(ThemeService);

  // aria-label reflete a AÇÃO futura, não o estado atual — padrão WCAG
  protected readonly themeButtonLabel = computed(() =>
    this.themeService.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro',
  );

  protected onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  protected onThemeToggle(): void {
    this.themeService.toggle();
  }
}
