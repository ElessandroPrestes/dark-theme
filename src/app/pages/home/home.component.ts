import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    rememberMe: new FormControl(true, { nonNullable: true }),
  });
  protected readonly email = this.loginForm.controls.email;
  protected readonly password = this.loginForm.controls.password;
  protected readonly selectedThemeDescription = computed(() =>
    this.themeService.isDark() ? 'Lua ativa no modo escuro' : 'Sol ativo no modo claro',
  );
  protected readonly passwordButtonLabel = computed(() =>
    this.showPassword() ? 'Ocultar senha' : 'Mostrar senha',
  );

  protected selectTheme(theme: 'dark' | 'light'): void {
    this.themeService.setTheme(theme);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.submitted.set(false);
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitted.set(true);
  }
}
