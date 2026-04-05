import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `<main><h1>Configurações</h1></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
