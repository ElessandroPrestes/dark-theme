import { ChangeDetectionStrategy, Component, OnInit, inject, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly title = 'dark-theme';
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.init();
    if (isDevMode()) {
      this.initAxe();
    }
  }

  private initAxe(): void {
    import('axe-core').then(({ default: axe }) => {
      axe.configure({ reporter: 'v2' });
      axe.run(document, {}, (err, results) => {
        if (err) return;
        results.violations.forEach((v) =>
          console.warn(`[axe] ${v.impact?.toUpperCase()} — ${v.description}`, v.nodes),
        );
      });
    });
  }
}
