import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<main id="main-content"><h1>Início</h1></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
