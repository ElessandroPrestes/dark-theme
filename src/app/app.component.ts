import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  isDevMode,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
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

      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          startWith(null),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          window.requestAnimationFrame(() => {
            axe.run(document, {}, (err, results) => {
              if (err) return;
              results.violations.forEach((v) =>
                console.warn(`[axe] ${v.impact?.toUpperCase()} — ${v.description}`, v.nodes),
              );
            });
          });
        });
    });
  }
}
