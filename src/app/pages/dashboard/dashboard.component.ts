import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<main><h1>Dashboard</h1></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
