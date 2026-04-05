import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

const NAV_ITEMS = [
  { route: '/', icon: 'home', label: 'Início' },
  { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { route: '/settings', icon: 'settings', label: 'Configurações' },
] as const;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  // Estado de colapso gerenciado pelo componente pai — separação de responsabilidades
  readonly collapsed = input<boolean>(false);

  protected readonly navItems = NAV_ITEMS;
}
